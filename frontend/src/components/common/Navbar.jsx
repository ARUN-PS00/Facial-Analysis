import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Sparkles, Trophy, Info, LogOut, LogIn } from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'female':
        return <span title="Female" className="text-pink-400 font-bold text-xs">♀️</span>
      case 'male':
        return <span title="Male" className="text-blue-400 font-bold text-xs">♂️</span>
      default:
        return <span title="Non-binary / Other" className="text-purple-400 font-bold text-xs">⚡</span>
    }
  }

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/app' : '/login'} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-purple-600 text-white shadow-md shadow-emerald-950/50 group-hover:scale-105 transition">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Meme<span className="text-emerald-400">Recreator</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
          {isAuthenticated ? (
            <>
              <Link
                to="/app"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
                  isActive('/app')
                    ? 'bg-gray-800 text-emerald-400 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-900'
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/camera"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
                  isActive('/camera')
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Trophy className="h-4 w-4 text-amber-400" /> Meme Challenge
              </Link>
            </>
          ) : null}

          <Link
            to="/about"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
              isActive('/about')
                ? 'bg-gray-800 text-emerald-400 font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-gray-900'
            }`}
          >
            <Info className="h-4 w-4" /> About
          </Link>

          {/* User Session & Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-gray-800 pl-3 sm:pl-4">
              <span className="text-xs text-gray-300 flex items-center gap-1.5 font-medium">
                Hi, <span className="font-extrabold text-white">{user?.name}</span> 👋
                {user?.gender && getGenderIcon(user.gender)}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900 hover:bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-gray-800 pl-3 sm:pl-4">
              <Link
                to="/login"
                className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-sm"
              >
                <LogIn className="h-3.5 w-3.5" /> Setup Profile
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
