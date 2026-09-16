import { LOCAL_MEME_MANIFEST } from './memes/memeManifest'
import { MemeProviderManager } from './memes/memeProvider'

export const FUNNY_ROAST_QUOTES = {
  highAccuracy: [
    "Bro didn't recreate the meme. Bro became the meme.",
    "10/10 commitment to the bit. Unmatched aura.",
    "The facial geometry was scary accurate.",
  ],
  highChaos: [
    "You don't recreate memes. You create incidents.",
    "Peak unhinged energy detected. Respect.",
    "Zero thoughts. Maximum chaos.",
  ],
  highSuspicious: [
    "Bro looks at everyone like they owe him money.",
    "Side-eye so sharp it cut the frame.",
    "Who hurt you to make that side-eye so natural?",
  ],
  highDramatic: [
    "Oscar-worthy performance. Unfortunately, nobody asked.",
    "Every reaction needed a full cinematic universe.",
    "The drama department is calling.",
  ],
  highConfusion: [
    "Nobody knows what happened. Especially you.",
    "Aura points lost... but entertainment gained.",
    "Bro was fighting for his life in that challenge.",
  ],
  lowScore: [
    "We asked you to recreate the meme. You created a completely different meme.",
    "Performance: questionable. Entertainment: immaculate.",
    "Somehow you made it worse. Respect.",
  ],
  malayalamHeavy: [
    "Certified Malayali meme energy detected. No further questions.",
    "Malayalam cinema reaction level: Unmatched folklore.",
    "Salim Kumar and Jagathy would be proud.",
  ],
}

export class ChallengeEngine {
  constructor(totalRounds = 4) {
    this.totalRounds = totalRounds
    this.memeManager = new MemeProviderManager()
    this.usedMemeIds = []
    this.sessionHistory = []
    this.currentRound = 0
    this.currentTarget = null
  }

  startSession(totalRounds = 4) {
    this.totalRounds = totalRounds
    this.usedMemeIds = []
    this.sessionHistory = []
    this.currentRound = 0
    this.currentTarget = null
    return this.nextChallenge()
  }

  nextChallenge() {
    this.currentRound++

    // Only select enabled memes
    let available = LOCAL_MEME_MANIFEST.filter(
      (m) => m.enabled !== false && !this.usedMemeIds.includes(m.id)
    )

    if (available.length === 0) {
      this.usedMemeIds = []
      available = LOCAL_MEME_MANIFEST.filter((m) => m.enabled !== false)
    }

    // Avoid picking 2 consecutive memes of identical category if other categories exist
    if (this.currentTarget && available.length > 1) {
      const differentCatPool = available.filter((m) => m.category !== this.currentTarget.category)
      if (differentCatPool.length > 0) {
        available = differentCatPool
      }
    }

    const randomIndex = Math.floor(Math.random() * available.length)
    const selected = available[randomIndex] || LOCAL_MEME_MANIFEST[0]

    this.usedMemeIds.push(selected.id)
    this.currentTarget = selected

    return {
      roundIndex: this.currentRound,
      totalRounds: this.totalRounds,
      targetMeme: selected,
    }
  }

