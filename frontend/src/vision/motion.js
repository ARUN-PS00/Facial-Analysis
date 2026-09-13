function dist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}

export class MotionTracker {
  constructor() {
    this.prev = []
    this.energy = 0.0
    this.fw = 200.0
  }

  update(hands, face) {
    if (face) {
      this.fw = Math.max(face.w, 1.0)
    }

    const cur = hands.map((h) => h.palm)
    let speed = 0.0

    if (cur.length > 0 && this.prev.length > 0) {
      const moved = cur
        .map((c) => Math.min(...this.prev.map((p) => dist(c, p))))
        .filter((m) => m < this.fw)

      if (moved.length > 0) {
        speed = Math.max(...moved) / this.fw
      }
    }

    this.energy = 0.8 * this.energy + 0.2 * speed
    this.prev = cur
    return this.energy
  }

  reset() {
    this.prev = []
    this.energy = 0.0
  }
}
