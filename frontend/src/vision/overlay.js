import { FACE_SCALE, Z } from './constants'

const ASSET_PATHS = {
  cover_nose: '/assets/memes/cover_nose.jpeg',
  crashing_out: '/assets/memes/crashing_out.jpeg',
  dance: '/assets/memes/dance.jpeg',
  disgusted: '/assets/memes/disgusted.jpeg',
  flirty: '/assets/memes/flirty.jpeg',
  hand_up: '/assets/memes/hand_up.jpeg',
  heart: '/assets/memes/heart.jpeg',
  nose_closed: '/assets/memes/nose_closed.gif',
  open_mouth: '/assets/memes/open_mouth.jpeg',
  spin: '/assets/memes/spin.gif',
  suspicious: '/assets/memes/suspicious.jpeg',
  talking_to_wall: '/assets/memes/talking_to_wall.gif',
  time_out: '/assets/memes/time_out.jpeg',
  tongue_out: '/assets/memes/tongue_out.jpeg',
}

export class AssetManager {
  constructor() {
    this.images = {}
    this.loaded = false
  }

  preload() {
    if (this.loaded) return
    const promises = Object.entries(ASSET_PATHS).map(([pose, src]) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = src
        img.onload = () => {
          this.images[pose] = img
          resolve()
        }
        img.onerror = () => {
          console.warn(`Failed to load asset for pose ${pose} at ${src}`)
          resolve()
        }
      })
    })
    Promise.all(promises).then(() => {
      this.loaded = true
    })
  }

  get(pose) {
    return this.images[pose] || null
  }
}

export class OverlayRenderer {
  constructor() {
    this.assetManager = new AssetManager()
    this.assetManager.preload()
    this.smCenter = null
    this.smH = null
  }

  render({ ctx, W, H, shownPose, face, hands, body, debugData, isHudVisible, baseline, fps }) {
    ctx.clearRect(0, 0, W, H)

    // Smooth position updates for meme overlay positioning
    if (face) {
      if (!this.smCenter) {
        this.smCenter = [...face.center]
        this.smH = face.h * FACE_SCALE
      } else {
        this.smCenter[0] = 0.7 * this.smCenter[0] + 0.3 * face.center[0]
        this.smCenter[1] = 0.7 * this.smCenter[1] + 0.3 * face.center[1]
        this.smH = 0.7 * this.smH + 0.3 * (face.h * FACE_SCALE)
      }
    } else {
      this.smCenter = [W / 2, H / 2]
      this.smH = H * 0.45
    }

    // Render active meme reaction
    if (shownPose) {
      const img = this.assetManager.get(shownPose)
      if (img && img.complete && img.naturalWidth > 0) {
        const aspect = img.naturalWidth / img.naturalHeight
        const targetH = Math.min(this.smH, H * 0.95, (W * 0.95) / aspect)
        const targetW = targetH * aspect

        const drawX = this.smCenter[0] - targetW / 2
        const drawY = this.smCenter[1] - targetH / 2 - 0.05 * targetH

        ctx.save()
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        ctx.shadowBlur = 12
        ctx.drawImage(img, drawX, drawY, targetW, targetH)
        ctx.restore()
      } else {
        // Fallback badge placeholder if asset image is still loading
        ctx.save()
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)'
        ctx.beginPath()
        ctx.arc(this.smCenter[0], this.smCenter[1], 100, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 22px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(shownPose.toUpperCase(), this.smCenter[0], this.smCenter[1] + 8)
        ctx.restore()
      }
    }

    // Render Debug HUD overlay if enabled
    if (isHudVisible) {
      this.renderHUD({ ctx, W, H, shownPose, face, hands, body, debugData, baseline, fps })
    }
  }

  renderHUD({ ctx, W, _H, shownPose, face, hands, body, debugData, baseline, fps }) {
    ctx.save()

    // Draw face bounding box & landmarks
    if (face) {
      const [x0, y0, x1, y1] = face.box
      ctx.strokeStyle = '#10B981' // emerald green
      ctx.lineWidth = 2
      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0)
    }

    // Draw hand palm markers
    if (hands) {
      for (const h of hands) {
        ctx.fillStyle = '#F59E0B' // amber
        ctx.beginPath()
        ctx.arc(h.palm[0], h.palm[1], 8, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    // Draw body joint markers
    if (body && body.seen) {
      ctx.fillStyle = '#3B82F6' // blue
      for (const pt of [...body.shoulders, ...body.elbows]) {
        ctx.beginPath()
        ctx.arc(pt[0], pt[1], 8, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    // HUD Text overlay panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'
    ctx.fillRect(10, 10, Math.min(640, W - 20), 140)

    ctx.font = '13px monospace'
    ctx.fillStyle = '#10B981'

    const g = (k, def = 0) => (debugData && debugData[k] !== undefined ? debugData[k] : def)
    const rawPose = debugData ? debugData.rawPose || '-' : '-'

    const lines = [
      `FPS: ${Math.round(fps || 0)}   showing: ${shownPose || '-'}   raw: ${rawPose}   hands: ${g('hands', 0)}   elbows_up: ${g('elbows_up') ? 'Y' : 'N'}`,
      `jaw: ${Number(g('jaw', 0)).toFixed(2)} (${Number(g('z_jaw', 0)).toFixed(1)}s/${Z.jaw_open})   squint: ${Number(g('squint', 0)).toFixed(2)} (${Number(g('z_squint', 0)).toFixed(1)}s/${Z.squint})   turn: ${Number(g('turn', 0)).toFixed(2)}`,
      `tongue: ${Number(g('tongue', 0)).toFixed(2)}   gesture: ${Number(g('gesture', 0)).toFixed(3)}   disgust: ${Number(g('z_disgust', 0)).toFixed(1)}s/${Z.disgust}`,
      baseline && baseline.generic
        ? `[!] NOT CALIBRATED - Generic baseline in use. Press 'Calibrate' to personalize.`
        : `[OK] CALIBRATED: ${baseline ? baseline.made : 'Active'} on ${baseline ? baseline.samples : 0} frames (s = std dev above baseline)`,
      `HUD: Press 'D' or toggle HUD switch. Test Poses: 1-9, 0, -, =`,
    ]

    lines.forEach((line, i) => {
      ctx.fillStyle = i === 3 && baseline && baseline.generic ? '#F59E0B' : '#10B981'
      ctx.fillText(line, 20, 32 + i * 22)
    })

    ctx.restore()
  }
}
