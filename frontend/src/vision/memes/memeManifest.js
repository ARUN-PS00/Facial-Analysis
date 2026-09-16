const challengeAssets = import.meta.glob('/src/assets/memes/challenge/*.*', { eager: true, import: 'default' })

function getAssetPath(filename, fallbackUrl) {
  const globKey = `/src/assets/memes/challenge/${filename}`
  if (challengeAssets[globKey]) {
    return challengeAssets[globKey]
  }
  return fallbackUrl || `/assets/memes/${filename}`
}

export const SUPPORTED_DETECTOR_FEATURES = new Set([
  'open_mouth',
  'wide_eyes',
  'smile',
  'wink',
  'sneer',
  'squint',
  'head_turn',
  'tongue_out',
  'facepalm',
  'hands_up',
  'elbows_up',
  'open_palm',
  'heart',
  'pinch_nose',
  'motion',
  'face_gone',
])

export const RAW_MEME_MANIFEST = [
  {
    id: 'salim_kumar_confused',
    name: 'Confused Disbelief',
    asset: getAssetPath('salim_kumar_confused.svg'),
    category: 'confused',
    difficulty: 2,
    enabled: true,
    origin: 'malayalam_cinema',
    targetFeatures: {
      expressions: ['head_turn', 'eyebrow_raise'],
      gestures: ['facepalm'],
      pose: [],
      checklist: [
        { key: 'head_turn', label: 'Turn Head Side 🤨' },
        { key: 'facepalm', label: 'Hand Near Face 🤦' },
      ],
    },
  },
  {
    id: 'salim_kumar_smug',
    name: 'Cocky Smug Smirk',
    asset: getAssetPath('salim_kumar_smug.svg'),
    category: 'sass',
    difficulty: 2,
    enabled: true,
    origin: 'malayalam_cinema',
    targetFeatures: {
      expressions: ['smile', 'eyebrow_raise'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'smile', label: 'Smug Smirk 😏' },
        { key: 'head_turn', label: 'Head Tilt / Turn 🤨' },
      ],
    },
  },
  {
    id: 'jagathy_suspicious',
    name: 'Suspicious Side-Eye',
    asset: getAssetPath('jagathy_suspicious.svg'),
    category: 'suspicious',
    difficulty: 2,
    enabled: true,
    origin: 'malayalam_cinema',
    targetFeatures: {
      expressions: ['squint', 'head_turn'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'squint', label: 'Squint Eye 👁️' },
        { key: 'head_turn', label: 'Side-Eye Turn 🤨' },
      ],
    },
  },
  {
    id: 'fahadh_shammi_smug',
    name: 'Unblinking Stare',
    asset: getAssetPath('fahadh_shammi_smug.svg'),
    category: 'unhinged',
    difficulty: 3,
    enabled: true,
    origin: 'malayalam_cinema',
    targetFeatures: {
      expressions: ['smile', 'wide_eyes'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'wide_eyes', label: 'Wide Unblinking Stare 😳' },
        { key: 'smile', label: 'Slight Eerie Smile 🙂' },
      ],
    },
  },
  {
    id: 'malayalam_confused',
    name: 'Head Tilt Disbelief',
    asset: getAssetPath('malayalam_confused.svg'),
    category: 'confused',
    difficulty: 2,
    enabled: true,
    origin: 'malayalam_cinema',
    targetFeatures: {
      expressions: ['head_turn', 'squint'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'head_turn', label: 'Confused Head Tilt 🤨' },
        { key: 'squint', label: 'Squint Disbelief 🧐' },
      ],
    },
  },
  {
    id: 'malayalam_shocked',
    name: 'Dramatic Gasp',
    asset: getAssetPath('malayalam_shocked.svg'),
    category: 'shocked',
    difficulty: 2,
    enabled: true,
    origin: 'malayalam_cinema',
    targetFeatures: {
      expressions: ['open_mouth', 'wide_eyes'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'open_mouth', label: 'Dramatic Shock 😮' },
        { key: 'wide_eyes', label: 'Gasping Eyes 😳' },
      ],
    },
  },
  {
    id: 'malayalam_suspicious',
    name: 'Sharp Side Glance',
    asset: getAssetPath('malayalam_suspicious.svg'),
    category: 'suspicious',
    difficulty: 2,
    enabled: true,
    origin: 'malayalam_cinema',
    targetFeatures: {
      expressions: ['head_turn', 'sneer'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'head_turn', label: 'Sharp Side Glance 🤨' },
        { key: 'sneer', label: 'Suspicious Sneer 😼' },
      ],
    },
  },
  {
    id: 'open_mouth',
    name: 'Shocked Jaw Drop',
    asset: getAssetPath('open_mouth.jpeg'),
    category: 'shocked',
    difficulty: 1,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: ['open_mouth'],
      gestures: [],
      pose: [],
      checklist: [{ key: 'open_mouth', label: 'Open Mouth 😮' }],
    },
  },
  {
    id: 'mouth',
    name: 'Wide Open Mouth',
    asset: getAssetPath('mouth.png'),
    category: 'shocked',
    difficulty: 1,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: ['open_mouth', 'wide_eyes'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'open_mouth', label: 'Wide Open Mouth 😮' },
        { key: 'wide_eyes', label: 'Wide Shocked Eyes 😳' },
      ],
    },
  },
  {
    id: 'cover_nose',
    name: 'Facepalm Reaction',
    asset: getAssetPath('cover_nose.jpeg'),
    category: 'dramatic',
    difficulty: 2,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: [],
      gestures: ['facepalm'],
      pose: [],
      checklist: [{ key: 'facepalm', label: 'Hand Over Face 🤦' }],
    },
  },
  {
    id: 'crashing_out',
    name: 'Screaming Chaos',
    asset: getAssetPath('crashing_out.jpeg'),
    category: 'chaos',
    difficulty: 3,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: ['open_mouth'],
      gestures: ['hands_up'],
      pose: ['elbows_up'],
      checklist: [
        { key: 'open_mouth', label: 'Scream / Open Mouth 😮' },
        { key: 'hands_up', label: 'Hands Raised 🙌' },
      ],
    },
  },
  {
    id: 'dance',
    name: 'Vibes Dance',
    asset: getAssetPath('dance.jpeg'),
    category: 'chaos',
    difficulty: 2,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: [],
      gestures: ['open_palm'],
      pose: ['elbows_up'],
      checklist: [
        { key: 'elbows_up', label: 'Elbows Raised 🕺' },
        { key: 'open_palm', label: 'Open Palms 🖐️' },
      ],
    },
  },
  {
    id: 'disgusted',
    name: 'Disgusted Sneer',
    asset: getAssetPath('disgusted.jpeg'),
    category: 'sass',
    difficulty: 2,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: ['sneer'],
      gestures: [],
      pose: [],
      checklist: [{ key: 'sneer', label: 'Nose Sneer / Disgust 🤢' }],
    },
  },
  {
    id: 'flirty',
    name: 'Flirty Wink',
    asset: getAssetPath('flirty.jpeg'),
    category: 'flirty',
    difficulty: 2,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: ['wink', 'smile'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'wink', label: 'Wink Eye 😉' },
        { key: 'smile', label: 'Smile 😊' },
      ],
    },
  },
  {
    id: 'heart',
    name: 'Heart Hands',
    asset: getAssetPath('heart.jpeg'),
    category: 'wholesome',
    difficulty: 2,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: ['smile'],
      gestures: ['heart'],
      pose: [],
      checklist: [
        { key: 'heart', label: 'Heart Hands 🫶' },
        { key: 'smile', label: 'Warm Smile 😊' },
      ],
    },
  },
  {
    id: 'nose_closed',
    name: 'Pinch Nose',
    asset: getAssetPath('nose_closed.gif'),
    category: 'sass',
    difficulty: 2,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: [],
      gestures: ['pinch_nose'],
      pose: [],
      checklist: [{ key: 'pinch_nose', label: 'Pinch Nose 🤌' }],
    },
  },
  {
    id: 'suspicious',
    name: 'Suspicious Side-Eye',
    asset: getAssetPath('suspicious.jpeg'),
    category: 'suspicious',
    difficulty: 2,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: ['squint', 'head_turn'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'head_turn', label: 'Turn Head 🤨' },
        { key: 'squint', label: 'Squint Eye 👀' },
      ],
    },
  },
  {
    id: 'tongue_out',
    name: 'Silly Tongue Out',
    asset: getAssetPath('tongue_out.jpeg'),
    category: 'unhinged',
    difficulty: 1,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: ['tongue_out'],
      gestures: [],
      pose: [],
      checklist: [{ key: 'tongue_out', label: 'Stick Tongue Out 😛' }],
    },
  },
  {
    id: 'spin',
    name: 'Spin Chaos',
    asset: getAssetPath('spin.gif'),
    category: 'chaos',
    difficulty: 2,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: ['smile'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'motion', label: 'Spin / Dynamic Motion 🌀' },
        { key: 'smile', label: 'Joyful Expression 😄' },
      ],
    },
  },
  {
    id: 'talking_to_wall',
    name: 'Staring at Wall',
    asset: getAssetPath('talking_to_wall.gif'),
    category: 'unhinged',
    difficulty: 2,
    enabled: true,
    origin: 'international',
    targetFeatures: {
      expressions: ['head_turn', 'squint'],
      gestures: [],
      pose: [],
      checklist: [
        { key: 'head_turn', label: 'Stare at Wall 😐' },
        { key: 'squint', label: 'Blank Expression 😶' },
      ],
    },
  },
  {
    id: 'hand_up',
    name: 'Talk to the Hand',
    asset: getAssetPath('hand_up.jpeg'),
    category: 'sass',
    difficulty: 1,
    enabled: false, // Disabled for rotation until detection improves; asset preserved
    origin: 'international',
    targetFeatures: {
      expressions: [],
      gestures: ['hand_up'],
      pose: [],
      checklist: [{ key: 'hand_up', label: 'Hand Up / Stop 🖐️' }],
    },
  },
  {
    id: 'time_out',
    name: 'Time Out T-Sign',
    asset: getAssetPath('time_out.jpeg'),
    category: 'confused',
    difficulty: 2,
    enabled: false, // Disabled for rotation until detection improves; asset preserved
    origin: 'international',
    targetFeatures: {
      expressions: [],
      gestures: ['time_out'],
      pose: [],
      checklist: [{ key: 'time_out', label: 'Time Out T-Sign 🙅' }],
    },
  },
]

