import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_USERS_KEY = 'facial_analysis_users'
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

  const getUsers = () => {
    try {
      const users = localStorage.getItem(STORAGE_USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }

  const register = (name, email, password) => {
    const users = getUsers()
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      throw new Error('An account with this email already exists.')
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email: email.toLowerCase(),
      password, // Note: Prototype storage for local demonstration
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))

    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email }
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  const login = (email, password) => {
    const users = getUsers()
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!found) {
      // For smooth demo experience, if no users exist yet, allow quick demo login
      if (users.length === 0 && email && password) {
        return register(email.split('@')[0] || 'User', email, password)
      }
      throw new Error('Invalid email or password.')
    }

    const sessionUser = { id: found.id, name: found.name, email: found.email }
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
        login,
        register,
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
