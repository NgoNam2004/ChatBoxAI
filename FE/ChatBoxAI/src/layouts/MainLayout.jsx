import React from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { ChatbotButton, ChatPopup } from '../features/chat'

// Shared page shell: Header + Footer stay fixed across every route, and the
// floating AI Chat button/popup is mounted here so it's available everywhere.
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-ink">
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatbotButton />
      <ChatPopup />
    </div>
  )
}
