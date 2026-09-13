export class Body {
  constructor(lms, W, H) {
    const pts = lms.map((l) => [l.x * W, l.y * H])
    this.pts = pts

    // Shoulders 11, 12; Elbows 13, 14; Wrists 15, 16
    this.shoulders = [pts[11], pts[12]]
    this.elbows = [pts[13], pts[14]]
    this.wrists = [pts[15], pts[16]]

    const vis = [11, 12, 13, 14].map((i) => (lms[i] && lms[i].visibility !== undefined ? lms[i].visibility : 1.0))
    const minVis = Math.min(...vis)
    this.seen = minVis > 0.5

    const shoulderY = (this.shoulders[0][1] + this.shoulders[1][1]) / 2
    this.elbows_up = this.seen && this.elbows[0][1] < shoulderY && this.elbows[1][1] < shoulderY
  }
}
