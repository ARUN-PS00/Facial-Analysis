export function extractPoseGestures(body) {
  if (!body || !body.seen) {
    return {
      bodySeen: false,
      elbowsUp: false,
      armsRaised: false,
    }
  }

  const shoulderY = (body.shoulders[0][1] + body.shoulders[1][1]) / 2
  const elbowsUp = body.elbows_up
  const armsRaised = body.wrists[0][1] < shoulderY && body.wrists[1][1] < shoulderY

  return {
    bodySeen: true,
    elbowsUp,
    armsRaised,
  }
}
