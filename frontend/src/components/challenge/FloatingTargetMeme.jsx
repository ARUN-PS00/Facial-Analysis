import { useState, useEffect } from 'react'
import { getRandomPromptToast } from '../../vision/microCopy'
import { Check, X } from 'lucide-react'

export default function FloatingTargetMeme({ targetMeme, liveChecklist, matchScore, timeRemaining }) {
  const [promptToast, setPromptToast] = useState(getRandomPromptToast())

  useEffect(() => {
    setPromptToast(getRandomPromptToast())
  }, [targetMeme?.id])

  if (!targetMeme) return null

  const assetSrc = targetMeme.asset || targetMeme.path

  return (
    <div className="absolute top-6 right-6 z-30 flex flex-col items-center gap-2 animate-bounce-gentle">
      {/* Micro-Prompt Toast Badge */}
      <div className="rounded-full bg-purple-600 px-3.5 py-1 text-xs font-black text-white shadow-lg border border-purple-400 animate-pulse">
        {promptToast}
      </div>

      {/* Floating Target Card */}
      <div className="relative w-64 sm:w-72 overflow-hidden rounded-2xl border-2 border-purple-400 bg-gray-950/95 p-3 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105">
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-800 text-xs font-bold">
          <span className="text-purple-300 font-extrabold uppercase tracking-wide flex items-center gap-1">
            🎯 RECREATE THIS MEME
          </span>
          <span className="rounded-full bg-purple-950 px-2.5 py-0.5 font-mono text-purple-300 border border-purple-700">
            00:0{timeRemaining}s
          </span>
        </div>

        {/* Floating Visual Target Image (Pure Visual - No Malayalam Text Overlays) */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 my-2 border border-gray-800">
          <img
            src={assetSrc}
            alt={targetMeme.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Secondary Unobtrusive Live Feedback Checklist */}
        <div className="space-y-1 my-2">
          {liveChecklist.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                item.matched
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                  : 'bg-gray-900/80 text-gray-400 border border-gray-800'
              }`}
            >
              <span>{item.label}</span>
              {item.matched ? (
                <Check className="h-3.5 w-3.5 text-emerald-400 font-bold" />
              ) : (
                <X className="h-3.5 w-3.5 text-gray-500" />
              )}
            </div>
          ))}
        </div>

        {/* Live Match Score % */}
        <div className="pt-1 flex items-center justify-between text-xs font-extrabold border-t border-gray-800">
          <span className="text-gray-300">MATCH:</span>
          <span className="text-emerald-400 font-mono text-sm">{matchScore}%</span>
        </div>
      </div>
    </div>
  )
}
