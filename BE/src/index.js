import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import chatRouter from './routes/chat.js'

const app = express()
const PORT = process.env.PORT || 3001

// ─── Startup Diagnostics ──────────────────────────────────────────────────────
const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : ''
const isConfigured = apiKey && apiKey !== 'your_gemini_api_key_here'

console.log('┌─────────────────────────────────────────────────┐')
console.log('│         FitAI Gym Backend — Startup Check        │')
console.log('├─────────────────────────────────────────────────┤')
console.log(`│  PORT             : ${PORT}`)
console.log(`│  FRONTEND_ORIGIN  : ${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}`)
console.log(`│  GEMINI_API_KEY   : ${isConfigured ? '✅ Đã cấu hình' : '❌ CHƯA cấu hình (vẫn là giá trị mặc định)'}`)
console.log(`│  dotenv loaded    : ${isConfigured !== null ? 'yes' : 'no'}`)
console.log('└─────────────────────────────────────────────────┘')

if (!isConfigured) {
  console.error(
    '\n⚠️  CẢNH BÁO: GEMINI_API_KEY chưa được thiết lập trong d:\\ChatBoxAI\\BE\\.env',
  )
  console.error(
    '   → Mở file .env và thay "your_gemini_api_key_here" bằng API Key thật của bạn.',
  )
  console.error('   → Lấy API Key miễn phí tại: https://aistudio.google.com/app/apikey\n')
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
)
app.use(express.json({ limit: '1mb' }))

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/chat', chatRouter)

// Health check — trả về cả trạng thái GEMINI_API_KEY
app.get('/api/health', (_req, res) => {
  const key = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : ''
  const configured = !!(key && key !== 'your_gemini_api_key_here')
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: configured,
  })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint không tồn tại.' })
})

// Global error handler — KHÔNG che mất lỗi: log full stack trace
app.use((err, _req, res, _next) => {
  console.error('[Global Error Handler]', err)
  res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.', code: 'INTERNAL_ERROR' })
})

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ Server đang chạy tại http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/api/health`)
  console.log(`   Chat API    : POST http://localhost:${PORT}/api/chat\n`)
})
