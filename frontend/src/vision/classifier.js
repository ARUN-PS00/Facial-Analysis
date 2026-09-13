import { extractFaceExpressions } from './features/faceExpressions'
import { extractHandGestures } from './features/handGestures'
import { extractPoseGestures } from './features/poseGestures'
import { extractMotionFeatures } from './features/motionFeatures'
import { REACTION_DEFINITIONS } from './reactions'

export function extractAllFeatures(face, hands, body, tongue, motionTracker, base) {
  const faceFeats = extractFaceExpressions(face, base)
  const handFeats = extractHandGestures(hands, face)
  const poseFeats = extractPoseGestures(body)
  const motionFeats = extractMotionFeatures(motionTracker, hands, face)

  return {
    face: faceFeats,
    hands: handFeats,
    pose: poseFeats,
    motion: motionFeats,
    tongue,
  }
}

export function decide(face, hands, body, tongue, gesture, m, featuresInput = null, baseInput = null) {
  const features =
    featuresInput ||
    extractAllFeatures(
      face,
      hands,
      body,
      tongue,
      { update: () => gesture },
      baseInput || { z: () => 0, neutralTurn: 0 }
    )

  // Sort reaction definitions by priority descending
  const sortedReactions = [...REACTION_DEFINITIONS].sort((a, b) => b.priority - a.priority)

  for (const rx of sortedReactions) {
    const result = rx.detect(features)
    if (result.match) {
      return {
        rawReaction: rx.id,
        category: rx.category,
        confidence: result.confidence,
        debugData: {
          hands: hands ? hands.length : 0,
          rawPose: rx.id,
          confidence: result.confidence,
          category: rx.category,
          jaw: features.face.jawOpen,
          z_jaw: features.face.z_jaw,
          squint: features.face.squint,
          z_squint: features.face.z_squint,
          turn: features.face.turn,
          tongue: features.tongue,
          gesture: features.motion.motionEnergy,
          z_disgust: features.face.z_disgust,
          elbows_up: features.pose.elbowsUp,
        },
      }
    }
  }

  return {
    rawReaction: null,
    category: null,
    confidence: 0,
    debugData: {
      hands: hands ? hands.length : 0,
      rawPose: null,
      confidence: 0,
      jaw: features.face.jawOpen,
      z_jaw: features.face.z_jaw,
      squint: features.face.squint,
      z_squint: features.face.z_squint,
      turn: features.face.turn,
      tongue: features.tongue,
      gesture: features.motion.motionEnergy,
      z_disgust: features.face.z_disgust,
      elbows_up: features.pose.elbowsUp,
    },
  }
}
