import { useEffect, useRef, useState, useCallback } from 'react'
import { VisionDetector } from '../../vision/detector'
import { Face } from '../../vision/face'
import { Hand } from '../../vision/hand'
import { Body } from '../../vision/body'
import { MotionTracker } from '../../vision/motion'
import { measure, tongueScore } from '../../vision/measure'
import { extractAllFeatures } from '../../vision/classifier'
import { Baseline } from '../../vision/calibration'
import { ChallengeEngine } from '../../vision/challengeEngine'
import FloatingTargetMeme from './FloatingTargetMeme'
import ChallengeResultView from './ChallengeResultView'
import CameraControls from '../camera/CameraControls'
import CalibrationModal from '../camera/CalibrationModal'
import { OverlayRenderer } from '../../vision/overlay'
import { AlertTriangle, Sparkles, Trophy } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

export default function MemeChallengeView() {
  const { user } = useAuth()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(null)
  const [isLoadingModel, setIsLoadingModel] = useState(true)
  const [isHudVisible, setIsHudVisible] = useState(false)
  const [baseline] = useState(() => Baseline.load())

  // Game state
  const [challengeState, setChallengeState] = useState(null) // { roundIndex, totalRounds, targetMeme }
  const [liveChecklist, setLiveChecklist] = useState([])
  const [matchScore, setMatchScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(7)
  const [roundPopup, setRoundPopup] = useState(null) // { score, memeName }
  const [finalResults, setFinalResults] = useState(null)

  // Calibration modal
  const [calibModalOpen, setCalibModalOpen] = useState(false)

  // Engine refs
  const detectorRef = useRef(null)
  const motionRef = useRef(new MotionTracker())
  const challengeEngineRef = useRef(new ChallengeEngine(4)) // 4 rounds per session
  const rendererRef = useRef(new OverlayRenderer())

  const animFrameIdRef = useRef(null)
  const roundStartTimeRef = useRef(null)
  const lastScoreRef = useRef(0)

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

  const startNextRound = useCallback((engine) => {
    const roundData = engine.nextChallenge()
    setChallengeState(roundData)
    setLiveChecklist(roundData.targetMeme.targetFeatures.checklist.map(c => ({ ...c, matched: false })))
    setMatchScore(0)
    setTimeRemaining(7)
    roundStartTimeRef.current = performance.now()
    lastScoreRef.current = 0
  }, [])

  const handleStartGame = async () => {
    if (!isStreaming) {
      await startCamera()
    }
    setFinalResults(null)
    const engine = challengeEngineRef.current
    engine.startSession(4) // 4 rounds
    setIsPlaying(true)
    startNextRound(engine)
  }

  // Live detection & game loop
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

      const m = face ? measure(face, baseline) : {}
      const tongue = face ? tongueScore(ctx, face, hands, m.z_jaw >= 3.5 && m.jaw >= 0.18) : 0.0
      const features = extractAllFeatures(face, hands, body, tongue, motionRef.current, baseline)

      if (isPlaying && challengeState && roundStartTimeRef.current) {
        const elapsedSec = (now - roundStartTimeRef.current) / 1000
        const ROUND_DURATION = 7.0 // 7 seconds per round

        if (elapsedSec < ROUND_DURATION) {
          const remaining = Math.max(0, Math.ceil(ROUND_DURATION - elapsedSec))
          setTimeRemaining(remaining)

          const { liveChecklist: checklist, matchScore: score } = challengeEngineRef.current.evaluateLiveMatch(features)
          setLiveChecklist(checklist)
          setMatchScore(score)
          lastScoreRef.current = Math.max(lastScoreRef.current, score)
        } else {
          // Round Finished!
          const finalRoundScore = lastScoreRef.current
          const engine = challengeEngineRef.current
          engine.recordChallengeResult(finalRoundScore)

          setRoundPopup({
            score: finalRoundScore,
            memeName: challengeState.targetMeme.name,
          })

          roundStartTimeRef.current = null

          setTimeout(() => {
            setRoundPopup(null)
            if (engine.currentRound < engine.totalRounds) {
              startNextRound(engine)
            } else {
              // 4 Rounds Completed -> Show Final Results
              setIsPlaying(false)
              engine.calculateFinalSessionResults(user).then((res) => {
                setFinalResults(res)
                stopCamera()
              })
            }
          }, 1500)
        }
      }

      // Render HUD if enabled
      rendererRef.current.render({
        ctx,
        W,
        H,
        shownPose: null,
        face,
        hands,
        body,
        debugData: {
          hands: hands.length,
          rawPose: challengeState?.targetMeme?.name || '-',
          confidence: matchScore / 100,
        },
        isHudVisible,
        baseline,
        fps: 60,
      })
    }

    animFrameIdRef.current = requestAnimationFrame(processFrame)
  }, [isStreaming, isPlaying, challengeState, baseline, startNextRound, stopCamera, isHudVisible, matchScore, user])

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

  if (finalResults) {
    return <ChallengeResultView results={finalResults} onPlayAgain={handleStartGame} />
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-950/80 border border-red-800 p-4 text-red-200 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Full-Screen Dominant Camera View Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border-2 border-gray-800 bg-gray-950 shadow-2xl flex items-center justify-center">
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

        {/* Floating Target Meme Card Overlay */}
        {isPlaying && challengeState && (
          <FloatingTargetMeme
            targetMeme={challengeState.targetMeme}
            liveChecklist={liveChecklist}
            matchScore={matchScore}
            timeRemaining={timeRemaining}
          />
        )}

        {/* Challenge Round Badge Overlay */}
        {isPlaying && challengeState && (
          <div className="absolute top-6 left-6 z-20 rounded-xl bg-gray-950/85 border border-purple-500/40 px-4 py-2 text-white font-extrabold text-sm backdrop-blur-md shadow-lg flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" /> ROUND {challengeState.roundIndex} / {challengeState.totalRounds}
          </div>
        )}

        {/* Round Transition Score Popup */}
        {roundPopup && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="rounded-3xl border-2 border-purple-500 bg-gray-950 p-8 text-center shadow-2xl space-y-2">
              <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">ROUND COMPLETE!</p>
              <h3 className="text-2xl font-extrabold text-white">{roundPopup.memeName}</h3>
              <p className="text-4xl font-extrabold text-emerald-400 font-mono pt-2">
                🔥 {roundPopup.score} / 100
              </p>
            </div>
          </div>
        )}

        {/* Start Game Hero Overlay */}
        {!isStreaming && (
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center text-gray-400 z-10">
            <div className="rounded-full bg-purple-950/70 p-6 border border-purple-800/50 text-purple-300 shadow-2xl">
              <Sparkles className="h-12 w-12" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-white">Meme Recreation Challenge</h3>
              <p className="text-sm max-w-md text-gray-300">
                A random target meme floats over your camera stream. Recreate the expression & gesture before the 7s timer expires!
              </p>
            </div>
            <button
              onClick={handleStartGame}
              disabled={isLoadingModel}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-extrabold px-9 py-4 transition shadow-2xl shadow-purple-950/60 disabled:opacity-50 text-lg tracking-wide"
            >
              {isLoadingModel ? 'Loading MediaPipe Models...' : '🚀 START 4-ROUND CHALLENGE'}
            </button>
          </div>
        )}
      </div>

      <CameraControls
        isStreaming={isStreaming}
        onStartCamera={startCamera}
        onStopCamera={stopCamera}
        isHudVisible={isHudVisible}
        onToggleHud={() => setIsHudVisible((prev) => !prev)}
        onOpenCalibration={() => setCalibModalOpen(true)}
        onForcePose={() => {}}
        activePose={challengeState?.targetMeme?.name}
        calibrationStatus={baseline}
      />

      <CalibrationModal
        isOpen={calibModalOpen}
        onClose={() => setCalibModalOpen(false)}
        onStartCalibration={() => {}}
        progress={null}
        warnings={[]}
      />
    </div>
  )
}