  evaluateLiveMatch(features) {
    if (!this.currentTarget || !features) {
      return { liveChecklist: [], matchScore: 0, isFullyMatched: false }
    }

    const { targetFeatures, difficulty = 1 } = this.currentTarget
    const checklist = targetFeatures.checklist || []

    let totalItemRatioSum = 0

    const liveChecklist = checklist.map((item) => {
      let itemRatio = 0.0

      switch (item.key) {
        case 'open_mouth': {
          const jaw = (features.face && features.face.jawOpen) || 0
          const z_jaw = (features.face && features.face.z_jaw) || 0
          itemRatio = Math.min(1.0, Math.max(jaw / 0.15, z_jaw / 2.5))
          break
        }
        case 'wide_eyes': {
          const wide = features.face && features.face.wideEyes
          const z_jaw = (features.face && features.face.z_jaw) || 0
          itemRatio = wide ? 1.0 : Math.min(1.0, Math.max(0, z_jaw / 2.5))
          break
        }
        case 'smile': {
          const s = (features.face && features.face.smile) || 0
          itemRatio = Math.min(1.0, s / 0.25)
          break
        }
        case 'wink': {
          const w = (features.face && features.face.wink) || 0
          itemRatio = Math.min(1.0, w / 0.15)
          break
        }
        case 'sneer': {
          const sn = (features.face && features.face.sneer) || 0
          const z_sn = (features.face && features.face.z_sneer) || 0
          itemRatio = Math.min(1.0, Math.max(sn / 0.03, z_sn / 2.0))
          break
        }
        case 'squint': {
          const sq = (features.face && features.face.squint) || 0
          const z_sq = (features.face && features.face.z_squint) || 0
          itemRatio = Math.min(1.0, Math.max(sq / 0.08, z_sq / 2.0))
          break
        }
        case 'head_turn': {
          const t = (features.face && features.face.turn) || 0
          itemRatio = Math.min(1.0, t / 0.08)
          break
        }
        case 'tongue_out': {
          const tg = features.tongue || 0
          itemRatio = Math.min(1.0, tg / 0.25)
          break
        }
        case 'facepalm': {
          const fp = features.hands && features.hands.facepalm
          const hCount = (features.hands && features.hands.handCount) || 0
          itemRatio = fp ? 1.0 : hCount > 0 ? 0.35 : 0.0
          break
        }
        case 'hands_up': {
          const hu = features.hands && (features.hands.handUpGesture || features.hands.handsRaised)
          const ar = features.pose && features.pose.armsRaised
          itemRatio = hu ? 1.0 : ar ? 0.75 : 0.0
          break
        }
        case 'elbows_up': {
          const eu = features.pose && features.pose.elbowsUp
          const hr = features.hands && features.hands.handsRaised
          itemRatio = eu ? 1.0 : hr ? 0.7 : 0.0
          break
        }
        case 'open_palm': {
          const op = features.hands && features.hands.openPalm
          const hCount = (features.hands && features.hands.handCount) || 0
          itemRatio = op ? 1.0 : hCount > 0 ? 0.4 : 0.0
          break
        }
        case 'heart': {
          const hg = features.hands && features.hands.heartGesture
          const hCount = (features.hands && features.hands.handCount) || 0
          itemRatio = hg ? 1.0 : hCount >= 2 ? 0.5 : 0.0
          break
        }
        case 'pinch_nose': {
          const nc = features.hands && features.hands.noseClosedGesture
          const hCount = (features.hands && features.hands.handCount) || 0
          itemRatio = nc ? 1.0 : hCount > 0 ? 0.35 : 0.0
          break
        }
        case 'motion': {
          const energy = (features.motion && features.motion.motionEnergy) || 0
          itemRatio = Math.min(1.0, energy / 0.02)
          break
        }
        case 'face_gone': {
          const hasFace = features.face && features.face.hasFace
          itemRatio = !hasFace ? 1.0 : 0.0
          break
        }
        default:
          itemRatio = 0.0
      }

      const clampedRatio = Math.min(1.0, Math.max(0.0, itemRatio))
      totalItemRatioSum += clampedRatio

      // Consider item matched for checklist UI when player achieves >=40% match
      return { ...item, ratio: clampedRatio, matched: clampedRatio >= 0.4 }
    })

    const totalReqs = checklist.length || 1
    const avgMatchRatio = totalItemRatioSum / totalReqs

    // Calculate score: base match ratio (0-85 pts) + difficulty scaling bonus (10-15 pts) when match is non-trivial
    let rawScore = avgMatchRatio * 85
    if (avgMatchRatio > 0.08) {
      rawScore += (difficulty - 1) * 3 + 12
    }

    const matchScore = Math.min(100, Math.round(rawScore))
    const isFullyMatched = liveChecklist.every((item) => item.matched)

    return {
      liveChecklist,
      matchScore,
      isFullyMatched,
    }
  }

  recordChallengeResult(score) {
    if (!this.currentTarget) return

    this.sessionHistory.push({
      round: this.currentRound,
      memeId: this.currentTarget.id,
      memeName: this.currentTarget.name,
      category: this.currentTarget.category,
      origin: this.currentTarget.origin || 'international',
      assetPath: this.currentTarget.asset || this.currentTarget.path,
      score: Math.min(100, Math.max(0, score)),
      difficulty: this.currentTarget.difficulty || 1,
    })
  }

