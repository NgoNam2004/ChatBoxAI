import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken' // MỚI
import Joi from 'joi'
import User from '../models/User.js'

// MỚI: thiếu JWT_SECRET thì dừng ngay khi khởi động, không để server chạy thiếu an toàn
if (!process.env.JWT_SECRET) {
  throw new Error('Thiếu JWT_SECRET trong file .env')
}

const router = express.Router()
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12

// MỚI: hash giả, dùng khi email không tồn tại để thời gian phản hồi luôn như nhau
const DUMMY_HASH = bcrypt.hashSync('dummy-password-123', BCRYPT_ROUNDS)

// ─── Luật kiểm tra dữ liệu ────────────────────────────────────────────────────
const registerSchema = Joi.object({
  name: Joi.string()
    .replace(/\s+/g, ' ')
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[\p{L}\s'.-]+$/u)
    .required()
    .messages({
      'any.required': 'Vui lòng nhập họ tên.',
      'string.empty': 'Vui lòng nhập họ tên.',
      'string.min': 'Họ tên tối thiểu 2 ký tự.',
      'string.max': 'Họ tên tối đa 50 ký tự.',
      'string.pattern.base': 'Họ tên chỉ gồm chữ cái, khoảng trắng và các ký tự . \' -',
    }),

  email: Joi.string().trim().lowercase().email().max(254).required().messages({
    'any.required': 'Vui lòng nhập email.',
    'string.empty': 'Vui lòng nhập email.',
    'string.email': 'Email không hợp lệ.',
    'string.max': 'Email quá dài.',
  }),

  // Ít nhất 8 ký tự, có chữ và số
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
})

// MỚI: đăng nhập chỉ kiểm tra dạng dữ liệu, KHÔNG áp luật "mật khẩu mạnh"
const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().max(254).required().messages({
    'any.required': 'Vui lòng nhập email.',
    'string.empty': 'Vui lòng nhập email.',
    'string.email': 'Email không hợp lệ.',
    'string.max': 'Email quá dài.',
  }),
  password: Joi.string().max(64).required().messages({
    'any.required': 'Vui lòng nhập mật khẩu.',
    'string.empty': 'Vui lòng nhập mật khẩu.',
    'string.max': 'Mật khẩu quá dài.',
  }),
})

// Chạy schema, trả về { value } hoặc { response } nếu lỗi
function check(schema, body) {
  const { error, value } = schema.validate(body ?? {}, { abortEarly: false, stripUnknown: true })
  if (!error) return { value }
  return {
    response: {
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Dữ liệu không hợp lệ.',
      errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message })),
    },
  }
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { value, response } = check(registerSchema, req.body)
  if (response) return res.status(400).json(response)

  const { name, email, password } = value

  try {
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    const user = await User.create({ name, email, password: hash })

    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công.',
      data: { user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt } },
    })
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, code: 'EMAIL_EXISTS', message: 'Email đã được sử dụng.' })
    }
    throw err
  }
})

// ─── MỚI: POST /api/auth/login ───────────────────────────────────────────────
router.post('/login', async (req, res) => {
  // 1. Kiểm tra dữ liệu
  const { value, response } = check(loginSchema, req.body)
  if (response) return res.status(400).json(response)

  const { email, password } = value

  // 2. Tìm user theo email, lấy kèm hash (vì password đang select: false)
  const user = await User.findOne({ email }).select('+password')

  // 3. So sánh mật khẩu. Không có user vẫn so với hash giả, để người ngoài
  //    không đoán được email nào đã tồn tại qua thời gian phản hồi.
  const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH)

  // Sai email hay sai mật khẩu đều trả CÙNG một thông báo
  if (!user || !isMatch) {
    return res.status(401).json({
      success: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Email hoặc mật khẩu không đúng.',
    })
  }

  // 4. Tạo JWT
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn })

  // 5. Trả về token + thông tin người dùng (không có password)
  return res.json({
    success: true,
    message: 'Đăng nhập thành công.',
    data: {
      token,
      tokenType: 'Bearer',
      expiresIn,
      user: { id: user._id, name: user.name, email: user.email },
    },
  })
})

export default router