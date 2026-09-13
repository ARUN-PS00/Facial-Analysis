import { MemeProviderManager } from './memes/memeProvider'
import { getRandomQuote } from './quotes'

export const CATEGORIES = [
  { id: 'chaos', name: 'Chaos', icon: '🔥', color: 'from-orange-500 to-red-600' },
  { id: 'sass', name: 'Sass', icon: '💅', color: 'from-pink-500 to-rose-600' },
  { id: 'flirty', name: 'Flirty', icon: '😏', color: 'from-purple-500 to-pink-500' },
  { id: 'dramatic', name: 'Dramatic', icon: '💀', color: 'from-violet-600 to-purple-800' },
  { id: 'suspicious', name: 'Suspicion', icon: '👀', color: 'from-amber-500 to-yellow-600' },
  { id: 'wholesome', name: 'Wholesome', icon: '✨', color: 'from-emerald-400 to-teal-600' },
  { id: 'confused', name: 'Confused', icon: '🤷', color: 'from-cyan-500 to-blue-600' },
  { id: 'shocked', name: 'Shocked', icon: '🤯', color: 'from-yellow-400 to-orange-500' },
]

export class ScoreEngine {
  constructor() {
    this.memeManager = new MemeProviderManager()
    this.reset()
  }

  reset() {
    this.frameCounts = 0
    this.evidence = {
      chaos: 0,
      sass: 0,
      flirty: 0,
      dramatic: 0,
      suspicious: 0,
      wholesome: 0,
      confused: 0,
      shocked: 0,
    }
  }

  accumulateFrame(reactionResult, features) {
    this.frameCounts++

    // Add category weight if a reaction matched
    if (reactionResult && reactionResult.category) {
      const cat = reactionResult.category
      const conf = reactionResult.confidence || 0.8
      if (this.evidence[cat] !== undefined) {
        this.evidence[cat] += 2.5 * conf
      }
    }

    // Accumulate raw facial & motion feature evidence
    if (features) {
      if (features.face) {
        if (features.face.smile > 0.4) this.evidence.wholesome += 0.8 * features.face.smile
        if (features.face.z_jaw >= 4.0) this.evidence.shocked += 1.2
        if (features.face.z_sneer >= 3.0) this.evidence.sass += 1.0
        if (features.face.z_brow >= 3.5) this.evidence.dramatic += 1.0
        if (features.face.z_frown >= 3.5) this.evidence.dramatic += 0.9
        if (features.face.turn > 0.12) this.evidence.suspicious += 0.8
        if (features.face.winkLeft > 0.3 || features.face.winkRight > 0.3) this.evidence.flirty += 1.5
      }

      if (features.motion && features.motion.motionEnergy > 0.03) {
        this.evidence.chaos += 1.2 * (features.motion.motionEnergy * 20)
      }
    }
  }

  async calculateFinalResults() {
    const totalFrames = Math.max(this.frameCounts, 30)
    const normalizedScores = {}

    // Bounded 0 - 100 normalization
    for (const [cat, raw] of Object.entries(this.evidence)) {
      const scaled = (raw / (totalFrames * 0.15)) * 100
      // Apply baseline minimum flair so all categories have a fun reading
      const baseFlair = 15 + Math.floor(Math.random() * 25)
      normalizedScores[cat] = Math.min(99, Math.max(baseFlair, Math.round(scaled + baseFlair)))
    }

    // Sort categories by score descending
    const categoryResults = CATEGORIES.map((c) => ({
      ...c,
      score: normalizedScores[c.id] || 20,
    })).sort((a, b) => b.score - a.score)

    const dominantCategory = categoryResults[0]
    const memeAsset = await this.memeManager.getMemeForCategory(dominantCategory.id)
    const quote = getRandomQuote()

    return {
      categoryResults,
      dominantCategory,
      memeAsset,
      quote,
      totalFramesProcessed: this.frameCounts,
    }
  }
}
