/**
 * geminiService.js
 * SDK: @google/genai (official Google AI JS SDK v2)
 *
 * Tính năng:
 * - Streaming (generateContentStream) → BE đẩy SSE về FE
 * - Singleton GoogleGenAI client — tạo một lần khi boot
 * - System prompt nạp từ customerService.md + packages.json khi boot, không đọc lại mỗi request
 * - Giới hạn lịch sử (MAX_HISTORY_TURNS) để prompt không phình to
 * - maxOutputTokens 350 — đủ cho câu trả lời CSKH ngắn gọn
 * - Retry với exponential backoff + jitter cho lỗi 503/429
 * - Fallback sang model dự phòng nếu model chính liên tục lỗi
 * - Lỗi 400/401/403 KHÔNG retry (lỗi config / auth)
 * - Timing log từng khâu (nhận request → gọi Gemini → token đầu tiên → xong)
 */

import { GoogleGenAI } from '@google/genai'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

// ─── Paths ────────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROMPT_PATH  = path.join(__dirname, '../prompts/customerService.md')
const PACKAGES_PATH = path.join(__dirname, '../data/packages.json')

// ─── Config ───────────────────────────────────────────────────────────────────
const MAX_HISTORY_TURNS = 10   // Chỉ giữ N tin gần nhất (mỗi turn = 1 user + 1 model)
const MAX_OUTPUT_TOKENS  = 350  // Đủ cho câu trả lời CSKH ngắn gọn
const TEMPERATURE        = 0.7  // Cân bằng giữa tự nhiên và chính xác

// ─── Retry config ─────────────────────────────────────────────────────────────
const MAX_RETRIES          = 3
const BASE_DELAY_MS        = 1000
const MAX_JITTER_MS        = 500
const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404])

function backoffDelay(attempt) {
  return BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * MAX_JITTER_MS
}

// ─── System Instruction (nạp một lần khi module được import) ─────────────────
let _systemInstruction = null

function buildSystemInstruction() {
  if (_systemInstruction) return _systemInstruction // đã nạp rồi, dùng lại

  try {
    // Đọc system prompt template
    const promptTemplate = readFileSync(PROMPT_PATH, 'utf-8')

    // Đọc và build dữ liệu gói tập
    const packages = JSON.parse(readFileSync(PACKAGES_PATH, 'utf-8'))
    const gymData  = buildGymDataSection(packages)

    // Ghép dữ liệu vào template
    _systemInstruction = promptTemplate.replace('{{GYM_DATA}}', gymData)

    console.log('[geminiService] ✅ System instruction nạp từ file thành công.')
    console.log(`[geminiService]    Prompt length: ${_systemInstruction.length} ký tự`)
  } catch (err) {
    console.error('[geminiService] ⚠️  Không đọc được file prompt/packages, dùng fallback nội tuyến:', err.message)
    // Fallback đơn giản nếu file không đọc được
    _systemInstruction = `Bạn là FitBot — trợ lý CSKH của FitAI Gym. 
Tư vấn gói tập, giải đáp thắc mắc về dịch vụ. 
Không đưa lời khuyên tập luyện hoặc dinh dưỡng cụ thể.
Xưng "mình", gọi khách là "bạn". Nếu khách xưng "anh/chị" thì xưng "em".
Trả lời bằng tiếng Việt, tự nhiên, ngắn gọn.`
  }

  return _systemInstruction
}

/**
 * Chuyển dữ liệu packages.json thành text để nhét vào system prompt.
 */
