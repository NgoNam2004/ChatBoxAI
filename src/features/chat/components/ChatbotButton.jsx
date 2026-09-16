import React from 'react'
import { Bot, Sparkles } from 'lucide-react'
import { useChat } from '../../../context/ChatContext.jsx'

// Floating "AI Coach" button, bottom-right. Opens ChatPopup on click.
export default function ChatbotButton() {
  const { isChatOpen, toggleChat } = useChat()

  // Hide the floating trigger on mobile while the full-screen popup is open.
  if (isChatOpen) return null

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-5 right-5 lg:right-8 z-50 flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold pl-4 pr-5 py-3.5 rounded-full shadow-xl shadow-orange-900/30 animate-pulse-slow"
      aria-label="Mở AI Coach chatbot"
    >
      <Bot size={20} />
      <span className="text-sm hidden sm:inline">AI Coach</span>
      <Sparkles size={14} className="hidden sm:inline" />
    </button>
  )
}
