import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Minh Anh',
    role: 'Hội viên Premium, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    text: 'AI Coach hiểu đúng mục tiêu giảm mỡ của mình, plan tập rất sát và dễ theo. Sau 2 tháng mình đã giảm 4kg.',
  },
  {
    name: 'Quốc Huy',
    role: 'Hội viên Basic, Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    text: 'Phòng tập mở 24/7 rất tiện vì mình hay tập khuya sau giờ làm. Không gian sạch sẽ, máy móc hiện đại.',
  },
  {
    name: 'Thu Trang',
    role: 'Hội viên Premium, Đà Nẵng',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    text: 'Thích nhất là Nutrition Plan, AI tính calo rất chi tiết và điều chỉnh mỗi tuần theo cân nặng thực tế.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-primary font-semibold text-sm mb-2">Hội viên nói gì</p>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink dark:text-white">
            Hàng ngàn hội viên đã thay đổi cùng FitAI
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6"
            >
              <div className="flex gap-1 text-amber-400 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">“{r.text}”</p>
              <div className="flex items-center gap-3 mt-5">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-ink dark:text-white">{r.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
