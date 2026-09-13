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

    let available = LOCAL_MEME_MANIFEST.filter(
      (m) => !this.usedMemeIds.includes(m.id)
    )

    if (available.length === 0) {
      this.usedMemeIds = []
      available = [...LOCAL_MEME_MANIFEST]
    }

    const randomIndex = Math.floor(Math.random() * available.length)
    const selected = available[randomIndex]

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
      return { liveChecklist: [], matchScore: 0 }
    }

    const { targetFeatures, difficulty = 1 } = this.currentTarget
    const checklist = targetFeatures.checklist || []

    let matchedCount = 0
    const liveChecklist = checklist.map((item) => {
      let isMatched = false

      switch (item.key) {
        case 'open_mouth':
          isMatched = features.face.jawOpen > 0.22 || features.face.z_jaw >= 3.0
          break
        case 'wide_eyes':
          isMatched = features.face.wideEyes || features.face.z_jaw >= 3.5
          break
        case 'smile':
          isMatched = features.face.smile > 0.35
          break
        case 'wink':
          isMatched = features.face.wink > 0.3
          break
        case 'sneer':
          isMatched = features.face.sneer > 0.05 || features.face.z_sneer >= 3.0
          break
        case 'squint':
          isMatched = features.face.squint > 0.15 || features.face.z_squint >= 3.0
          break
        case 'head_turn':
          isMatched = features.face.turn > 0.12
          break
        case 'tongue_out':
          isMatched = features.tongue > 0.4
          break
        case 'facepalm':
          isMatched = features.hands.facepalm
          break
        case 'hands_up':
          isMatched = features.hands.handUpGesture || features.hands.handsRaised
          break
        case 'elbows_up':
          isMatched = features.pose.elbowsUp
          break
        case 'open_palm':
          isMatched = features.hands.openPalm
          break
        case 'heart':
          isMatched = features.hands.heartGesture
          break
        case 'pinch_nose':
          isMatched = features.hands.noseClosedGesture
          break
        case 'time_out':
          isMatched = features.hands.timeOutGesture
          break
        case 'motion':
          isMatched = features.motion.motionEnergy > 0.03
          break
        case 'face_gone':
          isMatched = !features.face.hasFace
          break
        default:
          isMatched = false
      }

      if (isMatched) matchedCount++
      return { ...item, matched: isMatched }
    })

    const totalReqs = checklist.length || 1
    const matchRatio = matchedCount / totalReqs

    let rawScore = matchRatio * 85
    if (matchRatio > 0) {
      rawScore += (difficulty - 1) * 5 + 10
    }

    const matchScore = Math.min(100, Math.round(rawScore))

    return {
      liveChecklist,
      matchScore,
      isFullyMatched: matchedCount === totalReqs,
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
    const categoryCounts = {}
    let malayalamCount = 0

    for (const h of this.sessionHistory) {
      totalScore += h.score
      categoryCounts[h.category] = (categoryCounts[h.category] || 0) + h.score
      if (h.origin === 'malayalam_cinema' || h.origin === 'malayalam') {
        malayalamCount++
      }
    }

    const avgScore = Math.round(totalScore / this.sessionHistory.length)

    let topCategory = 'chaos'
    let highestCatScore = -1

    for (const [cat, score] of Object.entries(categoryCounts)) {
      if (score > highestCatScore) {
        highestCatScore = score
        topCategory = cat
      }
    }

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
    } else if (avgScore < 60) {
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
    const finalMeme = await this.memeManager.getMemeForCategory(topCategory)

    return {
      overallScore: Math.min(99, Math.max(40, avgScore)),
      dominantEnergy,
      finalMeme,
      quote,
      history: this.sessionHistory,
    }
  }
}
