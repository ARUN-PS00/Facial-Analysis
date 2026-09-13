import { GENERIC_MEAN, GENERIC_SIGMA } from './constants'

const CALIB_STORAGE_KEY = 'facial_analysis_calibration'
const SIGMA_FLOOR = 0.015
const SIGMA_CEIL = 0.08

export class Baseline {
  constructor(mean = null, sigma = null, samples = 0, made = null) {
    this.mean = mean || {}
    this.sigma = sigma || {}
    this.samples = samples
    this.made = made
    this.generic = !mean || Object.keys(mean).length === 0
  }

  z(name, value) {
    if (this.generic) {
      const gMean = GENERIC_MEAN[name] ?? 0.02
      return (value - gMean) / GENERIC_SIGMA
    }
    const m = this.mean[name]
    if (m === undefined) {
      const gMean = GENERIC_MEAN[name] ?? 0.02
      return (value - gMean) / GENERIC_SIGMA
    }
    const s = this.sigma[name] ?? SIGMA_CEIL
    return (value - m) / s
  }

  get neutralTurn() {
    return !this.generic ? this.mean['turn_signed'] || 0.0 : 0.0
  }

  save() {
    try {
      const payload = {
        version: 1,
        made: this.made || new Date().toISOString(),
        samples: this.samples,
        mean: this.mean,
        sigma: this.sigma,
      }
      localStorage.setItem(CALIB_STORAGE_KEY, JSON.stringify(payload))
    } catch (err) {
      console.error('Failed to save calibration:', err)
    }
  }

  static load() {
    try {
      const dataStr = localStorage.getItem(CALIB_STORAGE_KEY)
      if (!dataStr) return new Baseline()
      const data = JSON.parse(dataStr)
      if (data.version !== 1 || !data.mean) return new Baseline()
      return new Baseline(data.mean, data.sigma || {}, data.samples || 0, data.made)
    } catch {
      return new Baseline()
    }
  }

  static clear() {
    localStorage.removeItem(CALIB_STORAGE_KEY)
  }
}

export class CalibrationCollector {
  constructor() {
    this.n = 0
    this.s = {}
    this.ss = {}
  }

  add(face) {
    this.n++
    const entries = [...Object.entries(face.bs), ['turn_signed', face.turn_signed]]
    for (const [name, v] of entries) {
      this.s[name] = (this.s[name] || 0.0) + v
      this.ss[name] = (this.ss[name] || 0.0) + v * v
    }
  }

  finish() {
    if (this.n === 0) return new Baseline()

    const mean = {}
    const sigma = {}
    for (const name of Object.keys(this.s)) {
      const m = this.s[name] / this.n
      const variance = Math.max(this.ss[name] / this.n - m * m, 0.0)
      const stdDev = Math.sqrt(variance)

      mean[name] = Number(m.toFixed(5))
      sigma[name] = Number(Math.min(Math.max(stdDev, SIGMA_FLOOR), SIGMA_CEIL).toFixed(5))
    }

    const turnSigma = sigma['turn_signed'] || 0.02
    sigma['turn_signed'] = Math.min(Math.max(turnSigma, 0.01), 0.1)

    const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return new Baseline(mean, sigma, this.n, dateStr)
  }

  static getWarnings(baseline) {
    const warnings = []
    if ((baseline.mean['jawOpen'] || 0) > 0.3) {
      warnings.push("Your mouth was open — keep a neutral resting face during calibration.")
    }
    const maxSneer = Math.max(baseline.mean['noseSneerLeft'] || 0, baseline.mean['noseSneerRight'] || 0)
    if (maxSneer > 0.15) {
      warnings.push("Your nose was scrunched — hold a calm expression.")
    }
    const maxBrow = Math.max(baseline.mean['browInnerUp'] || 0, baseline.mean['browOuterUpLeft'] || 0)
    if (maxBrow > 0.35) {
      warnings.push("Your eyebrows were raised — relax your face.")
    }
    let pinnedCount = 0
    for (const v of Object.values(baseline.sigma)) {
      if (v >= SIGMA_CEIL) pinnedCount++
    }
    if (pinnedCount > 12) {
      warnings.push("High facial movement detected — sit still for tighter baseline measurements.")
    }
    return warnings
  }
}
