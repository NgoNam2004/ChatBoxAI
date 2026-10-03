import React from 'react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx'
import AppRoutes from './routes/index.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </ThemeProvider>
  )
}
