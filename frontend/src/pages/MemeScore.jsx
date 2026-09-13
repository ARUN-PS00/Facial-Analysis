import MemeScoreView from '../components/score/MemeScoreView'
import { Sparkles } from 'lucide-react'

export default function MemeScore() {
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
            <Sparkles className="h-3.5 w-3.5" /> Entertainment Mode
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Meme Personality Score</h1>
        </div>
        <div className="text-xs text-gray-400 max-w-xs text-right hidden sm:block">
          Run an 8-second live camera scan to analyze your facial & gesture traits and unlock your reaction profile!
        </div>
      </div>

      <MemeScoreView />
    </div>
  )
}
