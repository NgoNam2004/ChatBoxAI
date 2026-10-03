import React, { createContext, useContext, useState } from 'react'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const [isChatOpen, setChatOpen] = useState(false)

  const openChat = () => setChatOpen(true)
  const closeChat = () => setChatOpen(false)
  const toggleChat = () => setChatOpen((v) => !v)

  return (
    <ChatContext.Provider value={{ isChatOpen, openChat, closeChat, toggleChat }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  return useContext(ChatContext)
}
