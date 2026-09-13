import { POSES, ARM, HOLD_FRAMES } from './constants'

export class TemporalFilter {
  constructor() {
    this.arm = {}
    this.shown = null
    this.hold = 0
    this.shownSince = 0
    this.forced = null
    this.forcedUntil = 0

    for (const p of POSES) {
      this.arm[p] = 0
    }
  }

  update(rawReaction, nowMs = performance.now()) {
    let fired = null

    for (const p of POSES) {
      this.arm[p] = rawReaction === p ? this.arm[p] + 1 : 0
      const threshold = ARM[p] || 3
      if (rawReaction === p && this.arm[p] >= threshold) {
        fired = p
      }
    }

    if (this.forced && nowMs < this.forcedUntil) {
      fired = this.forced
    }

    if (fired) {
      if (fired !== this.shown) {
        this.shownSince = nowMs
      }
      this.shown = fired
      this.hold = HOLD_FRAMES
    } else if (this.hold > 0) {
      this.hold--
    } else {
      this.shown = null
    }

    return {
      shown: this.shown,
      shownSince: this.shownSince,
      hold: this.hold,
    }
  }

  forcePose(pose, durationMs = 3000) {
    this.forced = pose
    this.forcedUntil = performance.now() + durationMs
  }

  reset() {
    for (const p of POSES) {
      this.arm[p] = 0
    }
    this.shown = null
    this.hold = 0
    this.shownSince = 0
    this.forced = null
    this.forcedUntil = 0
  }
}
