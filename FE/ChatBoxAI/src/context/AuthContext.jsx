/**
 * AuthContext.jsx
 * Quản lý trạng thái xác thực: token (localStorage), user, login/register/logout.
 * Tự gọi /api/auth/me khi tải trang để khôi phục phiên.
 * Token hết hạn hoặc 401 → tự đăng xuất và về trang đăng nhập.
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, clearSession, getStoredToken, getStoredUser, saveSession } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true) // đang khôi phục phiên

  // ── Khôi phục phiên khi tải trang ──
  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setLoading(false)
      return
    }
    getMe(token)
      .then((data) => {
        setUser(data.data.user)
      })
      .catch(() => {
        // Token hết hạn hoặc lỗi → xóa session
        clearSession()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback((token, userData) => {
    saveSession(token, userData)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    navigate('/login')
  }, [navigate])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}