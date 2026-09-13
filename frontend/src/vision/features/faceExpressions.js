export function extractFaceExpressions(face, base) {
  if (!face) {
    return {
      hasFace: false,
      smile: 0,
      bigSmile: 0,
      jawOpen: 0,
      z_jaw: 0,
      winkLeft: 0,
      winkRight: 0,
      wink: 0,
      eyesClosed: false,
      wideEyes: false,
      eyebrowRaise: 0,
      eyebrowFurrow: 0,
      z_brow: 0,
      squint: 0,
      z_squint: 0,
      frown: 0,
      z_frown: 0,
      sneer: 0,
      z_sneer: 0,
      z_disgust: 0,
      turn: 0,
      headTurnSigned: 0,
      headTurnLeft: false,
      headTurnRight: false,
      headTilt: 0,
    }
  }

  const b = (name) => face.b(name)
  const pair = (name) => (b(name + 'Left') + b(name + 'Right')) / 2
  const zpair = (name) => {
    if (!base || base.generic) return (pair(name) - 0.05) / 0.035
    return (
      (base.z(name + 'Left', b(name + 'Left')) +
        base.z(name + 'Right', b(name + 'Right'))) /
      2
    )
  }

  const smileLeft = b('mouthSmileLeft')
  const smileRight = b('mouthSmileRight')
  const smile = Math.max(smileLeft, smileRight, pair('mouthSmile'))

  const jawOpen = b('jawOpen')
  const z_jaw = base && !base.generic ? base.z('jawOpen', jawOpen) : (jawOpen - 0.08) / 0.035

  const eyeBlinkLeft = b('eyeBlinkLeft')
  const eyeBlinkRight = b('eyeBlinkRight')
  const eyeWideLeft = b('eyeWideLeft')
  const eyeWideRight = b('eyeWideRight')

  // Wink detection: one eye squinted/closed while the other is open
  const winkLeft = Math.max(0, eyeBlinkLeft - eyeBlinkRight)
  const winkRight = Math.max(0, eyeBlinkRight - eyeBlinkLeft)
  const wink = Math.max(winkLeft, winkRight)
  const eyesClosed = eyeBlinkLeft > 0.5 && eyeBlinkRight > 0.5
  const wideEyes = (eyeWideLeft > 0.3 || eyeWideRight > 0.3) || (z_jaw > 4.0 && !eyesClosed)

  const eyebrowRaise = Math.max(
    b('browInnerUp'),
    b('browOuterUpLeft'),
    b('browOuterUpRight')
  )
  const eyebrowFurrow = pair('browDown')
  const z_brow = zpair('browDown')

  const squint = Math.max(pair('eyeSquint'), pair('eyeBlink'))
  const z_squint = Math.max(zpair('eyeSquint'), zpair('eyeBlink'))

  const frown = pair('mouthFrown')
  const z_frown = zpair('mouthFrown')
  const sneer = pair('noseSneer')
  const z_sneer = zpair('noseSneer')
  const z_lip = zpair('mouthUpperUp')

  const cap = (v) => Math.min(v, 8.0)
  const z_disgust = 2 * cap(z_sneer) + cap(z_brow) + cap(z_frown) + cap(z_lip)

  const headTurnSigned = face.turn_signed
  const turn = Math.abs(headTurnSigned - (base ? base.neutralTurn : 0.0))
  const headTurnLeft = headTurnSigned < -0.12
  const headTurnRight = headTurnSigned > 0.12

  // Head tilt using eye y-difference
  const p33 = face.pts[33] || face.center
  const p263 = face.pts[263] || face.center
  const headTilt = (p263[1] - p33[1]) / Math.max(face.w, 1.0)

  return {
    hasFace: true,
    smile,
    bigSmile: smile > 0.5 && jawOpen > 0.2 ? smile : 0,
    jawOpen,
    z_jaw,
    winkLeft,
    winkRight,
    wink,
    eyesClosed,
    wideEyes,
    eyebrowRaise,
    eyebrowFurrow,
    z_brow,
    squint,
    z_squint,
    frown,
    z_frown,
    sneer,
    z_sneer,
    z_disgust,
    turn,
    headTurnSigned,
    headTurnLeft,
    headTurnRight,
    headTilt,
  }
}
