import MemeChallengeView from '../components/challenge/MemeChallengeView'
import { Sparkles } from 'lucide-react'

export default function CameraStudio() {
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
            <Sparkles className="h-3.5 w-3.5" /> MediaPipe Vision Game Engine
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Meme Recreation Challenge</h1>
        </div>
        <div className="text-xs text-gray-400 max-w-xs text-right hidden sm:block">
          See the floating target meme over your webcam. Recreate the expression or gesture in real time!
        </div>
      </div>

      <MemeChallengeView />
    </div>
  )
}
