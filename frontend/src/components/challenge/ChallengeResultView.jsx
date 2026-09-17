import { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Sparkles, Smile } from 'lucide-react'

export default function ChallengeResultView({ results, onPlayAgain }) {
  const { overallScore, dominantEnergy, finalMeme, quote, user } = results

  const [revealStage, setRevealStage] = useState(0) // 0: Analyzing, 1: Metrics, 2: Final Reveal

  useEffect(() => {
    const timer1 = setTimeout(() => setRevealStage(1), 1200)
    const timer2 = setTimeout(() => setRevealStage(2), 2600)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const finalMemeSrc = finalMeme?.asset || finalMeme?.path
  const playerName = user?.name ? user.name.trim() : 'PLAYER'

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6 px-4">
      {/* Exhibition Dramatic Reveal Sequence */}
      {revealStage < 2 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center space-y-6 animate-pulse">
          <div className="rounded-full bg-purple-950/80 p-6 border border-purple-500/50 text-purple-400">
            <Sparkles className="h-12 w-12 animate-spin" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-purple-300 tracking-wider">
              ANALYZING {playerName.toUpperCase()}'S PERFORMANCE...
            </h2>
            {revealStage >= 1 && (
              <div className="space-y-2 text-sm font-mono text-emerald-400 font-bold">
                <p>MEME COMPATIBILITY: {overallScore}%</p>
                <p>REACTION ACCURACY: {Math.min(99, overallScore + 5)}%</p>
                <p>CHAOS LEVEL: {Math.min(99, overallScore + 8)}%</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Personalized Greeting Header */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/40 p-4 text-center text-sm font-semibold text-purple-200 flex items-center justify-center gap-2">
            <Smile className="h-4 w-4 text-emerald-400" />
            Hey <span className="font-extrabold text-white">{playerName}</span> 👋 Here is your official Meme Recreator evaluation:
          </div>

          {/* Main Huge Final Verdict Card */}
          <div className="relative overflow-hidden rounded-3xl border-4 border-purple-500/50 bg-gradient-to-br from-gray-950 via-purple-950/80 to-emerald-950/80 p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-5 py-1.5 text-xs font-black text-purple-300 border border-purple-400/40 uppercase tracking-widest">
              <Trophy className="h-4 w-4 text-amber-400" /> VERDICT FOR {playerName.toUpperCase()}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-300 uppercase tracking-widest">ARCHETYPE UNLOCKED</h3>
              <h1 className="text-4xl font-black text-white sm:text-6xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-purple-300 to-amber-300">
                {dominantEnergy.icon} {dominantEnergy.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-lg mx-auto italic pt-1">
                "{dominantEnergy.description}"
              </p>
            </div>

            {/* Huge Final Meme Visual */}
            <div className="relative aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-2xl border-4 border-emerald-400/60 bg-gray-950 shadow-2xl">
              {finalMemeSrc ? (
                <img
                  src={finalMemeSrc}
                  alt={dominantEnergy.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                  Final Meme Asset
                </div>
              )}
            </div>

            {/* Score & Funny Roast Quote */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <div className="rounded-2xl bg-gray-950/90 px-8 py-3 border border-emerald-500/50 shadow-xl">
                <p className="text-xs text-gray-400 font-extrabold uppercase">MEME COMPATIBILITY</p>
                <p className="text-4xl font-black text-emerald-400 font-mono">{overallScore}%</p>
              </div>

              <div className="rounded-2xl bg-gray-950/90 border border-gray-800 p-4 max-w-md w-full">
                <p className="text-sm font-extrabold text-emerald-300 italic">"{quote}"</p>
              </div>
            </div>
          </div>

          {/* Large Exhibition Play Again Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onPlayAgain}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-black px-10 py-5 transition shadow-2xl shadow-purple-950/70 text-xl tracking-wide"
            >
              <RotateCcw className="h-6 w-6" /> PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
