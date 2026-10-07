import React, { useState } from 'react'
// Note: Header lives in layouts/ (not features/) because it is shared,
// route-independent chrome — same reasoning as Footer.jsx alongside it.
import { Menu, X, Dumbbell, ChevronDown, User, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { notifySuccess } from '../utils/notify.jsx'

const NAV_LINKS = [
  { label: 'Trang chủ', href: '#hero' },
  { label: 'Gói tập', href: '#membership' },
  { label: 'AI Coach', href: '#ai-coach' },
  { label: 'Liên hệ', href: '#footer' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // Chữ cái đầu của tên, hiện trong vòng tròn
  const initial = user?.name?.trim().charAt(0).toUpperCase() || '?'

  const handleLogout = () => {
    signOut()
    setOpen(false)
    notifySuccess('Đã đăng xuất.')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-ink/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 shrink-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
            <Dumbbell size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display font-bold text-lg lg:text-xl text-ink dark:text-white">
            FitAI <span className="text-primary">Gym</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            // Đã đăng nhập: rê chuột (hoặc Tab) vào tên thì hiện menu thả xuống
            <div className="relative group">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-semibold text-ink dark:text-white hover:text-primary px-2 py-1.5"
              >
                <span className="grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white text-sm font-bold">
                  {initial}
                </span>
                <span className="max-w-[140px] truncate">{user.name}</span>
                <ChevronDown
                  size={16}
                  className="transition-transform duration-150 group-hover:rotate-180 group-focus-within:rotate-180"
                />
              </Link>

              {/* pt-2 lấp khoảng hở giữa tên và menu để chuột đi xuống không bị mất hover */}
              <div className="absolute right-0 top-full pt-2 w-48 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-all duration-150">
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1.5">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-ink dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <User size={16} />
                    Hồ sơ
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-ink dark:text-white hover:text-primary px-3 py-2">
              Đăng nhập
            </Link>
          )}
          <a
            href="#membership"
            className="text-sm font-semibold bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-full shadow-sm shadow-orange-300/40 transition-colors"
          >
            Tham gia ngay
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-ink dark:text-white" onClick={() => setOpen((o) => !o)} aria-label="Mở menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white dark:bg-ink border-t border-slate-100 dark:border-slate-800 px-5 pb-6 pt-2">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary border-b border-slate-50 dark:border-slate-800"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-3 mt-4">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-ink dark:text-white py-2.5 border border-slate-200 dark:border-slate-700 rounded-full"
              >
                <span className="grid place-items-center w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold">
                  {initial}
                </span>
                <span className="max-w-[110px] truncate">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 text-center text-sm font-semibold text-ink dark:text-white py-2.5 border border-slate-200 dark:border-slate-700 rounded-full"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mt-4">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center text-sm font-semibold text-ink dark:text-white py-2.5 border border-slate-200 dark:border-slate-700 rounded-full"
                >
                  Đăng nhập
                </Link>
              </div>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="mt-3 block text-center text-sm font-semibold bg-accent hover:bg-accent-dark text-white px-4 py-3 rounded-full"
              >
                Tham gia ngay
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}