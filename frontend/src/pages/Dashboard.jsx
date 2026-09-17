import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LOCAL_MEME_MANIFEST } from '../vision/memes/memeManifest'
import { Sparkles, Trophy, Activity, Sliders, ShieldCheck } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 py-6">
      {/* Game Launcher Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-r from-gray-900 via-purple-950/60 to-emerald-950/60 p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" /> MediaPipe Vision Game Engine
          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
            WELCOME, {user?.name ? user.name.toUpperCase() : 'PLAYER'}! 🎭
          </h1>

          <p className="text-gray-200 text-base sm:text-lg font-medium leading-relaxed">
            See it. Recreate it. Become the meme.
          </p>

          <p className="text-gray-400 text-xs sm:text-sm">
            A random target meme floats over your live camera stream. You copy the facial expression, hand gesture, or posture. Our camera evaluates your match in real time!
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/camera"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 px-8 py-4 text-base font-extrabold text-white transition shadow-2xl shadow-emerald-950/60"
            >
              <Trophy className="h-5 w-5 text-amber-300" /> START MEME CHALLENGE
            </Link>
          </div>
        </div>
      </div>

      {/* Target Memes Sample Gallery */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🎭</span> Target Reaction Library ({LOCAL_MEME_MANIFEST.length} Memes)
          </h3>
          <span className="text-xs text-purple-400 font-semibold">Includes Malayalam & International Memes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {LOCAL_MEME_MANIFEST.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 transition hover:border-purple-500/50 hover:scale-105"
            >
              <div className="aspect-video w-full overflow-hidden bg-gray-900 relative">
                <img src={item.asset} alt={item.name} className="h-full w-full object-cover" />
                {item.origin === 'malayalam' && (
                  <span className="absolute top-1.5 left-1.5 rounded-md bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-black text-gray-950 shadow">
                    MALAYALAM
                  </span>
                )}
              </div>
              <div className="p-2.5 text-center text-xs font-bold text-gray-200 truncate">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Processing System Tech Bar */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <Activity className="h-5 w-5 text-blue-400" />
          <h4 className="text-sm font-bold text-white">MediaPipe Tasks Vision</h4>
          <p className="text-xs text-gray-400">
            GPU-accelerated WebAssembly models running directly in your browser.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <Sliders className="h-5 w-5 text-purple-400" />
          <h4 className="text-sm font-bold text-white">Z-Score Calibration</h4>
          <p className="text-xs text-gray-400">
            Measures expressions relative to your own baseline standard deviation.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5 space-y-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-white">Real-Time Feature Evaluation</h4>
          <p className="text-xs text-gray-400">
            Real feature matching evaluated every frame without fake scores.
          </p>
        </div>
      </div>
    </div>
  )
}
