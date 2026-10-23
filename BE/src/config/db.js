/**
 * MySQL connection pool (mysql2/promise)
 * Đọc cấu hình từ biến môi trường .env
 *
 * SSL (Aiven / MySQL cloud):
 *   DB_SSL=true  →  bật SSL
 *   CA certificate (theo thứ tự ưu tiên):
 *     1. Biến môi trường DB_CA_CERT  (nội dung PEM, \n thay bằng newline thật)
 *     2. File BE/certs/ca.pem
 */
import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

/**
 * Đọc CA certificate cho SSL.
 * Trả về nội dung PEM (string) hoặc undefined nếu không tìm thấy.
 */
function loadCaCert() {
  // Ưu tiên 1: biến môi trường (dùng cho hosting/CI, \n được escape thành \\n)
  if (process.env.DB_CA_CERT) {
    return process.env.DB_CA_CERT.replace(/\\n/g, '\n')
  }
  // Ưu tiên 2: file BE/certs/ca.pem
  const certPath = path.join(__dirname, '..', '..', 'certs', 'ca.pem')
  try {
    return readFileSync(certPath, 'utf-8')
  } catch {
    return undefined
  }
}

const sslEnabled = process.env.DB_SSL === 'true'

function buildSslConfig() {
  if (!sslEnabled) return {}
  const ca = loadCaCert()
  return {
    ssl: {
      rejectUnauthorized: true,
      ...(ca ? { ca } : {}),
    },
  }
}

export const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  port:             Number(process.env.DB_PORT) || 3306,
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',
  database:         process.env.DB_NAME     || 'chatboxai',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
  timezone:         '+07:00',
  charset:          'utf8mb4',
  ...buildSslConfig(),
})
