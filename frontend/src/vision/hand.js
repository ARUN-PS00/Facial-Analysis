function dist(a, b) {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  return Math.hypot(dx, dy)
}

export class Hand {
  constructor(lms, W, H) {
    const pts = lms.map((l) => [l.x * W, l.y * H])
    this.pts = pts

    // Palm center average of points [0, 5, 9, 13, 17]
    const palmIndices = [0, 5, 9, 13, 17]
    let sumX = 0,
      sumY = 0
    for (const idx of palmIndices) {
      sumX += pts[idx][0]
      sumY += pts[idx][1]
    }
    this.palm = [sumX / palmIndices.length, sumY / palmIndices.length]

    this.thumb = pts[4]
    this.index = pts[8]
    this.middle = pts[12]
    this.ring = pts[16]
    this.pinky = pts[20]

    const d = [pts[9][0] - pts[0][0], pts[9][1] - pts[0][1]]
    this.horizontal = Math.abs(d[0]) > 1.5 * Math.abs(d[1])
    this.vertical = Math.abs(d[1]) > 1.5 * Math.abs(d[0])

    const tips = [8, 12, 16, 20]
    let extendedCount = 0
    for (const t of tips) {
      if (dist(pts[0], pts[t]) > 1.2 * dist(pts[0], pts[t - 2])) {
        extendedCount++
      }
    }
    this.open = extendedCount >= 3
  }
}
