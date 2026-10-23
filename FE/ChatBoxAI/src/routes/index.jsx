import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import { HomePage } from '../features/home'
import { LoginPage, RegisterPage } from '../features/auth'
import { ProfilePage } from '../features/profile'
import ProtectedRoute from './ProtectedRoute.jsx'

// Trang chủ dùng MainLayout (Header + Footer + Chat).
// Trang Auth tự bọc AuthLayout bên trong nên không cần MainLayout.
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}