export function validateMemeManifest(manifest) {
  const seenIds = new Set()
  const validManifest = []
  const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV

  for (const item of manifest) {
    if (!item.id || !item.name || !item.category || item.difficulty === undefined || !item.targetFeatures) {
      if (isDev) console.warn(`[MemeManifest Validation] Skipping meme missing required metadata:`, item)
      continue
    }

    if (seenIds.has(item.id)) {
      if (isDev) console.warn(`[MemeManifest Validation] Duplicate meme ID detected: "${item.id}". Skipping duplicate.`)
      continue
    }
    seenIds.add(item.id)

    if (item.enabled === false) {
      if (isDev) console.info(`[MemeManifest Validation] Meme "${item.id}" is marked enabled: false. Preserved in manifest but excluded from active rotation.`)
      continue
    }

    const checklist = item.targetFeatures.checklist || []
    const unsupportedKeys = checklist
      .map((c) => c.key)
      .filter((k) => !SUPPORTED_DETECTOR_FEATURES.has(k))

    if (unsupportedKeys.length > 0 && isDev) {
      console.warn(`[MemeManifest Validation] Meme "${item.id}" contains unsupported detector features: [${unsupportedKeys.join(', ')}].`)
    }

    validManifest.push(item)
  }

  return validManifest
}

export const LOCAL_MEME_MANIFEST = validateMemeManifest(RAW_MEME_MANIFEST)
