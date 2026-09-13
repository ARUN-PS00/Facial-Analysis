import { Z_CAP } from './constants'

function dist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}

export function measure(face, base) {
  const pair = (name) => (face.b(name + 'Left') + face.b(name + 'Right')) / 2
  const zpair = (name) =>
    (base.z(name + 'Left', face.b(name + 'Left')) +
      base.z(name + 'Right', face.b(name + 'Right'))) /
    2

  const jaw = face.b('jawOpen')
  const z_jaw = base.z('jawOpen', jaw)
  const sneer = pair('noseSneer')
  const z_sneer = zpair('noseSneer')
  const z_brow = zpair('browDown')
  const z_frown = zpair('mouthFrown')
  const z_lip = zpair('mouthUpperUp')
  const squint = Math.max(pair('eyeSquint'), pair('eyeBlink'))
  const z_squint = Math.max(zpair('eyeSquint'), zpair('eyeBlink'))
  const turn = Math.abs(face.turn_signed - base.neutralTurn)

  const cap = (v) => Math.min(v, Z_CAP)
  const z_disgust = 2 * cap(z_sneer) + cap(z_brow) + cap(z_frown) + cap(z_lip)

  return {
    jaw,
    z_jaw,
    sneer,
    z_sneer,
    z_brow,
    z_frown,
    z_lip,
    squint,
    z_squint,
    turn,
    z_disgust,
  }
}

export function tongueScore(canvasCtx, face, hands, jawReady) {
  if (!jawReady || !face || !canvasCtx) return 0.0

  // If any hand is near the mouth, ignore tongue score to prevent false triggers
  for (const h of hands) {
    if (dist(h.palm, face.mouth) < 0.7 * face.w) {
      return 0.0
    }
  }

  // Mouth open blendshapes or inner lip landmarks checking
  const jawScore = face.b('jawOpen')
  const mouthFunnel = face.b('mouthFunnel') || face.b('mouthPucker') || 0.0

  // Tongue out blendshapes in MediaPipe (if available, e.g. tongueOut)
  const tongueOutBs = face.b('tongueOut')
  if (tongueOutBs > 0.3) {
    return tongueOutBs
  }

  // If jaw is sufficiently wide open, evaluate lip ratio
  if (jawScore > 0.3) {
    return Math.min(jawScore + mouthFunnel * 0.5, 1.0)
  }

  return 0.0
}
