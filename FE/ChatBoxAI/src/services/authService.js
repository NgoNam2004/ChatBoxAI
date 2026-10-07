// Gọi API auth của backend và lưu phiên đăng nhập (token + user) vào localStorage.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const TOKEN_KEY = 'fitai_token'
const USER_KEY = 'fitai_user'

// Gửi POST JSON. Lỗi ném ra có `message` và `details` (danh sách lỗi từng field từ BE).
async function post(path, body) {
  let res
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    const err = new Error('Không kết nối được máy chủ. Vui lòng thử lại sau.')
    err.details = []
    throw err
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.message || 'Có lỗi xảy ra, vui lòng thử lại.')
    err.details = Array.isArray(data.errors) ? data.errors.map((e) => e.message) : []
    throw err
  }
  return data
}

export function register({ name, email, password }) {
  return post('/auth/register', { name, email, password })
}

export function login({ email, password }) {
  return post('/auth/login', { email, password })
}

// ── Lưu / đọc / xóa phiên đăng nhập ──
export function saveSession(token, user) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    // localStorage bị chặn (chế độ riêng tư...) thì bỏ qua
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    // bỏ qua
  }
}