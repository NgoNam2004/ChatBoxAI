/**
 * authService.js
 * Gọi API auth của backend và lưu phiên đăng nhập vào localStorage.
 * Đọc URL backend từ VITE_API_URL (không hardcode localhost).
 */

const API_URL  = import.meta.env.VITE_API_URL   // e.g. http://localhost:3001/api
const TOKEN_KEY = 'chatboxai_token'
const USER_KEY  = 'chatboxai_user'

// ── HTTP helpers ──────────────────────────────────────────────────────────────

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
  } catch {
    const err = new Error('Không kết nối được máy chủ. Vui lòng thử lại sau.')
    err.details = []
    throw err
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.message || 'Có lỗi xảy ra, vui lòng thử lại.')
    err.status  = res.status
    err.details = Array.isArray(data.errors) ? data.errors.map((e) => e.message) : []
    throw err
  }
  return data
}

function authHeader() {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── Auth API calls ────────────────────────────────────────────────────────────

export function register({ full_name, email, password, phone }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ full_name, email, password, phone }),
  })
}

export function login({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

/**
 * Lấy thông tin user hiện tại (dùng để khôi phục phiên khi tải trang).
 * @param {string} [token] - Nếu không truyền, lấy từ localStorage.
 */
export function getMe(token) {
  const tok = token || getStoredToken()
  return request('/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${tok}` },
  })
}

// ── Session helpers ───────────────────────────────────────────────────────────

export function saveSession(token, user) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    // localStorage bị chặn (chế độ riêng tư) — bỏ qua
  }
}

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function getStoredUser() {
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

// ── Authenticated fetch wrapper ───────────────────────────────────────────────
// Dùng cho mọi request cần đăng nhập.
export function authRequest(path, options = {}) {
  return request(path, { ...options, headers: { ...authHeader(), ...options.headers } })
}