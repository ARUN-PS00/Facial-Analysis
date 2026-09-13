import { RotateCcw, Sparkles } from 'lucide-react'

export default function ScoreResultView({ results, onRetry }) {
  const { categoryResults, dominantCategory, memeAsset, quote } = results

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      {/* Dominant Energy Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 via-purple-950/50 to-emerald-950/50 p-8 shadow-2xl text-center">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-4 w-4" /> Meme Personality Profile Complete
          </div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
            YOUR DOMINANT ENERGY
          </h1>
          <div className="inline-block rounded-2xl bg-gray-950/80 px-8 py-3 border border-purple-500/40 shadow-xl">
            <span className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-purple-300 to-pink-400 uppercase flex items-center justify-center gap-3">
              <span>{dominantCategory.icon}</span> {dominantCategory.name} {dominantCategory.score}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 items-start">
        {/* Category Breakdown Progress Bars */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🔥</span> Personality Traits Breakdown
          </h3>
          <div className="space-y-3.5">
            {categoryResults.map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-300 flex items-center gap-1.5">
                    <span>{cat.icon}</span> {cat.name}
                  </span>
                  <span className="text-emerald-400">{cat.score}%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                  <div
                    className={`h-full bg-gradient-to-r ${cat.color} transition-all duration-700 ease-out`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matching Meme Card & Quote */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6 space-y-6 shadow-xl flex flex-col items-center text-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🎭</span> Matching Reaction Meme
          </h3>

          <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl">
            {memeAsset?.path ? (
              <img
                src={memeAsset.path}
                alt={dominantCategory.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                No meme asset loaded
              </div>
            )}
          </div>

          <div className="rounded-xl bg-gray-950/80 border border-gray-800 p-4 w-full">
            <p className="text-sm font-bold text-emerald-300 italic">"{quote}"</p>
          </div>
        </div>
      </div>

      {/* Retry & Navigation Actions */}
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 transition shadow-xl shadow-emerald-950/50"
        >
          <RotateCcw className="h-4 w-4" /> Try Again
        </button>
      </div>
    </div>
  )
}
