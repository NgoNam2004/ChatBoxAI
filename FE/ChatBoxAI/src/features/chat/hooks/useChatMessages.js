import { useState, useCallback } from 'react'
import { sendMessageToAI } from '../../../services/chatService.js'

const INITIAL_MESSAGES = [
  {
    from: 'ai',
    text: 'Chào bạn 👋 Mình là AI Coach của FitAI Gym. Bạn muốn bắt đầu với mục tiêu gì: giảm mỡ, tăng cơ hay tăng sức bền?',
  },
]

/**
 * Chuyển đổi messages (định dạng UI) sang history (định dạng Gemini API).
 * Gemini yêu cầu: role = 'user' | 'model', parts = [{ text }]
 * Tin nhắn đầu tiên (chào hỏi từ AI) được bỏ qua vì nó là system greeting.
 */
function toGeminiHistory(messages) {
  return messages
    .slice(1) // bỏ tin nhắn chào đầu tiên (không phải do user gửi)
    .map((m) => ({
      role: m.from === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }))
}

/**
 * Quản lý trạng thái hội thoại với AI Coach.
 * Lưu lịch sử trong state để Gemini hiểu context của toàn bộ cuộc trò chuyện.
 */
export default function useChatMessages() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      // Thêm tin nhắn user vào UI ngay lập tức
      const userMessage = { from: 'user', text: trimmed }
      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setError(null)
      setIsLoading(true)

      try {
        // Tạo lịch sử cho Gemini từ các tin nhắn đã có (không bao gồm tin nhắn user vừa gửi)
        const history = toGeminiHistory(messages)

        const response = await sendMessageToAI(trimmed, history)

        if (response.success) {
          setMessages((prev) => [...prev, { from: 'ai', text: response.message }])
        } else {
          throw new Error(response.message || 'Phản hồi không hợp lệ từ server.')
        }
      } catch (err) {
        const errorText =
          err.message === 'Failed to fetch'
            ? 'Không thể kết nối tới server. Vui lòng kiểm tra backend đang chạy.'
            : err.message || 'Có lỗi xảy ra, vui lòng thử lại.'

        setError(errorText)
        // Hiển thị lỗi dưới dạng tin nhắn AI để không mất UX
        setMessages((prev) => [
          ...prev,
          {
            from: 'ai',
            text: `⚠️ ${errorText}`,
            isError: true,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isLoading],
  )

  const handleSend = useCallback(() => {
    sendMessage(input)
    setInput('')
  }, [input, sendMessage])

  return { messages, input, setInput, handleSend, sendMessage, isLoading, error }
}
