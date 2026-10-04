import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import { HomePage } from '../features/home'
import { LoginPage, RegisterPage } from '../features/auth'
import { ProfilePage } from '../features/profile'
// Trang chủ dùng MainLayout (Header + Footer + Chat).
// Trang Auth tự bọc AuthLayout bên trong nên không cần MainLayout.
export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/profile"
        element={
          <MainLayout>
            <ProfilePage />
          </MainLayout>
        }
      />
    </Routes>
  )
}