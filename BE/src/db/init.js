/**
 * DB init script — đọc schema.sql và chạy trên MySQL.
 * Dùng: npm run db:init
 *
 * Không chạy CREATE DATABASE / USE vì Aiven (avnadmin) không có quyền đó.
 * Database được chọn qua DB_NAME trong pool config (biến DB_NAME trong .env).
 */
import 'dotenv/config'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { pool } from '../config/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const schemaPath = path.join(__dirname, 'schema.sql')

/**
 * Tách file SQL thành danh sách câu lệnh thực thi:
 * 1. Xóa toàn bộ dòng comment (-- ...)
 * 2. Split theo dấu ;
 * 3. Trim và bỏ câu rỗng
 */
function parseStatements(sql) {
  return sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

async function init() {
  console.log('🚀 ChatBoxAI — Khởi tạo cơ sở dữ liệu MySQL...')
  let conn
  try {
    conn = await pool.getConnection()
    console.log(`✅ Kết nối MySQL thành công tới ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`)
    console.log(`   Database: ${process.env.DB_NAME || 'chatboxai'} | SSL: ${process.env.DB_SSL === 'true' ? 'bật' : 'tắt'}`)

    const sql        = readFileSync(schemaPath, 'utf-8')
    const statements = parseStatements(sql)

    console.log(`   Số câu lệnh SQL: ${statements.length}`)

    for (const stmt of statements) {
      await conn.query(stmt)
    }

    console.log('\n✅ Tạo/kiểm tra schema thành công.')

    // Liệt kê bảng đã tồn tại
    const [tables] = await conn.query('SHOW TABLES')
    const tableNames = tables.map((row) => Object.values(row)[0])
    if (tableNames.length > 0) {
      console.log(`   Bảng hiện có (${tableNames.length}): ${tableNames.join(', ')}`)
    } else {
      console.log('   (Chưa có bảng nào — kiểm tra lại schema.sql)')
    }
  } catch (err) {
    console.error('\n❌ Khởi tạo database thất bại:', err.message)
    console.error('   Kiểm tra lại biến DB_* trong BE/.env và đảm bảo MySQL đang chạy.')
    process.exit(1)
  } finally {
    if (conn) conn.release()
    await pool.end()
  }
}

init()
