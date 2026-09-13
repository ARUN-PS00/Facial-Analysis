import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, Sparkles, Trophy } from 'lucide-react'

const SAMPLE_CHALLENGES = [
  { label: '😮 SHOCKED', path: '/assets/memes/open_mouth.jpeg' },
  { label: '🤨 SUSPICIOUS', path: '/assets/memes/suspicious.jpeg' },
  { label: '😉 FLIRTY', path: '/assets/memes/flirty.jpeg' },
  { label: '👍 APPROVAL', path: '/assets/memes/heart.jpeg' },
  { label: '💀 CHAOS', path: '/assets/memes/crashing_out.jpeg' },
  { label: '🤦 FACEPALM', path: '/assets/memes/cover_nose.jpeg' },
  { label: '🕺 DANCE', path: '/assets/memes/dance.jpeg' },
  { label: '😛 UNHINGED', path: '/assets/memes/tongue_out.jpeg' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      login(email, password)
      navigate('/app')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-800 bg-gray-900/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 mb-3 border border-emerald-500/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Sign In to Meme Challenge</h2>
          <p className="mt-2 text-sm text-gray-400">
            Recreate random memes with your face & gestures to unlock your reaction score!
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-950/80 border border-red-800 p-3.5 text-xs text-red-300">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 focus:outline-none shadow-lg shadow-emerald-950/50"
            >
              <LogIn className="h-4 w-4" /> Sign In & Play
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Create an Account
          </Link>
        </div>
      </div>

      {/* Target Memes Examples Preview */}
      <div className="w-full max-w-4xl rounded-2xl border border-gray-800 bg-gray-900/60 p-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <Trophy className="h-4 w-4" /> TRY TO RECREATE THESE MEMES
        </div>
        <p className="text-xs text-gray-400 max-w-lg mx-auto">
          The app shows a random target meme floating over your camera. Copy the expression or gesture and see how close you can get!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {SAMPLE_CHALLENGES.map((item, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950 transition hover:border-emerald-500/50"
            >
              <div className="aspect-video w-full overflow-hidden bg-gray-900">
                <img src={item.path} alt={item.label} className="h-full w-full object-cover" />
              </div>
              <div className="p-2 text-center text-[11px] font-bold text-gray-200">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
