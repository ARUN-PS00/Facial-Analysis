export const FUNNY_QUOTES = [
  "Bro really committed to the bit.",
  "Zero thoughts. Maximum aura.",
  "That expression said everything.",
  "Honestly, we deserved that reaction.",
  "Main character behavior detected.",
  "Someone give this person an Oscar.",
  "Yeah... we're keeping that one.",
  "Absolutely unhinged. Respect.",
  "This is why cameras were invented.",
  "Bro understood the assignment.",
  "100% certified meme material.",
  "The facial geometry does not lie.",
  "Peak chaotic energy achieved.",
  "No cap, this reaction is legendary.",
  "Frame this and put it in a museum.",
  "Scientists are still studying this expression.",
  "Aura points: +9,999.",
  "This reaction is going straight to the group chat.",
]

export function getRandomQuote() {
  const idx = Math.floor(Math.random() * FUNNY_QUOTES.length)
  return FUNNY_QUOTES[idx]
}
