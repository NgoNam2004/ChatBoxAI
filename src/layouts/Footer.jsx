import React from 'react'
import { Dumbbell, Facebook, Instagram, Youtube, Phone, MapPin, Clock, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="footer" className="bg-ink text-slate-300">
      {/* ── Top area: links + map ── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-14 pb-10">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left col: brand + contact info */}
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-2 w-fit">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                <Dumbbell size={18} strokeWidth={2.5} />
              </span>
              <span className="font-display font-bold text-white text-lg">
                FitAI <span className="text-primary-light">Gym</span>
              </span>
            </a>

            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Phòng gym thế hệ mới — kết hợp thiết bị hiện đại và AI Coach cá nhân để tối ưu mọi buổi tập của bạn.
            </p>

            {/* Contact list */}
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-light shrink-0 mt-0.5" />
                <span>15 Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary-light shrink-0" />
                <span>Hotline: 1900 6868</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-primary-light shrink-0" />
                <span>Thứ 2 – Chủ Nhật: 05:00 – 23:00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary-light shrink-0" />
                <span>contact@fitai.vn</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 grid place-items-center rounded-full bg-white/5 hover:bg-primary transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Right col: Google Maps iframe */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg h-72 lg:h-80">
            <iframe
              id="google-map-embed"
              title="Vị trí FitAI Gym tại Hà Nội"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096980808022!2d105.78159637462483!3d21.028921180618663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5e6e5b2e7b%3A0x4c3b5f7e8d9a1234!2s15%20Ph%E1%BA%A1m%20H%C3%B9ng%2C%20M%E1%BB%B9%20%C4%90%C3%ACnh%2C%20Nam%20T%E1%BB%AB%20Li%C3%AAm%2C%20H%C3%A0%20N%E1%BB%99i!5e0!3m2!1svi!2svn!4v1695000000000!5m2!1svi!2svn"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} FitAI Gym. Tất cả các quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
