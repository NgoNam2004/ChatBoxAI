import express from 'express'
import { chat } from '../services/geminiService.js'

const router = express.Router()

/**
 * POST /api/chat
 *
 * Body:
 * {
 *   "message": "string",
 *   "history": [                     // optional — lịch sử hội thoại
 *     { "role": "user",  "parts": [{ "text": "..." }] },
 *     { "role": "model", "parts": [{ "text": "..." }] }
 *   ]
 * }
 *
 * Response:
 * { "success": true,  "message": "string" }
 * { "success": false, "message": "string", "code": "string" }  // khi có lỗi
 */
router.post('/', async (req, res) => {
  // ── Debug log: in ra request body nhận được ──
  console.log('[/api/chat] Request body nhận được:', {
    message: req.body?.message ? `"${req.body.message.slice(0, 80)}..."` : undefined,
    historyLength: Array.isArray(req.body?.history) ? req.body.history.length : 0,
  })

  const { message, history } = req.body

  // Validate input
  if (!message || typeof message !== 'string' || message.trim() === '') {
    console.warn('[/api/chat] 400 — Tin nhắn trống hoặc không hợp lệ.')
    return res.status(400).json({
      success: false,
      code: 'EMPTY_MESSAGE',
      message: 'Tin nhắn không được để trống.',
    })
  }

  try {
    // Validate history format nếu được truyền lên
    const validHistory = Array.isArray(history) ? history : []

    const aiReply = await chat(message.trim(), validHistory)

    return res.json({
      success: true,
      message: aiReply,
    })
  } catch (err) {
    const rawMessage = err.message || 'Unknown error'
    // Mask bất kỳ giá trị key nào trong log — TUYỆT ĐỐI không log API key
    const sanitizedMessage = rawMessage.replace(/AIza[A-Za-z0-9_-]{35}/g, '***API_KEY_REDACTED***')

    // ── Log chi tiết lỗi gốc để debug — KHÔNG che mất stack trace ──
    console.error('\n[/api/chat] ❌ Error xảy ra khi xử lý request:')
    console.error('  err.name          :', err.name)
    console.error('  err.message       :', sanitizedMessage)
    console.error('  err.isConfigError :', err.isConfigError)
    console.error('  err.httpStatus    :', err.httpStatus)
    console.error('  err.status        :', err.status)
    if (err.errorDetails) {
      console.error('  err.errorDetails  :', JSON.stringify(err.errorDetails))
    }
    if (err.stack) {
      console.error('  stack trace:\n', err.stack.replace(/AIza[A-Za-z0-9_-]{35}/g, '***REDACTED***'))
    }
    console.error('')

    // ── Phân loại lỗi chi tiết theo yêu cầu ──
    if (err.isConfigError) {
      return res.status(500).json({
        success: false,
        code: 'CONFIG_ERROR',
        message: err.message || 'Cấu hình AI chưa hoàn chỉnh (thiếu GEMINI_API_KEY).',
      })
    }

    let geminiStatus = err.httpStatus || err.status
    let parsedCode = null
    let parsedMessage = null

    if (typeof rawMessage === 'string' && rawMessage.startsWith('{')) {
      try {
        const parsed = JSON.parse(rawMessage)
        if (parsed.error) {
          if (parsed.error.code) geminiStatus = parsed.error.code
          if (parsed.error.status) parsedCode = parsed.error.status
          if (parsed.error.message) parsedMessage = parsed.error.message
        }
      } catch (e) {
        // Not valid JSON
      }
    }

    const detailMessage = parsedMessage || sanitizedMessage

    // 1. API Key / Auth Error (401, 403, PERMISSION_DENIED)
    if (
      geminiStatus === 401 ||
      geminiStatus === 403 ||
      parsedCode === 'PERMISSION_DENIED' ||
      detailMessage.toLowerCase().includes('api key')
    ) {
      return res.status(geminiStatus || 401).json({
        success: false,
        code: 'INVALID_API_KEY',
        message: `Lỗi API Key Gemini: ${detailMessage}`,
      })
    }

    // 2. Model không tồn tại / shutdown (404, NOT_FOUND)
    if (
      geminiStatus === 404 ||
      parsedCode === 'NOT_FOUND' ||
      detailMessage.toLowerCase().includes('not found')
    ) {
      return res.status(404).json({
        success: false,
        code: 'MODEL_NOT_FOUND',
        message: `Model Gemini không tồn tại hoặc đã bị ngừng hỗ trợ: ${detailMessage}`,
      })
    }

    // 3. Quota / Rate Limit (429, RESOURCE_EXHAUSTED)
    if (
      geminiStatus === 429 ||
      parsedCode === 'RESOURCE_EXHAUSTED' ||
      detailMessage.toLowerCase().includes('quota') ||
      detailMessage.toLowerCase().includes('rate limit')
    ) {
      return res.status(429).json({
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Vượt quá giới hạn lượt gọi Gemini API (Quota/Rate limit): ${detailMessage}`,
      })
    }

    // 4. Timeout (ETIMEDOUT, timeout)
    if (
      err.code === 'ETIMEDOUT' ||
      err.code === 'ESOCKETTIMEDOUT' ||
      detailMessage.toLowerCase().includes('timeout')
    ) {
      return res.status(504).json({
        success: false,
        code: 'TIMEOUT',
        message: 'Kết nối tới Gemini API bị quá thời gian (Timeout).',
      })
    }

    // 5. Service Unavailable (503, UNAVAILABLE)
    if (geminiStatus === 503 || parsedCode === 'UNAVAILABLE') {
      return res.status(503).json({
        success: false,
        code: 'SERVICE_UNAVAILABLE',
        message: `Dịch vụ Gemini đang quá tải (503): ${detailMessage}`,
      })
    }

    // 6. Bad Request (400)
    if (geminiStatus === 400) {
      return res.status(400).json({
        success: false,
        code: 'GEMINI_BAD_REQUEST',
        message: `Yêu cầu gửi tới Gemini không hợp lệ (400): ${detailMessage}`,
      })
    }

    // 7. General Gemini API Error
    return res.status(geminiStatus && geminiStatus >= 400 && geminiStatus < 600 ? geminiStatus : 502).json({
      success: false,
      code: 'GEMINI_API_ERROR',
      message: `Gemini API gặp lỗi (${geminiStatus || 502}): ${detailMessage}`,
    })
  }
})

export default router
