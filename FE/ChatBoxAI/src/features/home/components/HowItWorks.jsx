import React from 'react'
import { motion } from 'framer-motion'
import { UserPlus, MessagesSquare, Dumbbell, BarChart3 } from 'lucide-react'

const STEPS = [
  { icon: <UserPlus size={20} />, title: 'Đăng ký tài khoản', text: 'Tạo tài khoản FitAI chỉ trong 1 phút.' },
  { icon: <MessagesSquare size={20} />, title: 'Chat với AI để nhận plan', text: 'AI Coach dựng lộ trình riêng cho bạn.' },
  { icon: <Dumbbell size={20} />, title: 'Tập và log buổi tập', text: 'Tập theo plan và log lại tiến độ.' },
  { icon: <BarChart3 size={20} />, title: 'AI phân tích & điều chỉnh', text: 'Kế hoạch được tinh chỉnh mỗi tuần.' },
]

export default function HowItWorks() {
  return (
    <section className="py-16 lg:py-20 bg-slate-50 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-primary font-semibold text-sm mb-2">Cách hoạt động</p>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink dark:text-white">
            Bắt đầu hành trình chỉ với 4 bước
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-11 h-11 grid place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                  {s.icon}
                </span>
                <span className="font-display font-bold text-2xl text-slate-200 dark:text-slate-700">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display font-semibold text-ink dark:text-white">{s.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
