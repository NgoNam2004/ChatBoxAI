/**
 * routes/auth.js — Đăng ký / Đăng nhập / Me
 * Database: MySQL (mysql2/promise pool)
 */
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import rateLimit from 'express-rate-limit'
import { pool } from '../config/db.js'
import { authRequired } from '../middleware/authRequired.js'

// Thiếu JWT_SECRET thì dừng ngay khi khởi động
if (!process.env.JWT_SECRET) {
  throw new Error('Thiếu JWT_SECRET trong file .env')
}

const router = express.Router()
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12

// ─── Rate limiter cho login/register ──────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.' },
  skip: () => process.env.NODE_ENV === 'test',
})

// Hash giả để timing attack không tiết lộ email có tồn tại hay không
const DUMMY_HASH = bcrypt.hashSync('dummy-placeholder-password', BCRYPT_ROUNDS)

// ─── Validation schemas ───────────────────────────────────────────────────────
const registerSchema = Joi.object({
  full_name: Joi.string()
    .replace(/\s+/g, ' ')
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'any.required': 'Vui lòng nhập họ tên.',
      'string.empty': 'Vui lòng nhập họ tên.',
      'string.min': 'Họ tên tối thiểu 2 ký tự.',
      'string.max': 'Họ tên tối đa 100 ký tự.',
    }),

  email: Joi.string().trim().lowercase().email().max(254).required().messages({
    'any.required': 'Vui lòng nhập email.',
    'string.empty': 'Vui lòng nhập email.',
    'string.email': 'Email không hợp lệ.',
    'string.max': 'Email quá dài.',
  }),

  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .required()
    .messages({
      'any.required': 'Vui lòng nhập mật khẩu.',
      'string.empty': 'Vui lòng nhập mật khẩu.',
      'string.min': 'Mật khẩu tối thiểu 8 ký tự.',
      'string.max': 'Mật khẩu tối đa 64 ký tự.',
      'string.pattern.base': 'Mật khẩu phải có ít nhất 1 chữ cái và 1 chữ số.',
    }),

  phone: Joi.string().trim().max(20).allow('', null).optional(),
})

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().max(254).required().messages({
    'any.required': 'Vui lòng nhập email.',
    'string.empty': 'Vui lòng nhập email.',
    'string.email': 'Email không hợp lệ.',
  }),
  password: Joi.string().max(64).required().messages({
    'any.required': 'Vui lòng nhập mật khẩu.',
    'string.empty': 'Vui lòng nhập mật khẩu.',
    'string.max': 'Mật khẩu quá dài.',
  }),
})

// Helper validate
function validate(schema, body) {
  const { error, value } = schema.validate(body ?? {}, { abortEarly: false, stripUnknown: true })
  if (!error) return { value }
  return {
    errRes: {
      message: 'Dữ liệu không hợp lệ.',
      errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message })),
    },
  }
}

// Helper tạo JWT (payload chỉ gồm id và role)
function signToken(user) {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn })
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', authLimiter, async (req, res) => {
  const { value, errRes } = validate(registerSchema, req.body)
  if (errRes) return res.status(400).json(errRes)

  const { full_name, email, password, phone } = value

  try {
    // Kiểm tra email trùng
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
    if (rows.length > 0) {
      return res.status(409).json({ message: 'Email đã được sử dụng.' })
    }

    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS)

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
      [full_name, email, phone || null, password_hash],
    )

    const userId = result.insertId
    const user   = { id: userId, full_name, email, role: 'user' }
    const token  = signToken(user)

    return res.status(201).json({
      message: 'Đăng ký thành công.',
      data: { token, user },
    })
  } catch (err) {
    console.error('[POST /register]', err)
    return res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' })
  }
})

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  const { value, errRes } = validate(loginSchema, req.body)
  if (errRes) return res.status(400).json(errRes)

  const { email, password } = value

  try {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? LIMIT 1',
      [email],
    )
    const user = rows[0]

    // So sánh với hash giả nếu không tìm thấy user (chống timing attack)
    const isMatch = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH)

    if (!user || !isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' })
    }

    const token = signToken(user)

    return res.json({
      message: 'Đăng nhập thành công.',
      data: {
        token,
        user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
      },
    })
  } catch (err) {
    console.error('[POST /login]', err)
    return res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' })
  }
})

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id],
    )
    if (!rows.length) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' })
    }
    return res.json({ data: { user: rows[0] } })
  } catch (err) {
    console.error('[GET /me]', err)
    return res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' })
  }
})

export default router