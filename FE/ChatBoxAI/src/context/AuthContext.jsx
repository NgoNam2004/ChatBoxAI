import React, { createContext, useCallback, useContext, useState } from 'react'
import { clearSession, getUser, saveSession } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser())

  const signIn = useCallback((token, userData) => {
    saveSession(token, userData)
    setUser(userData)
  }, [])
  const signOut = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}