  async calculateFinalSessionResults() {
    if (this.sessionHistory.length === 0) {
      return {
        overallScore: 50,
        dominantEnergy: { name: 'THE SALIM KUMAR ENERGY', icon: '💀', description: 'You somehow turned every situation into a comedy scene.' },
        finalMeme: LOCAL_MEME_MANIFEST[0],
        quote: "Bro didn't recreate the meme. Bro became the meme.",
        history: [],
      }
    }

    let totalScore = 0
    const categoryScores = {}
    let bestRound = this.sessionHistory[0]
    let malayalamCount = 0

    for (const h of this.sessionHistory) {
      totalScore += h.score
      categoryScores[h.category] = (categoryScores[h.category] || 0) + h.score
      if (h.score > bestRound.score) {
        bestRound = h
      }
      if (h.origin === 'malayalam_cinema' || h.origin === 'malayalam') {
        malayalamCount++
      }
    }

    const avgScore = Math.round(totalScore / this.sessionHistory.length)

    // Identify dominant category
    let topCategory = 'chaos'
    let highestCatScore = -1
    for (const [cat, score] of Object.entries(categoryScores)) {
      if (score > highestCatScore) {
        highestCatScore = score
        topCategory = cat
      }
    }

    // Composite Final Performance Index:
    // 50% Avg Score + 30% Dominant Category Score Ratio + 20% Best Round Score
    const dominantCatRatio = Math.min(100, (highestCatScore / (totalScore || 1)) * 100)
    const compositeIndex = Math.round(0.5 * avgScore + 0.3 * dominantCatRatio + 0.2 * bestRound.score)

    const archetypeTitles = {
      confused: { name: 'THE SALIM KUMAR ENERGY', icon: '💀', description: 'You somehow turned every situation into a comedy scene.' },
      suspicious: { name: 'PROFESSIONAL JAGATHY SIDE-EYE', icon: '👀', description: 'Bro looks at the world like he knows something we don\'t.' },
      unhinged: { name: 'FAHADH FAASIL MODE', icon: '😐', description: 'Zero explanation. Maximum stare.' },
      dramatic: { name: 'MOHANLAL DRAMA DEPARTMENT', icon: '🎭', description: 'Every reaction needed a full cinematic universe.' },
      chaos: { name: 'CERTIFIED MALAYALI MENACE', icon: '💀', description: 'You didn\'t recreate the memes. You became local folklore.' },
      sass: { name: 'SASS QUEEN SUPREME', icon: '💅', description: 'Unmatched side-eye and attitude.' },
      wholesome: { name: 'WHOLESOME CHARM', icon: '✨', description: 'Immaculate positive vibes and energy.' },
      shocked: { name: 'MAXIMUM SURPRISE', icon: '🤯', description: 'Pure unfiltered jaw-drop reaction.' },
    }

    const dominantEnergy = archetypeTitles[topCategory] || {
      name: 'CERTIFIED MEME MENACE',
      icon: '🔥',
      description: 'Bro came here to recreate memes and accidentally became one.',
    }

    // Select Funny Roast Quote
    let quoteList = FUNNY_ROAST_QUOTES.highAccuracy
    if (malayalamCount >= 2) {
      quoteList = FUNNY_ROAST_QUOTES.malayalamHeavy
    } else if (avgScore < 55) {
      quoteList = FUNNY_ROAST_QUOTES.lowScore
    } else if (topCategory === 'chaos') {
      quoteList = FUNNY_ROAST_QUOTES.highChaos
    } else if (topCategory === 'suspicious') {
      quoteList = FUNNY_ROAST_QUOTES.highSuspicious
    } else if (topCategory === 'dramatic') {
      quoteList = FUNNY_ROAST_QUOTES.highDramatic
    } else if (topCategory === 'confused') {
      quoteList = FUNNY_ROAST_QUOTES.highConfusion
    }

    const quote = quoteList[Math.floor(Math.random() * quoteList.length)]

    // Select Final Result Meme based on composite score & dominant/best categories
    let candidateMemes = LOCAL_MEME_MANIFEST.filter(
      (m) => m.enabled !== false && (m.category === topCategory || m.category === bestRound.category)
    )

    if (candidateMemes.length === 0) {
      candidateMemes = LOCAL_MEME_MANIFEST.filter((m) => m.enabled !== false)
    }

    // Filter candidate by difficulty matching performance (compositeIndex > 75 -> difficulty >= 2)
    const targetDiff = compositeIndex > 75 ? 2 : 1
    const diffMatchedMemes = candidateMemes.filter((m) => m.difficulty >= targetDiff)
    const finalPool = diffMatchedMemes.length > 0 ? diffMatchedMemes : candidateMemes

    // Pick a final meme, prioritizing one not already played in current session if possible
    const playedIds = this.sessionHistory.map((h) => h.memeId)
    const unplayedCandidates = finalPool.filter((m) => !playedIds.includes(m.id))
    const finalMeme = unplayedCandidates.length > 0
      ? unplayedCandidates[Math.floor(Math.random() * unplayedCandidates.length)]
      : finalPool[Math.floor(Math.random() * finalPool.length)]

    return {
      overallScore: Math.min(99, Math.max(35, compositeIndex)),
      dominantEnergy,
      finalMeme: finalMeme || LOCAL_MEME_MANIFEST[0],
      quote,
      history: this.sessionHistory,
    }
  }
}
