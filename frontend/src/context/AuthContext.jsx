import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_SESSION_KEY = 'facial_analysis_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(STORAGE_SESSION_KEY)
      if (storedSession) {
        setUser(JSON.parse(storedSession))
      }
    } catch (err) {
      console.error('Failed to parse session from localStorage:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const startSession = (name, gender = 'other') => {
    if (!name || !name.trim()) {
      throw new Error('Please enter your name to start.')
    }

    const sessionUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      gender: gender || 'other',
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        startSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