function buildGymDataSection(data) {
  const { gym, packages, payment, promotions, policies, faq } = data

  const pkgText = packages.map((p) => {
    const lines = [`**${p.name}** – ${p.price}${p.priceNote ? ` (${p.priceNote})` : ''}`]
    if (p.subtitle) lines.push(`  ↳ ${p.subtitle}`)
    lines.push(`  Bao gồm: ${p.features.join(', ')}`)
    if (p.notIncluded?.length) lines.push(`  Không bao gồm: ${p.notIncluded.join(', ')}`)
    if (p.highlight)           lines.push(`  [Điểm nổi bật: ${p.highlight}]`)
    return lines.join('\n')
  }).join('\n\n')

  const faqText = faq.map((f) => `- Hỏi: ${f.q}\n  Đáp: ${f.a}`).join('\n')

  const promoText = (promotions || []).filter(p => !p.includes('PLACEHOLDER')).join(', ') || 'Hiện chưa có ưu đãi đặc biệt.'

  const gymInfo = [
    gym.hotline  && !gym.hotline.includes('PLACEHOLDER')  ? `Hotline: ${gym.hotline}` : null,
    gym.email    && !gym.email.includes('PLACEHOLDER')    ? `Email: ${gym.email}` : null,
    gym.address  && !gym.address.includes('PLACEHOLDER')  ? `Địa chỉ: ${gym.address}` : null,
    gym.openingHours?.weekdays && !gym.openingHours.weekdays.includes('PLACEHOLDER')
      ? `Giờ mở cửa: ${gym.openingHours.weekdays} (thứ 2–6), ${gym.openingHours.weekend} (thứ 7–CN)` : null,
  ].filter(Boolean)

  const gymInfoText = gymInfo.length
    ? gymInfo.join('\n')
    : 'Thông tin liên hệ chưa được cấu hình — hướng khách liên hệ trực tiếp phòng gym.'

  const policyText = Object.entries(policies || {})
    .filter(([, v]) => v && !v.includes('PLACEHOLDER'))
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n') || 'Chưa có thông tin chính sách chi tiết.'

  return `=== DỮ LIỆU FITAI GYM ===

THÔNG TIN LIÊN HỆ:
${gymInfoText}

CÁC GÓI TẬP & GIÁ:
${pkgText}

HÌNH THỨC THANH TOÁN: ${(payment || []).join(', ')}

ƯU ĐÃI HIỆN TẠI: ${promoText}

CHÍNH SÁCH:
${policyText}

FAQ:
${faqText}

LƯU Ý QUAN TRỌNG:
- Mọi thông tin KHÔNG CÓ trong dữ liệu trên: thành thật nói không biết và mời khách liên hệ hotline/nhân viên phòng gym.
- TUYỆT ĐỐI không bịa thêm số liệu, giá, địa chỉ hay thông tin nào.`
}

// ─── Client singleton ──────────────────────────────────────────────────────────
let _ai = null
let _lastApiKey = null

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : ''

  console.log('[geminiService] GEMINI_API_KEY present:', !!apiKey)

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    const error = new Error('GEMINI_API_KEY chưa được thiết lập hoặc vẫn là giá trị mặc định trong BE/.env.')
    error.isConfigError = true
    throw error
  }

  if (!_ai || _lastApiKey !== apiKey) {
    console.log('[geminiService] Khởi tạo GoogleGenAI client...')
    _ai = new GoogleGenAI({ apiKey })
    _lastApiKey = apiKey
    console.log('[geminiService] GoogleGenAI client khởi tạo thành công.')
    // Nạp system instruction ngay khi boot
    buildSystemInstruction()
  }

  return _ai
}

// ─── Model list ───────────────────────────────────────────────────────────────
function getModelList() {
  const primary = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim()
  const fallbackRaw = process.env.GEMINI_FALLBACK_MODELS || ''
  const fallbacks = fallbackRaw.split(',').map((m) => m.trim()).filter(Boolean)
  return [primary, ...fallbacks]
}

// ─── Trim history ─────────────────────────────────────────────────────────────
/**
 * Giữ chỉ N turns gần nhất (mỗi turn = 1 user + 1 model)
 * để tránh prompt phình to khi hội thoại dài.
 */
