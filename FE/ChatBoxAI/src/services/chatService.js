/**
 * Giao tiếp với backend AI Coach của FitAI Gym.
 * Tất cả cuộc gọi Gemini đều được thực hiện phía backend — không bao giờ gọi
 * Gemini API trực tiếp từ đây.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Gửi tin nhắn tới AI Coach và nhận phản hồi.
 *
 * @param {string} message - Tin nhắn của người dùng
 * @param {Array<{role: 'user'|'model', parts: [{text: string}]}>} history - Lịch sử hội thoại (Gemini format)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendMessageToAI(message, history = []) {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Yêu cầu AI Coach thất bại.')
  }

  return data
}
