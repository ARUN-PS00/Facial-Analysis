import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Trophy, User, ArrowRight, Smile } from 'lucide-react'

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

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male', icon: '♂️' },
  { id: 'female', label: 'Female', icon: '♀️' },
  { id: 'other', label: 'Non-binary / Other', icon: '⚡' },
]

export default function Login() {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('male')
  const [error, setError] = useState('')
  const { startSession } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      startSession(name, gender)
      navigate('/app')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-800 bg-gray-900/90 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-purple-600 text-white mb-1 shadow-lg shadow-emerald-950/50">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Player Profile</h2>
          <p className="text-sm text-gray-400">
            Enter your details below to start the Meme Recreation Challenge!
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-950/80 border border-red-800 p-3.5 text-xs text-red-300">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-400" /> Full Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm font-medium"
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                <Smile className="h-3.5 w-3.5 text-purple-400" /> Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setGender(g.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition ${
                      gender === g.id
                        ? 'border-emerald-500 bg-emerald-500/20 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                        : 'border-gray-800 bg-gray-800/60 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                    }`}
                  >
                    <span className="text-base mb-1">{g.icon}</span>
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 px-4 py-3.5 text-base font-extrabold text-white transition focus:outline-none shadow-xl shadow-emerald-950/50"
            >
              Start Game <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>
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