function trimHistory(history) {
  if (!Array.isArray(history) || history.length === 0) return []
  // history: [user, model, user, model, ...]
  // 1 turn = 2 entries. MAX_HISTORY_TURNS turns = MAX_HISTORY_TURNS * 2 entries
  const maxEntries = MAX_HISTORY_TURNS * 2
  if (history.length <= maxEntries) return history
  return history.slice(history.length - maxEntries)
}

// ─── Core: streaming call với retry ──────────────────────────────────────────
/**
 * Gọi Gemini ở chế độ streaming, yield từng chunk text.
 * @yields {string} chunk text
 */
async function* tryModelStream(ai, modelName, message, history) {
  let lastError = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[geminiService] 🚀 Stream request → model: ${modelName} (Lượt ${attempt}/${MAX_RETRIES})`)

      const contents = [
        ...history,
        { role: 'user', parts: [{ text: message }] },
      ]

      const stream = await ai.models.generateContentStream({
        model: modelName,
        contents,
        config: {
          systemInstruction: buildSystemInstruction(),
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          temperature: TEMPERATURE,
          // Tắt thinking budget (không cần suy luận sâu cho CSKH)
          thinkingConfig: { thinkingBudget: 0 },
        },
      })

      // yield từng chunk
      for await (const chunk of stream) {
        const text = chunk.text
        if (text) yield text
      }

      return // stream kết thúc bình thường → done

    } catch (err) {
      lastError = err
      const status = err.status || err.httpStatus

      console.warn(
        `[geminiService] ⚠️ Model ${modelName} lỗi (status: ${status}, lượt ${attempt}/${MAX_RETRIES}): ${err.message}`,
      )

      if (NON_RETRYABLE_STATUSES.has(status)) {
        console.error(`[geminiService] ❌ Lỗi ${status} không thể retry.`)
        throw lastError
      }

      if ((status === 503 || status === 429) && attempt < MAX_RETRIES) {
        const delayMs = Math.round(backoffDelay(attempt))
        console.log(`[geminiService] ⏳ Đợi ${delayMs}ms trước lượt ${attempt + 1}...`)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
        continue
      }

      throw lastError
    }
  }

  throw lastError
}

// ─── Public API: chatStream ───────────────────────────────────────────────────
/**
 * Gửi tin nhắn và trả về async generator streaming chunks.
 * Route handler sẽ pipe chunks này về FE qua SSE.
 *
 * @param {string} message  - Tin nhắn người dùng
 * @param {Array}  history  - Lịch sử Gemini format: [{ role, parts: [{text}] }]
 * @yields {string} chunk text
 */
export async function* chatStream(message, history = []) {
  const ai       = getClient()
  const models   = getModelList()
  const trimmed  = trimHistory(history)

  console.log('[geminiService] 📨 chatStream — history length (trimmed):', trimmed.length, '/', history.length)
  console.log('[geminiService] Models:', models.join(' → '))

  let lastError = null

  for (let i = 0; i < models.length; i++) {
    const modelName = models[i]
    if (i > 0) console.log(`[geminiService] 🔄 Fallback → ${modelName}`)

    try {
      yield* tryModelStream(ai, modelName, message, trimmed)
      return // success
    } catch (err) {
      lastError = err
      const status = err.status || err.httpStatus

      if (NON_RETRYABLE_STATUSES.has(status) && status !== 404) break
      console.warn(`[geminiService] ⚠️ Model ${modelName} thất bại. ${i < models.length - 1 ? 'Thử model tiếp...' : 'Hết model dự phòng.'}`)
    }
  }

  console.error('[geminiService] ❌ Tất cả model đều thất bại.')
  console.error('  err.message:', lastError?.message)
  console.error('  err.status :', lastError?.status)

  lastError.httpStatus = lastError?.status || 502
  throw lastError
}

// ─── Warm-up: nạp system instruction ngay khi server boot ────────────────────
// Gọi sớm để sẵn sàng trước request đầu tiên (không làm chậm request)
try {
  buildSystemInstruction()
} catch (_) {
  // Client chưa init, sẽ nạp khi getClient() được gọi lần đầu
}
