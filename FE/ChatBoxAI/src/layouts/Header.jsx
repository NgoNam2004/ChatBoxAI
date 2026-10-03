import React, { useState } from 'react'
// Note: Header lives in layouts/ (not features/) because it is shared,
// route-independent chrome — same reasoning as Footer.jsx alongside it.
import { Menu, X, Dumbbell } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Trang chủ', href: '#hero' },
  { label: 'Gói tập', href: '#membership' },
  { label: 'AI Coach', href: '#ai-coach' },
  { label: 'Liên hệ', href: '#footer' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

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
          <a href="#login" className="text-sm font-semibold text-ink dark:text-white hover:text-primary px-3 py-2">
            Đăng nhập
          </a>
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
          <div className="flex items-center gap-3 mt-4">
            <a href="#login" className="flex-1 text-center text-sm font-semibold text-ink dark:text-white py-2.5 border border-slate-200 dark:border-slate-700 rounded-full">
              Đăng nhập
            </a>
          </div>
          <a
            href="#membership"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center text-sm font-semibold bg-accent hover:bg-accent-dark text-white px-4 py-3 rounded-full"
          >
            Tham gia ngay
          </a>
        </div>
      )}
    </header>
  )
}
