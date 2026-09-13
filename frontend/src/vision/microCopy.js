export const PROMPT_TOASTS = [
  "YOUR TURN 💀",
  "COPY THIS",
  "BECOME HIM",
  "DO NOT FUMBLE",
  "7 SECONDS. GO.",
  "BRO YOU GOT THIS 😭",
  "MATCH THE ENERGY",
  "LET HIM COOK",
  "THIS ONE IS PERSONAL",
]

export const GOOD_TOASTS = [
  "BRO ACTUALLY BECAME IT 💀",
  "TOO ACCURATE",
  "NAH THAT WAS CLEAN 🔥",
  "WHY WAS THAT PERFECT",
  "ABSOLUTELY COOKED 🔥",
]

export const MISS_TOASTS = [
  "BRO WHAT 😭",
  "WRONG UNIVERSE",
  "THAT WAS... SOMETHING",
  "THE MEME IS DISAPPOINTED",
  "WE'LL NEVER SPEAK OF THIS",
]

export function getRandomPromptToast() {
  return PROMPT_TOASTS[Math.floor(Math.random() * PROMPT_TOASTS.length)]
}

export function getRandomResultToast(score) {
  if (score >= 70) {
    return GOOD_TOASTS[Math.floor(Math.random() * GOOD_TOASTS.length)]
  }
  return MISS_TOASTS[Math.floor(Math.random() * MISS_TOASTS.length)]
}
