import {
  FilesetResolver,
  FaceLandmarker,
  HandLandmarker,
  PoseLandmarker,
} from '@mediapipe/tasks-vision'

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm'

const MODEL_URLS = {
  face: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
  hand: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
  pose: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
}

export class VisionDetector {
  constructor() {
    this.visionFiles = null
    this.faceLandmarker = null
    this.handLandmarker = null
    this.poseLandmarker = null
    this.isInitialized = false
    this.initPromise = null
  }

  async init() {
    if (this.isInitialized) return
    if (this.initPromise) return this.initPromise

    this.initPromise = (async () => {
      try {
        this.visionFiles = await FilesetResolver.forVisionTasks(WASM_URL)

        this.faceLandmarker = await FaceLandmarker.createFromOptions(this.visionFiles, {
          baseOptions: {
            modelAssetPath: MODEL_URLS.face,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: true,
        })

        this.handLandmarker = await HandLandmarker.createFromOptions(this.visionFiles, {
          baseOptions: {
            modelAssetPath: MODEL_URLS.hand,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        })

        this.poseLandmarker = await PoseLandmarker.createFromOptions(this.visionFiles, {
          baseOptions: {
            modelAssetPath: MODEL_URLS.pose,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        })

        this.isInitialized = true
      } catch (err) {
        console.warn('GPU delegate failed for MediaPipe, falling back to CPU:', err)
        try {
          // Fallback to CPU if GPU delegate is unavailable
          this.faceLandmarker = await FaceLandmarker.createFromOptions(this.visionFiles, {
            baseOptions: { modelAssetPath: MODEL_URLS.face, delegate: 'CPU' },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: true,
          })
          this.handLandmarker = await HandLandmarker.createFromOptions(this.visionFiles, {
            baseOptions: { modelAssetPath: MODEL_URLS.hand, delegate: 'CPU' },
            runningMode: 'VIDEO',
            numHands: 2,
          })
          this.poseLandmarker = await PoseLandmarker.createFromOptions(this.visionFiles, {
            baseOptions: { modelAssetPath: MODEL_URLS.pose, delegate: 'CPU' },
            runningMode: 'VIDEO',
            numPoses: 1,
          })
          this.isInitialized = true
        } catch (cpuErr) {
          console.error('Failed to initialize MediaPipe Vision Landmarkers:', cpuErr)
          throw cpuErr
        }
      }
    })()

    return this.initPromise
  }

  detectForVideo(videoElement, timestampMs) {
    if (!this.isInitialized || !videoElement || videoElement.readyState < 2) {
      return { faceResult: null, handResult: null, poseResult: null }
    }

    try {
      const faceResult = this.faceLandmarker.detectForVideo(videoElement, timestampMs)
      const handResult = this.handLandmarker.detectForVideo(videoElement, timestampMs)
      const poseResult = this.poseLandmarker.detectForVideo(videoElement, timestampMs)

      return { faceResult, handResult, poseResult }
    } catch (err) {
      console.error('Error during MediaPipe detection:', err)
      return { faceResult: null, handResult: null, poseResult: null }
    }
  }

  close() {
    if (this.faceLandmarker) this.faceLandmarker.close()
    if (this.handLandmarker) this.handLandmarker.close()
    if (this.poseLandmarker) this.poseLandmarker.close()
    this.isInitialized = false
    this.initPromise = null
  }
}
