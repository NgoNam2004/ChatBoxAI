/**
 * chatService.js
 * Giao tiếp với backend FitAI Gym CSKH.
 * Tất cả cuộc gọi Gemini đều được thực hiện phía backend.
 *
 * Export:
 *   streamMessageFromAI(message, history, onChunk, onDone, onError) — SSE streaming
 *   sendMessageToAI(message, history) — non-streaming (backward compat)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// ─── Streaming (SSE) ──────────────────────────────────────────────────────────
/**
 * Gửi tin nhắn và nhận phản hồi qua SSE streaming.
 *
 * @param {string}   message  - Tin nhắn người dùng
 * @param {Array}    history  - Lịch sử Gemini format
 * @param {Function} onChunk  - Gọi với từng chunk text: (text: string) => void
 * @param {Function} onDone   - Gọi khi stream kết thúc thành công: () => void
 * @param {Function} onError  - Gọi khi có lỗi: (err: Error) => void
 * @returns {Function} abort — gọi để hủy stream
 */
export function streamMessageFromAI(message, history = [], onChunk, onDone, onError) {
  const controller = new AbortController()

  ;(async () => {
    let res
    try {
      res = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
        signal: controller.signal,
      })
    } catch (networkErr) {
      if (networkErr.name === 'AbortError') return
      const err = new Error('Không thể kết nối tới server. Vui lòng kiểm tra backend đang chạy.')
      err.retryable = true
      onError(err)
      return
    }

    if (!res.ok) {
      // Lỗi HTTP — đọc body JSON
      const data = await res.json().catch(() => ({}))
      const err = new Error(data.message || 'Yêu cầu AI thất bại.')
      err.code = data.code
      err.retryable = data.retryable !== undefined ? data.retryable : (res.status === 503 || res.status === 429)
      onError(err)
      return
    }

    // Đọc SSE stream line-by-line
    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // giữ lại dòng chưa hoàn chỉnh

        for (const line of lines) {
          if (!line.startsWith('data:')) continue
          const json = line.slice(5).trim()
          if (!json) continue

          let event
          try { event = JSON.parse(json) } catch { continue }

          if (event.type === 'chunk' && event.text) {
            onChunk(event.text)
          } else if (event.type === 'done') {
            onDone()
            return
          } else if (event.type === 'error') {
            const err = new Error(event.message || 'Lỗi từ server AI.')
            err.code = event.code
            err.retryable = event.retryable
            onError(err)
            return
          }
        }
      }

      // Stream kết thúc mà không có event "done" — coi như xong
      onDone()
    } catch (readErr) {
      if (readErr.name === 'AbortError') return
      onError(readErr)
    }
  })()

  return () => controller.abort()
}

// ─── Non-streaming (backward compat) ─────────────────────────────────────────
/**
 * Gửi tin nhắn và nhận toàn bộ phản hồi trong một JSON.
 * Dùng cho các nơi chưa migrate sang streaming.
 *
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendMessageToAI(message, history = []) {
  let res
  try {
    res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    })
  } catch (networkErr) {
    const error = new Error('Không thể kết nối tới server. Vui lòng kiểm tra backend đang chạy.')
    error.retryable = true
    throw error
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const error = new Error(data.message || 'Yêu cầu AI thất bại.')
    error.code = data.code
    error.retryable = data.retryable !== undefined ? data.retryable : (res.status === 503 || res.status === 429)
    throw error
  }

  return data
}
