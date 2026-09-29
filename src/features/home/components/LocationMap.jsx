import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Mail } from 'lucide-react'

const INFO_ITEMS = [
  {
    icon: MapPin,
    label: 'Địa chỉ',
    value: '227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP. Hồ Chí Minh',
  },
  {
    icon: Phone,
    label: 'Điện thoại',
    value: '1900 6868',
  },
  {
    icon: Clock,
    label: 'Giờ mở cửa',
    value: 'Thứ 2 – Chủ Nhật: 5:00 – 23:00',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@fitai.vn',
  },
]

export default function LocationMap() {
  return (
    <section id="location" className="py-16 lg:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-primary font-semibold text-sm mb-2">Tìm chúng tôi</p>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink dark:text-white">
            Phòng gym của bạn ở ngay đây
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Ghé thăm chúng tôi tại TP. Hồ Chí Minh — thuận tiện di chuyển, không gian hiện đại, mở cửa xuyên suốt 7 ngày.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          {/* Map iframe */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg min-h-[360px]"
          >
            <iframe
              id="google-map-embed"
              title="Vị trí phòng gym FitAI tại TP. Hồ Chí Minh"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.628738803131!2d106.67614097461754!3d10.755523989391516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3b3b3b%3A0x3d5b5b5b5b5b5b5b!2s227%20Nguy%E1%BB%85n%20V%C4%83n%20C%E1%BB%AB%2C%20Ph%C6%B0%E1%BB%9Dng%204%2C%20Qu%E1%BA%ADn%205%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1svi!2svn!4v1695000000000!5m2!1svi!2svn"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '360px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {INFO_ITEMS.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-primary/40 dark:hover:border-primary/40 transition-colors group"
                >
                  <span className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                    <Icon size={20} className="text-primary" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-ink dark:text-slate-200 leading-snug">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              )
            })}

            {/* CTA to open Google Maps */}
            <a
              href="https://maps.google.com/?q=227+Nguyễn+Văn+Cừ,+Phường+4,+Quận+5,+TP.+Hồ+Chí+Minh"
              target="_blank"
              rel="noopener noreferrer"
              id="open-maps-btn"
              className="mt-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold transition-colors shadow-lg shadow-primary/20"
            >
              <MapPin size={18} />
              Mở Google Maps
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
