import { useState, useCallback, useRef } from 'react'
import { streamMessageFromAI } from '../../../services/chatService.js'

const INITIAL_MESSAGES = [
  {
    from: 'ai',
    text: 'Xin chào! Mình là FitBot — trợ lý tư vấn gói tập của FitAI Gym 🏋️\n\nBạn muốn tìm hiểu về gói tập, so sánh giá, hay cần hỗ trợ đăng ký? Mình sẵn sàng giúp!',
  },
]

/**
 * Chuyển messages (UI format) sang history (Gemini format).
 * Bỏ qua tin chào đầu, tin lỗi, và tin đang streaming.
 */
function toGeminiHistory(msgs) {
  return msgs
    .filter((m) => !m.isError && !m.isStreaming)
    .slice(1) // bỏ tin chào đầu tiên
    .map((m) => ({
      role: m.from === 'user' ? 'user' : 'model',
      parts: [{ text: m.text || '' }],
    }))
}

/**
 * useChatMessages — quản lý trạng thái hội thoại với streaming.
 *
 * Streaming flow:
 *   1. User gửi → thêm userMessage vào state ngay (optimistic)
 *   2. Thêm placeholder AI message { isStreaming: true, text: '' }
 *   3. Mỗi chunk nhận được → append vào text của placeholder đó
 *   4. onDone → đặt isStreaming = false
 *   5. onError → thay placeholder bằng error message
 */
export default function useChatMessages() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // ref để abort stream khi cần
  const abortRef = useRef(null)

  // ─── sendMessage ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (text) => {
      const trimmed = typeof text === 'string' ? text.trim() : ''
      if (!trimmed || isLoading) return

      // Snapshot history trước khi thêm userMessage (tránh race condition)
      setMessages((prev) => {
        const history = toGeminiHistory(prev)

        const userMessage    = { from: 'user', text: trimmed }
        const aiPlaceholder  = { from: 'ai', text: '', isStreaming: true }
        const next = [...prev, userMessage, aiPlaceholder]
        const aiIndex = next.length - 1 // index của placeholder

        setError(null)
        setIsLoading(true)

        // Bắt đầu stream
        const abort = streamMessageFromAI(
          trimmed,
          history,
          // onChunk — append text vào placeholder
          (chunk) => {
            setMessages((msgs) =>
              msgs.map((m, i) =>
                i === aiIndex ? { ...m, text: m.text + chunk } : m,
              ),
            )
          },
          // onDone — đánh dấu xong
          () => {
            setMessages((msgs) =>
              msgs.map((m, i) =>
                i === aiIndex ? { ...m, isStreaming: false } : m,
              ),
            )
            setIsLoading(false)
          },
          // onError — thay placeholder bằng error
          (err) => {
            const errorText =
              err.message === 'Failed to fetch'
                ? 'Không thể kết nối tới server. Vui lòng kiểm tra backend đang chạy.'
                : err.message || 'Có lỗi xảy ra, vui lòng thử lại.'

            setError(errorText)
            setMessages((msgs) =>
              msgs.map((m, i) =>
                i === aiIndex
                  ? {
                      from: 'ai',
                      text: `⚠️ ${errorText}`,
                      isError: true,
                      retryable: err.retryable !== false,
                      failedMessage: trimmed,
                      isStreaming: false,
                    }
                  : m,
              ),
            )
            setIsLoading(false)
          },
        )

        abortRef.current = abort
        return next
      })
    },
    [isLoading],
  )

  // ─── retryMessage ────────────────────────────────────────────────────────────
  const retryMessage = useCallback(
    (failedText, errorIndex) => {
      if (!failedText || isLoading) return

      setError(null)
      setIsLoading(true)

      setMessages((prev) => {
        // Xóa tin lỗi, giữ lại tin user ngay trước đó
        const withoutError = prev.filter((_, i) => i !== errorIndex)

        // Tính lịch sử trước user message (errorIndex - 1)
        const userMsgIdx = errorIndex - 1
        const priorMsgs  = withoutError.filter((_, i) => i < userMsgIdx)
        const history    = toGeminiHistory(priorMsgs)

        const aiPlaceholder = { from: 'ai', text: '', isStreaming: true }
        const next = [...withoutError, aiPlaceholder]
        const aiIndex = next.length - 1

        const abort = streamMessageFromAI(
          failedText,
          history,
          (chunk) => {
            setMessages((msgs) =>
              msgs.map((m, i) =>
                i === aiIndex ? { ...m, text: m.text + chunk } : m,
              ),
            )
          },
          () => {
            setMessages((msgs) =>
              msgs.map((m, i) =>
                i === aiIndex ? { ...m, isStreaming: false } : m,
              ),
            )
            setIsLoading(false)
          },
          (err) => {
            const errorText =
              err.message === 'Failed to fetch'
                ? 'Không thể kết nối tới server. Vui lòng kiểm tra backend đang chạy.'
                : err.message || 'Có lỗi xảy ra, vui lòng thử lại.'

            setError(errorText)
            setMessages((msgs) =>
              msgs.map((m, i) =>
                i === aiIndex
                  ? {
                      from: 'ai',
                      text: `⚠️ ${errorText}`,
                      isError: true,
                      retryable: err.retryable !== false,
                      failedMessage: failedText,
                      isStreaming: false,
                    }
                  : m,
              ),
            )
            setIsLoading(false)
          },
        )

        abortRef.current = abort
        return next
      })
    },
    [isLoading],
  )

  const handleSend = useCallback(() => {
    sendMessage(input)
    setInput('')
  }, [input, sendMessage])

  return {
    messages,
    input,
    setInput,
    handleSend,
    sendMessage,
    retryMessage,
    isLoading,
    error,
  }
}
