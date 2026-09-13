import { useEffect, useRef, useState, useCallback } from 'react'
import { VisionDetector } from '../../vision/detector'
import { Face } from '../../vision/face'
import { Hand } from '../../vision/hand'
import { Body } from '../../vision/body'
import { MotionTracker } from '../../vision/motion'
import { measure, tongueScore } from '../../vision/measure'
import { decide, extractAllFeatures } from '../../vision/classifier'
import { Baseline } from '../../vision/calibration'
import { ScoreEngine } from '../../vision/scoreEngine'
import ScoreResultView from './ScoreResultView'
import { AlertTriangle, Sparkles, RefreshCw } from 'lucide-react'

export default function MemeScoreView() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [error, setError] = useState(null)
  const [isLoadingModel, setIsLoadingModel] = useState(true)
  const [baseline] = useState(() => Baseline.load())
  const [results, setResults] = useState(null)

  const detectorRef = useRef(null)
  const motionRef = useRef(new MotionTracker())
  const scoreEngineRef = useRef(new ScoreEngine())

  const animFrameIdRef = useRef(null)
  const scanStartTimeRef = useRef(null)

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

  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setError(`Unable to access camera: ${err.message}`)
      setIsStreaming(false)
    }
  }, [])

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
  }, [])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  const handleStartScan = async () => {
    if (!isStreaming) {
      await startCamera()
    }
    scoreEngineRef.current.reset()
    scanStartTimeRef.current = performance.now()
    setScanProgress(0)
    setResults(null)
    setIsScanning(true)
  }

  // Scanning loop
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
    ctx.clearRect(0, 0, W, H)
    const now = performance.now()

    const detector = detectorRef.current
    if (detector && detector.isInitialized) {
      const { faceResult, handResult, poseResult } = detector.detectForVideo(video, now)

      const face =
        faceResult && faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0
          ? new Face(faceResult.faceLandmarks[0], faceResult.faceBlendshapes[0], W, H)
          : null

      const hands = handResult && handResult.handLandmarks ? handResult.handLandmarks.map((h) => new Hand(h, W, H)) : []

      const body =
        poseResult && poseResult.poseLandmarks && poseResult.poseLandmarks.length > 0
          ? new Body(poseResult.poseLandmarks[0], W, H)
          : null

      // Draw detection markers on canvas
      if (face) {
        const [x0, y0, x1, y1] = face.box
        ctx.strokeStyle = '#10B981'
        ctx.lineWidth = 2
        ctx.strokeRect(x0, y0, x1 - x0, y1 - y0)
      }

      if (isScanning && scanStartTimeRef.current) {
        const elapsed = (now - scanStartTimeRef.current) / 1000
        const DURATION = 8.0 // 8 second session

        if (elapsed < DURATION) {
          setScanProgress((elapsed / DURATION) * 100)

          const m = face ? measure(face, baseline) : {}
          const tongue = face ? tongueScore(ctx, face, hands, m.z_jaw >= 3.5 && m.jaw >= 0.18) : 0.0
          const gesture = motionRef.current.update(hands, face)

          const features = extractAllFeatures(face, hands, body, tongue, motionRef.current, baseline)
          const rxResult = decide(face, hands, body, tongue, gesture, m, features, baseline)

          scoreEngineRef.current.accumulateFrame(rxResult, features)
        } else {
          // Scan Complete -> Calculate Final Personality Profile
          setIsScanning(false)
          setScanProgress(100)
          scoreEngineRef.current.calculateFinalResults().then((res) => {
            setResults(res)
            stopCamera()
          })
          scanStartTimeRef.current = null
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(processFrame)
  }, [isStreaming, isScanning, baseline, stopCamera])

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

  if (results) {
    return <ScoreResultView results={results} onRetry={handleStartScan} />
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4">
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-950/80 border border-red-800 p-4 text-red-200 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Camera Scan Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full object-contain transform -scale-x-100 ${isStreaming ? 'block' : 'hidden'}`}
        />

        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full object-contain pointer-events-none transform -scale-x-100 ${isStreaming ? 'block' : 'hidden'}`}
        />

        {!isStreaming && (
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center text-gray-400">
            <div className="rounded-full bg-purple-950/60 p-5 border border-purple-800/40 text-purple-400">
              <Sparkles className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Meme Personality Scanner</h3>
              <p className="text-sm max-w-md text-gray-400 mt-1">
                Run an 8-second camera scan. Express yourself naturally or try different facial expressions and gestures to generate your personality breakdown!
              </p>
            </div>
            <button
              onClick={handleStartScan}
              disabled={isLoadingModel}
              className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3.5 transition shadow-xl shadow-purple-950/50 disabled:opacity-50 flex items-center gap-2 text-base"
            >
              {isLoadingModel ? 'Loading MediaPipe Models...' : 'Start 8s Personality Scan'}
            </button>
          </div>
        )}

        {/* Scanning Overlay & Progress Bar */}
        {isScanning && (
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm animate-pulse">
              <RefreshCw className="h-4 w-4 animate-spin" /> Analyzing facial & gesture energy...
            </div>
            <div className="w-full max-w-md h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-200"
                style={{ width: `${Math.min(100, Math.max(0, scanProgress))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
