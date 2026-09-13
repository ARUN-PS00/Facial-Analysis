export function extractMotionFeatures(motionTracker, hands, face) {
  const energy = motionTracker.update(hands, face)
  const waving = energy > 0.04 && hands.some((h) => h.open)

  return {
    motionEnergy: energy,
    waving,
  }
}
