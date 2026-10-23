/**
 * middleware/authRequired.js
 * Verify JWT Bearer token, gắn req.user = { id, role }
 */
import jwt from 'jsonwebtoken'

export function authRequired(req, res, next) {
  const header = req.headers['authorization'] || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Yêu cầu đăng nhập.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.id, role: payload.role }
    next()
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' })
  }
}
