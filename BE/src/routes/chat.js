import express from 'express'
import { chatStream } from '../services/geminiService.js'

const router = express.Router()

/**
 * POST /api/chat/stream
 *
 * Server-Sent Events (SSE) endpoint — stream tokens về FE realtime.
 *
 * Request body:
 * {
 *   "message": "string",
 *   "history": [{ "role": "user"|"model", "parts": [{ "text": "..." }] }]
 * }
 *
 * SSE event types:
 *   data: {"type":"chunk","text":"..."}   — mỗi chunk text
 *   data: {"type":"done"}                 — kết thúc stream thành công
 *   data: {"type":"error","code":"...","message":"...","retryable":bool}  — lỗi
 */
router.post('/stream', async (req, res) => {
  const t0 = Date.now()
  console.log(`\n[/api/chat/stream] ⬇️  Request nhận lúc ${new Date().toISOString()}`)
  console.log('[/api/chat/stream] Body:', {
    message: req.body?.message ? `"${req.body.message.slice(0, 80)}..."` : undefined,
    historyLength: Array.isArray(req.body?.history) ? req.body.history.length : 0,
  })

  const { message, history } = req.body

  // Validate
  if (!message || typeof message !== 'string' || message.trim() === '') {
    console.warn('[/api/chat/stream] 400 — Tin nhắn trống.')
    return res.status(400).json({ success: false, code: 'EMPTY_MESSAGE', message: 'Tin nhắn không được để trống.' })
  }

  const validHistory = Array.isArray(history) ? history : []

  // ─── SSE setup ──────────────────────────────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // tắt buffering trên Nginx/proxy
  res.flushHeaders()

  // Helper gửi SSE event
  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`)

  try {
    const tGemini = Date.now()
    console.log(`[/api/chat/stream] ⏱  Gọi Gemini sau ${tGemini - t0}ms kể từ khi nhận request`)

    let firstChunk = true
    let totalChars = 0

    const stream = chatStream(message.trim(), validHistory)

    for await (const chunk of stream) {
      if (firstChunk) {
        const tFirst = Date.now()
        console.log(`[/api/chat/stream] ⚡ Token đầu tiên sau ${tFirst - t0}ms (TTFT)`)
        firstChunk = false
      }
      totalChars += chunk.length
      send({ type: 'chunk', text: chunk })
    }

    const tDone = Date.now()
    console.log(`[/api/chat/stream] ✅ Stream hoàn thành sau ${tDone - t0}ms | ${totalChars} ký tự`)

    send({ type: 'done' })
    res.end()

  } catch (err) {
    const tErr = Date.now()
    const rawMessage = err.message || 'Unknown error'
    const sanitized  = rawMessage.replace(/AIza[A-Za-z0-9_-]{35}/g, '***REDACTED***')

    console.error(`\n[/api/chat/stream] ❌ Lỗi sau ${tErr - t0}ms:`)
    console.error('  err.name         :', err.name)
    console.error('  err.message      :', sanitized)
    console.error('  err.isConfigError:', err.isConfigError)
    console.error('  err.status       :', err.status)
    if (err.stack) console.error('  stack:\n', err.stack.replace(/AIza[A-Za-z0-9_-]{35}/g, '***REDACTED***'))

    send(buildErrorPayload(err))
    res.end()
  }
})

/**
 * POST /api/chat  (non-streaming, giữ để backward compat)
 *
 * Collect toàn bộ chunks rồi trả về một JSON.
 * FE cũ vẫn hoạt động; nên dần migrate sang /stream.
 */
router.post('/', async (req, res) => {
  const t0 = Date.now()
  console.log(`\n[/api/chat] ⬇️  Request nhận lúc ${new Date().toISOString()}`)
  console.log('[/api/chat] Body:', {
    message: req.body?.message ? `"${req.body.message.slice(0, 80)}..."` : undefined,
    historyLength: Array.isArray(req.body?.history) ? req.body.history.length : 0,
  })

  const { message, history } = req.body

  if (!message || typeof message !== 'string' || message.trim() === '') {
    console.warn('[/api/chat] 400 — Tin nhắn trống.')
    return res.status(400).json({ success: false, code: 'EMPTY_MESSAGE', message: 'Tin nhắn không được để trống.' })
  }

  const validHistory = Array.isArray(history) ? history : []

  try {
    const tGemini = Date.now()
    console.log(`[/api/chat] ⏱  Gọi Gemini sau ${tGemini - t0}ms`)

    let fullText = ''
    let firstChunk = true

    for await (const chunk of chatStream(message.trim(), validHistory)) {
      if (firstChunk) {
        console.log(`[/api/chat] ⚡ Token đầu tiên sau ${Date.now() - t0}ms (TTFT)`)
        firstChunk = false
      }
      fullText += chunk
    }

    const tDone = Date.now()
    console.log(`[/api/chat] ✅ Done sau ${tDone - t0}ms | ${fullText.length} ký tự`)

    return res.json({ success: true, message: fullText })

  } catch (err) {
    const rawMessage = err.message || 'Unknown error'
    const sanitized  = rawMessage.replace(/AIza[A-Za-z0-9_-]{35}/g, '***REDACTED***')

    console.error('\n[/api/chat] ❌ Error:')
    console.error('  err.name         :', err.name)
    console.error('  err.message      :', sanitized)
    console.error('  err.isConfigError:', err.isConfigError)
    console.error('  err.status       :', err.status)
    if (err.stack) console.error('  stack:\n', err.stack.replace(/AIza[A-Za-z0-9_-]{35}/g, '***REDACTED***'))

    const payload = buildErrorPayload(err)
    const httpStatus = getHttpStatus(err)
    return res.status(httpStatus).json({ success: false, ...payload })
  }
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getHttpStatus(err) {
  const s = err.httpStatus || err.status
  if (err.isConfigError)                         return 500
  if (s === 401 || s === 403)                    return s
  if (s === 503)                                 return 503
  if (s === 429)                                 return 429
  if (err.code === 'ETIMEDOUT')                  return 504
  if (s === 404)                                 return 404
  if (s === 400)                                 return 400
  return 502
}

function buildErrorPayload(err) {
  const rawMessage = err.message || 'Unknown error'
  const sanitized  = rawMessage.replace(/AIza[A-Za-z0-9_-]{35}/g, '***REDACTED***')
  const s = err.httpStatus || err.status
  const detail = sanitized.toLowerCase()

  if (err.isConfigError) {
    return { type: 'error', code: 'CONFIG_ERROR', retryable: false, message: 'Hệ thống AI chưa được cấu hình API key. Vui lòng liên hệ quản trị viên.' }
  }
  if (s === 401 || s === 403 || detail.includes('api key') || detail.includes('permission denied')) {
    return { type: 'error', code: 'INVALID_API_KEY', retryable: false, message: 'Khóa API không hợp lệ. Vui lòng liên hệ quản trị viên.' }
  }
  if (s === 503 || detail.includes('overloaded') || detail.includes('unavailable')) {
    return { type: 'error', code: 'SERVICE_UNAVAILABLE', retryable: true, message: 'Dịch vụ AI đang bận, bạn vui lòng thử lại sau vài giây nhé!' }
  }
  if (s === 429 || detail.includes('quota') || detail.includes('rate limit')) {
    return { type: 'error', code: 'RATE_LIMIT_EXCEEDED', retryable: true, message: 'Hệ thống AI tạm thời quá tải, vui lòng thử lại sau ít giây!' }
  }
  if (err.code === 'ETIMEDOUT' || detail.includes('timeout')) {
    return { type: 'error', code: 'TIMEOUT', retryable: true, message: 'Kết nối AI bị gián đoạn. Vui lòng kiểm tra mạng và thử lại!' }
  }
  if (s === 404) {
    return { type: 'error', code: 'MODEL_NOT_FOUND', retryable: false, message: 'Mô hình AI không khả dụng. Vui lòng liên hệ quản trị viên.' }
  }
  if (s === 400) {
    return { type: 'error', code: 'BAD_REQUEST', retryable: false, message: 'Nội dung tin nhắn không thể xử lý. Vui lòng diễn đạt lại nhé!' }
  }
  return { type: 'error', code: 'SYSTEM_ERROR', retryable: true, message: 'Hệ thống gặp sự cố tạm thời. Vui lòng thử lại sau vài giây!' }
}

export default router
