export const REACTION_DEFINITIONS = [
  {
    id: 'time_out',
    name: 'Time Out',
    category: 'confused',
    priority: 95,
    detect: (f) => {
      if (f.hands.timeOutGesture) {
        return { match: true, confidence: 0.95 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'heart',
    name: 'Heart Hands',
    category: 'flirty',
    priority: 90,
    detect: (f) => {
      if (f.hands.heartGesture) {
        return { match: true, confidence: 0.92 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'cover_nose',
    name: 'Cover Nose',
    category: 'dramatic',
    priority: 85,
    detect: (f) => {
      if (f.hands.facepalm) {
        return { match: true, confidence: 0.88 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'crashing_out',
    name: 'Crashing Out',
    category: 'chaos',
    priority: 85,
    detect: (f) => {
      const screaming = f.face.z_jaw >= 3.5 && f.face.jawOpen >= 0.18
      const handsOnHead = f.hands.handCount >= 2 && f.pose.armsRaised
      if ((screaming && handsOnHead) || (screaming && f.pose.elbowsUp)) {
        return { match: true, confidence: 0.96 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'rock',
    name: 'Rock On',
    category: 'unhinged',
    priority: 80,
    detect: (f) => {
      if (f.hands.rockHorns) {
        return { match: true, confidence: 0.9 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'thumbs_up',
    name: 'Thumbs Up',
    category: 'wholesome',
    priority: 78,
    detect: (f) => {
      if (f.hands.thumbsUp) {
        return { match: true, confidence: 0.92 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'thumbs_down',
    name: 'Thumbs Down',
    category: 'sass',
    priority: 78,
    detect: (f) => {
      if (f.hands.thumbsDown) {
        return { match: true, confidence: 0.9 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'peace',
    name: 'Peace Sign',
    category: 'wholesome',
    priority: 75,
    detect: (f) => {
      if (f.hands.peaceSign) {
        return { match: true, confidence: 0.89 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'ok_sign',
    name: 'OK Sign',
    category: 'wholesome',
    priority: 75,
    detect: (f) => {
      if (f.hands.okSign) {
        return { match: true, confidence: 0.88 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'pointing',
    name: 'Pointing Finger',
    category: 'dramatic',
    priority: 75,
    detect: (f) => {
      if (f.hands.pointing) {
        return { match: true, confidence: 0.85 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'nose_closed',
    name: 'Pinch Nose',
    category: 'sass',
    priority: 72,
    detect: (f) => {
      if (f.hands.noseClosedGesture) {
        return { match: true, confidence: 0.87 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'flirty',
    name: 'Flirty Touch',
    category: 'flirty',
    priority: 70,
    detect: (f) => {
      if (f.hands.flirtyGesture || f.face.winkLeft > 0.4 || f.face.winkRight > 0.4) {
        const conf = Math.max(0.75, f.face.winkLeft, f.face.winkRight)
        return { match: true, confidence: Number(conf.toFixed(2)) }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'dance',
    name: 'Dance / Vibes',
    category: 'chaos',
    priority: 68,
    detect: (f) => {
      if (f.pose.elbowsUp && f.hands.handCount > 0) {
        return { match: true, confidence: 0.82 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'hand_up',
    name: 'Hand Up',
    category: 'sass',
    priority: 65,
    detect: (f) => {
      if (f.hands.handUpGesture) {
        return { match: true, confidence: 0.84 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'tongue_out',
    name: 'Tongue Out',
    category: 'unhinged',
    priority: 58,
    detect: (f) => {
      if (f.tongue > 0.45) {
        return { match: true, confidence: Math.min(1.0, f.tongue) }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'smile',
    name: 'Big Smile',
    category: 'wholesome',
    priority: 55,
    detect: (f) => {
      if (f.face.smile > 0.45) {
        return { match: true, confidence: Number(f.face.smile.toFixed(2)) }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'open_mouth',
    name: 'Jaw Drop / Shocked',
    category: 'shocked',
    priority: 52,
    detect: (f) => {
      if (f.face.z_jaw >= 6.0 && f.face.jawOpen >= 0.3) {
        const conf = Math.min(1.0, f.face.z_jaw / 8.0)
        return { match: true, confidence: Number(conf.toFixed(2)) }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'angry',
    name: 'Angry Furrow',
    category: 'dramatic',
    priority: 50,
    detect: (f) => {
      if (f.face.z_brow >= 4.0) {
        return { match: true, confidence: 0.82 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'sad',
    name: 'Sad Frown',
    category: 'dramatic',
    priority: 48,
    detect: (f) => {
      if (f.face.z_frown >= 4.0 || f.face.frown > 0.4) {
        return { match: true, confidence: 0.8 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'disgusted',
    name: 'Disgusted Sneer',
    category: 'sass',
    priority: 45,
    detect: (f) => {
      if ((f.face.z_sneer >= 4.5 && f.face.sneer >= 0.06) || f.face.z_disgust >= 14.0) {
        return { match: true, confidence: 0.86 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'talking_to_wall',
    name: 'Talking to Wall',
    category: 'confused',
    priority: 42,
    detect: (f) => {
      if (f.hands.handCount > 0 && f.motion.motionEnergy > 0.035) {
        return { match: true, confidence: 0.78 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'suspicious',
    name: 'Suspicious Side-Eye',
    category: 'suspicious',
    priority: 40,
    detect: (f) => {
      if (f.face.turn > 0.15 && f.face.z_squint >= 4.0 && f.face.squint >= 0.18) {
        return { match: true, confidence: 0.88 }
      }
      return { match: false, confidence: 0 }
    },
  },
  {
    id: 'spin',
    name: 'Face Gone / Spin',
    category: 'chaos',
    priority: 35,
    detect: (f) => {
      if (!f.face.hasFace && f.hands.handCount === 0 && !f.pose.bodySeen) {
        return { match: true, confidence: 0.95 }
      }
      return { match: false, confidence: 0 }
    },
  },
]
