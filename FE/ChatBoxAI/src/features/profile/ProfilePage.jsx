import { useEffect, useRef, useState } from 'react'
import { Pencil, Check, X, Camera } from 'lucide-react'

/* ---------- Dữ liệu mẫu: thay bằng dữ liệu từ API / context đăng nhập khi BE xong ---------- */
const MOCK_USER = {
  name: 'Nguyen Van A',
  email: 'vana@gmail.com',
  phone: '0912345678',
  password: '********',
  avatar: '',
  birthday: '2000-05-20',
  gender: 'male',
  height: 172,
  weight: 65,
  membership: { plan: 'Gói 3 tháng', expiresAt: '2026-12-31' },
}

const GENDERS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
]

/* ---------- Validate ---------- */
const validators = {
  name: (v) => (v.trim().length < 2 ? 'Tên tài khoản tối thiểu 2 ký tự' : ''),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Email không hợp lệ'),
  phone: (v) =>
    /^(0|\+84)\d{9}$/.test(v.trim()) ? '' : 'Số điện thoại gồm 10 số, bắt đầu bằng 0 hoặc +84',
  password: (v) => (v.length < 8 ? 'Mật khẩu mới tối thiểu 8 ký tự' : ''),
  birthday: (v) => {
    if (!v) return 'Vui lòng chọn ngày sinh'
    return new Date(v) > new Date() ? 'Ngày sinh không được ở tương lai' : ''
  },
  gender: (v) => (v ? '' : 'Vui lòng chọn giới tính'),
  height: (v) => {
    const n = Number(v)
    return n >= 100 && n <= 250 ? '' : 'Chiều cao từ 100 đến 250 cm'
  },
  weight: (v) => {
    const n = Number(v)
    return n >= 20 && n <= 300 ? '' : 'Cân nặng từ 20 đến 300 kg'
  },
}

