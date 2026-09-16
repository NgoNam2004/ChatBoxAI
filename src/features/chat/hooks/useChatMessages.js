import { useState } from 'react'

const INITIAL_MESSAGES = [
  {
    from: 'ai',
    text: 'Chào bạn 👋 Mình là AI Coach của FitAI Gym. Bạn muốn bắt đầu với mục tiêu gì: giảm mỡ, tăng cơ hay tăng sức bền?',
  },
]

const DEMO_REPLY = 'Cảm ơn bạn! Đây là bản demo giao diện — đăng ký tài khoản để trải nghiệm AI Coach thật nhé.'

// Encapsulates the (currently demo/mocked) chat conversation state so
// ChatPopup only has to worry about layout. Swap sendMessage's body for a
// real API call (see src/services) once the backend is ready.
export default function useChatMessages() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((m) => [...m, { from: 'user', text: trimmed }, { from: 'ai', text: DEMO_REPLY }])
  }

  const handleSend = () => {
    sendMessage(input)
    setInput('')
  }

  return { messages, input, setInput, handleSend, sendMessage }
}
