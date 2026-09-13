import { useEffect, useRef, useState, useCallback } from 'react'
import { VisionDetector } from '../../vision/detector'
import { Face } from '../../vision/face'
import { Hand } from '../../vision/hand'
import { Body } from '../../vision/body'
import { MotionTracker } from '../../vision/motion'
import { measure, tongueScore } from '../../vision/measure'
import { decide } from '../../vision/classifier'
import { Baseline, CalibrationCollector } from '../../vision/calibration'
import { TemporalFilter } from '../../vision/temporalFilter'
import { OverlayRenderer } from '../../vision/overlay'
import CameraControls from './CameraControls'
import CalibrationModal from './CalibrationModal'
import { AlertTriangle, CameraOff } from 'lucide-react'

export default function CameraView() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const [isLoadingModel, setIsLoadingModel] = useState(true)
  const [isHudVisible, setIsHudVisible] = useState(false)
  const [activeReaction, setActiveReaction] = useState(null)
  const [baseline, setBaseline] = useState(() => Baseline.load())

  // Calibration state
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [calibModalOpen, setCalibModalOpen] = useState(false)
  const [calibProgress, setCalibProgress] = useState(null)
  const [calibWarnings, setCalibWarnings] = useState([])

  // Engine instance references
  const detectorRef = useRef(null)
  const motionRef = useRef(new MotionTracker())
  const temporalRef = useRef(new TemporalFilter())
  const rendererRef = useRef(new OverlayRenderer())

  const animFrameIdRef = useRef(null)
  const lastTimeRef = useRef(performance.now())
  const fpsRef = useRef(0)

  // Calibration collector ref
  const calibCollectorRef = useRef(null)
  const calibStartTimeRef = useRef(null)

  // Keyboard shortcuts for HUD and Test pose force keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'd' || e.key === 'D') {
        setIsHudVisible((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Initialize MediaPipe Vision Detector
  useEffect(() => {
    let mounted = true
    const detector = new VisionDetector()
    detectorRef.current = detector

    detector
      .init()
      .then(() => {
        if (mounted) setIsLoadingModel(false)
      })
      .catch((err) => {
        if (mounted) {
          setError('Failed to load MediaPipe vision models: ' + err.message)
          setIsLoadingModel(false)
        }
      })

    return () => {
      mounted = false
      detector.close()
    }
  }, [])

  // Start webcam media stream
  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.error('Camera access error:', err)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow webcam access in your browser settings.')
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No webcam device detected on your system.')
      } else {
        setError(`Unable to access camera: ${err.message}`)
      }
      setIsStreaming(false)
    }
  }, [])

  // Stop webcam media stream
  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current)
      animFrameIdRef.current = null
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
    setActiveReaction(null)
  }, [])

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  // Trigger personalized neutral face calibration
  const handleStartCalibration = () => {
    if (!isStreaming) {
      startCamera()
    }
    calibCollectorRef.current = new CalibrationCollector()
    calibStartTimeRef.current = performance.now()
    setCalibProgress(0)
    setCalibWarnings([])
    setIsCalibrating(true)
  }

  // Real-time Detection & Animation Loop
  const processFrame = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || video.readyState < 2 || !isStreaming) {
      animFrameIdRef.current = requestAnimationFrame(processFrame)
      return
    }

    const W = video.videoWidth || 640
    const H = video.videoHeight || 480

    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W
      canvas.height = H
    }

    const ctx = canvas.getContext('2d')
    const now = performance.now()
    const dt = now - lastTimeRef.current
    lastTimeRef.current = now
    if (dt > 0) {
      fpsRef.current = 0.9 * fpsRef.current + 0.1 * (1000 / dt)
    }

    // Run MediaPipe Task Landmarkers
    const detector = detectorRef.current
    if (detector && detector.isInitialized) {
      const { faceResult, handResult, poseResult } = detector.detectForVideo(video, now)

      const face =
        faceResult && faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0
          ? new Face(faceResult.faceLandmarks[0], faceResult.faceBlendshapes[0], W, H)
          : null

      const hands =
        handResult && handResult.handLandmarks
          ? handResult.handLandmarks.map((h) => new Hand(h, W, H))
          : []

      const body =
        poseResult && poseResult.poseLandmarks && poseResult.poseLandmarks.length > 0
          ? new Body(poseResult.poseLandmarks[0], W, H)
          : null

      // Handle Calibration Collection if actively calibrating
      if (isCalibrating && calibCollectorRef.current && calibStartTimeRef.current) {
        const elapsedSec = (now - calibStartTimeRef.current) / 1000
        const CALIB_TOTAL_SEC = 5.0
        const WARMUP_SEC = 1.0

        if (elapsedSec < CALIB_TOTAL_SEC) {
          setCalibProgress((elapsedSec / CALIB_TOTAL_SEC) * 100)
          if (elapsedSec > WARMUP_SEC && face) {
            calibCollectorRef.current.add(face)
          }
        } else {
          // Finish Calibration
          const newBase = calibCollectorRef.current.finish()
          const warnings = CalibrationCollector.getWarnings(newBase)
          newBase.save()
          setBaseline(newBase)
          setCalibProgress(100)
          setCalibWarnings(warnings)
          setIsCalibrating(false)
          calibCollectorRef.current = null
          calibStartTimeRef.current = null
        }
      }

      // Feature Extraction & Gesture Classification
      const m = face ? measure(face, baseline) : {}
      const tongue = face ? tongueScore(ctx, face, hands, m.z_jaw >= 3.5 && m.jaw >= 0.18) : 0.0
      const gesture = motionRef.current.update(hands, face)

      const { rawReaction, debugData } = decide(face, hands, body, tongue, gesture, m)
      debugData.rawPose = rawReaction

      // Temporal Filtering & Reaction Hold
      const { shown } = temporalRef.current.update(rawReaction, now)
      setActiveReaction(shown)

      // Render Overlay & Debug HUD on Canvas
      rendererRef.current.render({
        ctx,
        W,
        H,
        shownPose: shown,
        face,
        hands,
        body,
        debugData,
        isHudVisible,
        baseline,
        fps: fpsRef.current,
      })
    }

    animFrameIdRef.current = requestAnimationFrame(processFrame)
  }, [isStreaming, isCalibrating, isHudVisible, baseline])

  useEffect(() => {
    if (isStreaming) {
      animFrameIdRef.current = requestAnimationFrame(processFrame)
    } else {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
        animFrameIdRef.current = null
      }
    }
  }, [isStreaming, processFrame])

  const handleForcePose = (pose) => {
    temporalRef.current.forcePose(pose, 3000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-950/80 border border-red-800 p-4 text-red-200 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="font-semibold text-red-100">Webcam / Vision Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main Camera View Canvas Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full object-contain transform -scale-x-100 ${
            isStreaming ? 'block' : 'hidden'
          }`}
        />

        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full object-contain pointer-events-none transform -scale-x-100 ${
            isStreaming ? 'block' : 'hidden'
          }`}
        />

        {!isStreaming && (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center text-gray-400">
            <div className="rounded-full bg-gray-900 p-4 border border-gray-800">
              <CameraOff className="h-10 w-10 text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Camera Off</h3>
              <p className="text-sm max-w-sm text-gray-400 mt-1">
                Click "Start Camera" below to launch real-time MediaPipe facial & gesture meme recognition studio.
              </p>
            </div>
            <button
              onClick={startCamera}
              disabled={isLoadingModel}
              className="mt-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 transition disabled:opacity-50"
            >
              {isLoadingModel ? 'Loading MediaPipe Models...' : 'Start Camera'}
            </button>
          </div>
        )}

        {/* Reaction Active Tag Badge */}
        {isStreaming && activeReaction && (
          <div className="absolute top-4 right-4 z-10 rounded-xl bg-emerald-600/90 backdrop-blur-md px-4 py-2 text-white font-bold tracking-wide shadow-lg border border-emerald-400/40 animate-pulse">
            IT'S GIVING: {activeReaction.toUpperCase().replace('_', ' ')}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <CameraControls
        isStreaming={isStreaming}
        onStartCamera={startCamera}
        onStopCamera={stopCamera}
        isHudVisible={isHudVisible}
        onToggleHud={() => setIsHudVisible((prev) => !prev)}
        onOpenCalibration={() => setCalibModalOpen(true)}
        onForcePose={handleForcePose}
        activePose={activeReaction}
        calibrationStatus={baseline}
      />

      {/* Calibration Modal */}
      <CalibrationModal
        isOpen={calibModalOpen}
        onClose={() => setCalibModalOpen(false)}
        onStartCalibration={handleStartCalibration}
        progress={calibProgress}
        warnings={calibWarnings}
      />
    </div>
  )
}
