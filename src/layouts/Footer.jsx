import React from 'react'
import { Dumbbell, Facebook, Instagram, Youtube, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="footer" className="bg-ink text-slate-300 py-10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <a href="#hero" className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
            <Dumbbell size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display font-bold text-white">
            FitAI <span className="text-primary-light">Gym</span>
          </span>
        </a>

        <div className="flex items-center gap-2 text-sm">
          <Phone size={15} className="text-primary-light" /> Hotline: 1900 6868
        </div>

        <div className="flex items-center gap-3">
          {[Facebook, Instagram, Youtube].map((Icon, i) => (
            <a key={i} href="#" className="w-9 h-9 grid place-items-center rounded-full bg-white/5 hover:bg-primary transition-colors">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} FitAI Gym. Tất cả các quyền được bảo lưu.
      </p>
    </footer>
  )
}
