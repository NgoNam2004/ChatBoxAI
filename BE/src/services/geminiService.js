/**
 * geminiService.js
 * SDK: @google/genai (official Google AI JS SDK v2)
 * Đã migrate từ @google/generative-ai (deprecated) sang @google/genai.
 */
import { GoogleGenAI } from '@google/genai'
import { buildGymContext } from '../data/gymData.js'

// ─── Model ────────────────────────────────────────────────────────────────────
const GEMINI_MODEL_NAME = 'gemini-3.8-flash'

// ─── System instruction ───────────────────────────────────────────────────────
function buildSystemInstruction() {
  const gymContext = buildGymContext()

  return `Bạn là AI Coach của FitAI Gym — trợ lý AI thông minh, thân thiện và chuyên nghiệp.

VAI TRÒ & PHONG CÁCH:
- Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu, tự nhiên như một HLV thực thụ
- Xưng "mình" với người dùng, gọi họ là "bạn"
- Tích cực, động viên nhưng thực tế — không hứa hẹn kết quả quá mức

LĨNH VỰC TƯ VẤN:
- Lịch tập, bài tập phù hợp theo mục tiêu (tăng cơ, giảm mỡ, tăng sức bền)
- Gợi ý bài tập cụ thể với kỹ thuật cơ bản
- Dinh dưỡng cơ bản: protein, calo, timing bữa ăn
- Thông tin về gói tập và dịch vụ của FitAI Gym

GIỚI HẠN QUAN TRỌNG:
- CHỈ sử dụng dữ liệu được cung cấp bên dưới để trả lời về giá, dịch vụ, chính sách
- Với thông tin KHÔNG CÓ trong dữ liệu (lịch mở cửa, địa chỉ chi nhánh cụ thể…): trả lời "Mình chưa có thông tin này, bạn vui lòng liên hệ trực tiếp nhân viên FitAI Gym để được hỗ trợ nhé!"
- Với câu hỏi về bệnh lý hoặc y tế nghiêm trọng: KHÔNG chẩn đoán, khuyến nghị tham khảo bác sĩ/chuyên gia y tế
- KHÔNG bịa thêm thông tin ngoài phạm vi được cung cấp

${gymContext}

Hãy bắt đầu cuộc trò chuyện thật tự nhiên và hữu ích!`
}

// ─── Client (lazy-init, reset nếu key thay đổi) ───────────────────────────────
let _ai = null
let _lastApiKey = null

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : ''

  // Debug: chỉ log true/false — TUYỆT ĐỐI KHÔNG log giá trị key
  console.log('[geminiService] GEMINI_API_KEY present:', !!apiKey)
  console.log('[geminiService] Model:', GEMINI_MODEL_NAME)

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    const error = new Error(
      'GEMINI_API_KEY chưa được thiết lập hoặc vẫn là giá trị mặc định trong file BE/.env.',
    )
    error.isConfigError = true
    throw error
  }

  // Khởi tạo client lần đầu hoặc reset khi key thay đổi (hot-reload .env)
  if (!_ai || _lastApiKey !== apiKey) {
    console.log('[geminiService] Khởi tạo GoogleGenAI client...')
    _ai = new GoogleGenAI({ apiKey })
    _lastApiKey = apiKey
    console.log('[geminiService] GoogleGenAI client khởi tạo thành công.')
  }

  return _ai
}

/**
 * Gửi một tin nhắn đến Gemini kèm lịch sử hội thoại.
 *
 * Sử dụng @google/genai API:
 *   ai.chats.create({ model, history, config }) → chat
 *   chat.sendMessage({ message }) → GenerateContentResponse
 *   response.text → string
 *
 * @param {string} message   - Tin nhắn mới của người dùng
 * @param {Array}  history   - Lịch sử hội thoại: [{ role, parts: [{ text }] }]
 * @returns {Promise<string>} Phản hồi văn bản từ AI
 */
export async function chat(message, history = []) {
  const ai = getClient()

  console.log('[geminiService] Gửi message tới Gemini. History length:', history.length)

  const maxRetries = 3
  let lastError = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[geminiService] Gửi request tới model: ${GEMINI_MODEL_NAME} (Lượt ${attempt}/${maxRetries})`)
      const chatSession = ai.chats.create({
        model: GEMINI_MODEL_NAME,
        history,
        config: {
          systemInstruction: buildSystemInstruction(),
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      })

      const response = await chatSession.sendMessage({ message })
      const text = response.text
      console.log(`[geminiService] ✅ Gemini (${GEMINI_MODEL_NAME}) phản hồi thành công. Độ dài: ${text?.length || 0} ký tự`)
      return text
    } catch (geminiErr) {
      lastError = geminiErr
      const status = geminiErr.status || geminiErr.httpStatus
      console.warn(`[geminiService] ⚠️ Model ${GEMINI_MODEL_NAME} trả lỗi (status: ${status}): ${geminiErr.message}`)

      // Thử lại nếu gặp 503 (Overload) hoặc 429 (Rate Limit) và chưa hết lượt retry
      if ((status === 503 || status === 429) && attempt < maxRetries) {
        const delayMs = attempt * 1500
        console.log(`[geminiService] Đợi ${delayMs}ms và thử lại lượt ${attempt + 1}...`)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
        continue
      }
      break
    }
  }

  // Log chi tiết lỗi Gemini — KHÔNG log API key
  console.error('[geminiService] ❌ Lỗi từ Gemini API:')
  console.error('  err.name    :', lastError.name)
  console.error('  err.message :', lastError.message)
  console.error('  err.status  :', lastError.status)

  lastError.httpStatus = lastError.status || 502
  throw lastError
}
