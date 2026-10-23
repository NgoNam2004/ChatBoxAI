/**
 * ProtectedRoute — chặn truy cập nếu chưa đăng nhập.
 * Trong khi đang khôi phục phiên (loading = true) thì hiển thị spinner.
 */
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