/* ---------- Một ô thông tin có icon bút để chỉnh sửa ---------- */
function Field({ label, name, type = 'text', value, onSave, options, suffix, inputProps = {} }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const id = `field-${name}`
  const isPassword = type === 'password'

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const startEdit = () => {
    setDraft(isPassword ? '' : value) // mật khẩu: bắt nhập mới, không hiện mật khẩu cũ
    setError('')
    setEditing(true)
  }

  const cancel = () => {
    setEditing(false)
    setError('')
  }

  const save = () => {
    const msg = validators[name]?.(String(draft)) ?? ''
    if (msg) {
      setError(msg)
      return
    }
    onSave(name, type === 'number' ? Number(draft) : draft)
    setEditing(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      save()
    }
    if (e.key === 'Escape') cancel()
  }

  const shared = {
    id,
    name,
    ref: inputRef,
    disabled: !editing,
    onKeyDown,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined,
    className:
      'min-w-0 flex-1 bg-transparent py-3 text-white outline-none placeholder:text-slate-500 disabled:cursor-default [color-scheme:dark]',
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-slate-400">
        {label}
      </label>

      <div
        className={`flex items-center gap-1 rounded-xl border px-3 transition-colors ${
          error
            ? 'border-red-400 bg-white/5'
            : editing
              ? 'border-primary-light bg-white/10'
              : 'border-white/10 bg-white/5'
        }`}
      >
        {options ? (
          <select {...shared} value={editing ? draft : value} onChange={(e) => setDraft(e.target.value)}>
            {options.map((o) => (
              <option key={o.value} value={o.value} className="bg-ink">
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...shared}
            type={type}
            value={editing ? draft : value}
            placeholder={isPassword && editing ? 'Nhập mật khẩu mới' : undefined}
            autoComplete={isPassword ? 'new-password' : undefined}
            onChange={(e) => setDraft(e.target.value)}
            {...inputProps}
          />
        )}

        {suffix && <span className="pr-1 text-sm text-slate-400">{suffix}</span>}

        {editing ? (
          <div className="flex shrink-0">
            <button
              type="button"
              onClick={save}
              aria-label={`Lưu ${label}`}
              className="grid h-9 w-9 place-items-center rounded-lg text-emerald-400 hover:bg-white/10"
            >
              <Check size={18} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={cancel}
              aria-label="Hủy chỉnh sửa"
              className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            aria-label={`Chỉnh sửa ${label}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-primary-light"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

/* ---------- Thẻ thành viên (chỉ xem, do hệ thống/quản trị cập nhật) ---------- */
function MembershipCard({ plan, expiresAt }) {
  const daysLeft = Math.ceil((new Date(expiresAt) - new Date()) / 86400000)
  const expired = daysLeft <= 0

  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-gradient-to-br from-primary to-accent p-6 text-white sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-xl font-bold">{plan}</p>
        <p className="mt-1 text-sm text-white/80">
          Hết hạn ngày {new Date(expiresAt).toLocaleDateString('vi-VN')}
        </p>
      </div>
      <p className="font-display text-2xl font-bold">{expired ? 'Đã hết hạn' : `Còn ${daysLeft} ngày`}</p>
    </section>
  )
}

/* ---------- Trang chính ---------- */
export default function ProfilePage() {
  const [user, setUser] = useState(MOCK_USER)
  const [notice, setNotice] = useState(null) // { type: 'success' | 'error', text }
  const fileRef = useRef(null)

  // Tự ẩn thông báo sau 3 giây. Khi toast của Nam xong thì đổi setNotice(...) sang toast.
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 3000)
    return () => clearTimeout(t)
  }, [notice])

  const handleSave = async (name, value) => {
    try {
      // TODO: gọi API khi BE xong, ví dụ: await api.patch('/users/me', { [name]: value })
      setUser((u) => ({ ...u, [name]: name === 'password' ? '********' : value }))
      setNotice({ type: 'success', text: 'Đã lưu thay đổi' })
    } catch {
      setNotice({ type: 'error', text: 'Không thể lưu, vui lòng thử lại' })
    }
  }

  const handleAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setNotice({ type: 'error', text: 'Vui lòng chọn một file ảnh' })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setNotice({ type: 'error', text: 'Ảnh tối đa 2MB' })
      return
    }
    // TODO: upload file lên BE, nhận URL rồi lưu vào user.avatar
    setUser((u) => ({ ...u, avatar: URL.createObjectURL(file) }))
    setNotice({ type: 'success', text: 'Đã cập nhật ảnh đại diện' })
  }

  return (
    <main className="min-h-screen bg-ink px-5 py-10 text-slate-300">
      {notice && (
        <div
          role="status"
          className={`fixed right-5 top-5 z-50 max-w-xs rounded-xl px-4 py-3 text-sm text-white shadow-lg ${
            notice.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Đổi ảnh đại diện"
            className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-4xl font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
          >
            {user.avatar ? (
              <img src={user.avatar} alt="Ảnh đại diện" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display">{user.name.trim().charAt(0).toUpperCase()}</span>
            )}
            <span className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Camera size={22} />
            </span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />

          <div>
            <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
            <p className="mt-1 text-slate-400">{user.email}</p>
          </div>
        </header>

        <MembershipCard {...user.membership} />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 font-display text-lg font-bold text-white">Tài khoản</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Tên tài khoản" name="name" value={user.name} onSave={handleSave} />
            <Field label="Email" name="email" type="email" value={user.email} onSave={handleSave} />
            <Field
              label="Số điện thoại"
              name="phone"
              type="tel"
              value={user.phone}
              onSave={handleSave}
              inputProps={{ inputMode: 'tel' }}
            />
            <Field label="Mật khẩu" name="password" type="password" value={user.password} onSave={handleSave} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 font-display text-lg font-bold text-white">Thông tin cá nhân</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Ngày sinh"
              name="birthday"
              type="date"
              value={user.birthday}
              onSave={handleSave}
              inputProps={{ max: new Date().toISOString().slice(0, 10) }}
            />
            <Field label="Giới tính" name="gender" value={user.gender} options={GENDERS} onSave={handleSave} />
            <Field
              label="Chiều cao"
              name="height"
              type="number"
              value={user.height}
              suffix="cm"
              onSave={handleSave}
              inputProps={{ min: 100, max: 250, step: 1 }}
            />
            <Field
              label="Cân nặng"
              name="weight"
              type="number"
              value={user.weight}
              suffix="kg"
              onSave={handleSave}
              inputProps={{ min: 20, max: 300, step: 0.1 }}
            />
          </div>
        </section>
      </div>
    </main>
  )
}