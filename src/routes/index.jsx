import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import { HomePage } from '../features/home'

// Only the homepage route is set up for now. Add more <Route>s here as
// features grow (e.g. auth pages once src/features/auth is built out).
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
    </Routes>
  )
}
