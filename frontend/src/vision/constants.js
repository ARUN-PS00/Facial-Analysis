// Reference pose reactions from gazijarin/itsgiving
export const POSES = [
  'time_out',
  'heart',
  'cover_nose',
  'crashing_out',
  'dance',
  'nose_closed',
  'flirty',
  'hand_up',
  'tongue_out',
  'open_mouth',
  'disgusted',
  'talking_to_wall',
  'suspicious',
  'spin',
]

export const TEST_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '[', ']']

export const FACE_SCALE = 2.0
export const HOLD_FRAMES = 10

export const ARM = {
  spin: 15,
  suspicious: 8,
  talking_to_wall: 6,
  dance: 6,
  crashing_out: 4,
  open_mouth: 4,
  tongue_out: 5,
  disgusted: 5,
}

// Baseline z-score thresholds (std deviations above resting neutral face)
export const Z = {
  jaw_open: 6.0,
  scream_jaw: 3.5,
  tongue_jaw: 3.5,
  sneer: 4.5,
  disgust: 14.0,
  squint: 4.0,
}

export const Z_CAP = 8.0

// Raw expression floors
export const FLOOR = {
  jaw_open: 0.3,
  scream_jaw: 0.18,
  tongue_jaw: 0.18,
  sneer: 0.06,
  squint: 0.18,
}

// Fixed thresholds for non-z-score metrics
export const T = {
  tongue: 0.5,
  head_turn: 0.15,
  gesture: 0.035,
}

// MediaPipe inner lip landmark indices
export const INNER_LIPS = [
  78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191,
]

// Fallback generic baseline statistics when user is not calibrated
export const GENERIC_SIGMA = 0.035
export const GENERIC_MEAN = {
  jawOpen: 0.08,
  eyeSquintLeft: 0.1,
  eyeSquintRight: 0.1,
  eyeBlinkLeft: 0.1,
  eyeBlinkRight: 0.1,
  noseSneerLeft: 0.03,
  noseSneerRight: 0.03,
  browDownLeft: 0.06,
  browDownRight: 0.06,
  mouthFrownLeft: 0.05,
  mouthFrownRight: 0.05,
  mouthUpperUpLeft: 0.05,
  mouthUpperUpRight: 0.05,
}
