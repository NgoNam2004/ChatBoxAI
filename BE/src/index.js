import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import chatRouter from './routes/chat.js'
import authRouter from './routes/auth.js'
import { pool } from './config/db.js'

const app  = express()
const PORT = process.env.PORT || 3001

// ─── Startup Diagnostics ──────────────────────────────────────────────────────
const apiKey      = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : ''
const isConfigured = apiKey && apiKey !== 'your_gemini_api_key_here'

console.log('┌─────────────────────────────────────────────────┐')
console.log('│         ChatBoxAI Backend — Startup Check        │')
console.log('├─────────────────────────────────────────────────┤')
console.log(`│  PORT             : ${PORT}`)
console.log(`│  FRONTEND_ORIGIN  : ${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}`)
console.log(`│  GEMINI_API_KEY   : ${isConfigured ? '✅ Đã cấu hình' : '❌ CHƯA cấu hình'}`)
console.log(`│  DB_HOST          : ${process.env.DB_HOST || 'localhost'}`)
console.log(`│  DB_NAME          : ${process.env.DB_NAME || 'chatboxai'}`)
console.log('└─────────────────────────────────────────────────┘')

if (!isConfigured) {
  console.error('\n⚠️  CẢNH BÁO: GEMINI_API_KEY chưa được thiết lập trong BE/.env')
  console.error('   → Mở file .env và thay "your_gemini_api_key_here" bằng API Key thật.')
  console.error('   → Lấy API Key miễn phí tại: https://aistudio.google.com/app/apikey\n')
}

// ─── Kiểm tra kết nối MySQL khi khởi động ────────────────────────────────────
try {
  const conn = await pool.getConnection()
  await conn.query('SELECT 1')
  conn.release()
  console.log('✅ MySQL đã kết nối thành công.')
} catch (err) {
  console.error('❌ Không kết nối được MySQL:', err.message)
  console.error('   → Kiểm tra lại biến DB_* trong BE/.env và đảm bảo MySQL đang chạy.')
  process.exit(1)
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/chat', chatRouter)
app.use('/api/auth', authRouter)

// Health check
app.get('/api/health', (_req, res) => {
  const key        = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : ''
  const configured = !!(key && key !== 'your_gemini_api_key_here')
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: configured,
  })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint không tồn tại.' })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[Global Error Handler]', err)
  res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' })
})

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ Server đang chạy tại http://localhost:${PORT}`)
  console.log(`   Health check : http://localhost:${PORT}/api/health`)
  console.log(`   Auth API     : POST http://localhost:${PORT}/api/auth/register`)
  console.log(`   Chat API     : POST http://localhost:${PORT}/api/chat\n`)
})
