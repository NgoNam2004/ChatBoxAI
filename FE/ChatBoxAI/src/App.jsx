import React from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx'
import { LoadingProvider } from './context/LoadingContext.jsx'
import AppRoutes from './routes/index.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <LoadingProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              containerStyle={{ top: 60, right: 16 }}
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0F172A',
                  color: '#fff',
                  borderRadius: '14px',
                  fontSize: '14px',
                  maxWidth: '360px',
                },
              }}
            />
          </LoadingProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}