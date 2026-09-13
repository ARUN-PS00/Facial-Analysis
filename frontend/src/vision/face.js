export class Face {
  constructor(lms, blendshapes, W, H) {
    const pts = lms.map((l) => [l.x * W, l.y * H])
    this.pts = pts

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    for (const [x, y] of pts) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }

    this.box = [Math.floor(minX), Math.floor(minY), Math.ceil(maxX), Math.ceil(maxY)]
    this.w = Math.max(1, maxX - minX)
    this.h = Math.max(1, maxY - minY)
    this.center = [(minX + maxX) / 2, (minY + maxY) / 2]

    this.nose = pts[1] || [this.center[0], this.center[1]]
    this.chin = pts[152] || [this.center[0], maxY]
    this.top = pts[10] || [this.center[0], minY]

    const m13 = pts[13] || this.center
    const m14 = pts[14] || this.center
    this.mouth = [(m13[0] + m14[0]) / 2, (m13[1] + m14[1]) / 2]

    const p33 = pts[33] || this.center
    const p263 = pts[263] || this.center
    this.eye_y = (p33[1] + p263[1]) / 2

    const cl = pts[234] || [minX, this.center[1]]
    const cr = pts[454] || [maxX, this.center[1]]
    const turnSpan = Math.max(cr[0] - cl[0], 1e-3)
    this.turn_signed = (this.nose[0] - cl[0]) / turnSpan - 0.5

    this.bs = {}
    if (blendshapes) {
      const categories = blendshapes.categories || blendshapes
      if (Array.isArray(categories)) {
        for (const c of categories) {
          this.bs[c.categoryName || c.displayName] = c.score
        }
      }
    }
  }

  b(name) {
    return this.bs[name] || 0.0
  }
}
