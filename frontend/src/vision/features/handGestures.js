function dist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}

export function extractHandGestures(hands, face) {
  if (!hands || hands.length === 0) {
    return {
      handCount: 0,
      thumbsUp: false,
      thumbsDown: false,
      peaceSign: false,
      okSign: false,
      pointing: false,
      rockHorns: false,
      openPalm: false,
      fist: false,
      heartGesture: false,
      facepalm: false,
      timeOutGesture: false,
      noseClosedGesture: false,
      flirtyGesture: false,
      handUpGesture: false,
      handsRaised: false,
    }
  }

  const fw = face ? face.w : 200
  const near = (a, b, k) => dist(a, b) < k * fw

  let thumbsUp = false
  let thumbsDown = false
  let peaceSign = false
  let okSign = false
  let pointing = false
  let rockHorns = false
  let openPalm = false
  let fist = false
  let noseClosedGesture = false
  let flirtyGesture = false
  let handUpGesture = false
  let handsRaised = false

  for (const h of hands) {
    const pts = h.pts
    if (!pts || pts.length < 21) continue

    // Hand scale reference (wrist 0 to middle knuckle 9)
    const handScale = Math.max(dist(pts[0], pts[9]), 20)

    // Finger extension checks relative to hand scale
    const thumbExt = dist(pts[0], pts[4]) > 1.0 * handScale
    const indexExt = dist(pts[0], pts[8]) > 1.1 * handScale
    const middleExt = dist(pts[0], pts[12]) > 1.1 * handScale
    const ringExt = dist(pts[0], pts[16]) > 1.1 * handScale
    const pinkyExt = dist(pts[0], pts[20]) > 1.1 * handScale

    // Folded fingers test
    const foldedFingers = !indexExt && !middleExt && !ringExt && !pinkyExt

    // Thumbs Up / Thumbs Down
    if (thumbExt && foldedFingers) {
      if (pts[4][1] < pts[3][1] && pts[4][1] < pts[0][1]) {
        thumbsUp = true
      } else if (pts[4][1] > pts[3][1] && pts[4][1] > pts[0][1]) {
        thumbsDown = true
      }
    }

    // Peace Sign (V)
    if (indexExt && middleExt && !ringExt && !pinkyExt) {
      peaceSign = true
    }

    // Pointing
    if (indexExt && !middleExt && !ringExt && !pinkyExt) {
      pointing = true
    }

    // Rock / Horns (Index + Pinky extended)
    if (indexExt && pinkyExt && !middleExt && !ringExt) {
      rockHorns = true
    }

    // OK Sign (Thumb & Index tip touching, others extended)
    if (dist(pts[4], pts[8]) < 0.35 * handScale && middleExt && ringExt) {
      okSign = true
    }

    // Open Palm & Fist
    if (h.open) openPalm = true
    if (!thumbExt && !indexExt && !middleExt && !ringExt && !pinkyExt) fist = true

    // Check if hands are raised high in the frame
    if (face && h.palm[1] < face.center[1]) {
      handsRaised = true
    }

    // Face interaction gestures
    if (face) {
      if (near(pts[4], face.nose, 0.35) && near(pts[8], face.nose, 0.35)) {
        noseClosedGesture = true
      }
      if (near(pts[8], face.mouth, 0.25) && !near(h.palm, face.mouth, 0.35)) {
        flirtyGesture = true
      }
      if (h.open && h.palm[1] < face.nose[1] && Math.abs(h.palm[0] - face.nose[0]) > 0.7 * fw) {
        handUpGesture = true
      }
    }
  }

  // 2-Hand gestures
  let heartGesture = false
  let timeOutGesture = false
  let facepalm = false

  if (hands.length >= 2) {
    const a = hands[0]
    const b = hands[1]

    for (const [top, under] of [[a, b], [b, a]]) {
      if (top.horizontal && under.vertical && top.palm[1] < under.palm[1] && near(under.middle, top.palm, 0.6)) {
        timeOutGesture = true
      }
    }

    if (near(a.index, b.index, 0.4) && near(a.thumb, b.thumb, 0.4) && (a.index[1] + b.index[1]) < (a.thumb[1] + b.thumb[1])) {
      heartGesture = true
    }
  }

  if (face) {
    for (const h of hands) {
      if (near(h.palm, face.center, 0.5) || near(h.palm, face.mouth, 0.5)) {
        facepalm = true
      }
    }
  }

  return {
    handCount: hands.length,
    thumbsUp,
    thumbsDown,
    peaceSign,
    okSign,
    pointing,
    rockHorns,
    openPalm,
    fist,
    heartGesture,
    facepalm,
    timeOutGesture,
    noseClosedGesture,
    flirtyGesture,
    handUpGesture,
    handsRaised,
  }
}
