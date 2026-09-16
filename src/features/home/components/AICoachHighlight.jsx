import React from 'react'
import { motion } from 'framer-motion'
import { Bot, Target, Salad, RefreshCcw, MessageCircle } from 'lucide-react'
import { useChat } from '../../../context/ChatContext.jsx'

const POINTS = [
  { icon: <Target size={18} />, title: 'Hiểu mục tiêu của bạn', text: 'AI hỏi mục tiêu, kinh nghiệm và lịch trống để hiểu đúng nhu cầu.' },
  { icon: <Bot size={18} />, title: 'Tạo Workout Plan riêng', text: 'Lộ trình tập theo tuần, phù hợp thể trạng và thiết bị.' },
  { icon: <Salad size={18} />, title: 'Nutrition Plan cá nhân hóa', text: 'Thực đơn gợi ý theo lượng calo và mục tiêu của bạn.' },
  { icon: <RefreshCcw size={18} />, title: 'Điều chỉnh liên tục', text: 'AI phân tích buổi tập đã log và tinh chỉnh kế hoạch mỗi tuần.' },
]

export default function AICoachHighlight() {
  const { openChat } = useChat()

  return (
    <section id="ai-coach" className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
        <p className="text-primary font-semibold text-sm mb-2">AI Coach cá nhân</p>
        <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink dark:text-white leading-tight">
          Huấn luyện viên AI thấu hiểu riêng bạn
        </h2>
        <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Không phải một chatbot chung — AI Coach hiểu mục tiêu, thể trạng và lịch tập của bạn để
          xây dựng lộ trình luyện tập và dinh dưỡng thật sự cá nhân hóa.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 mt-10 text-left">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex gap-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-800"
            >
              <span className="shrink-0 w-10 h-10 grid place-items-center rounded-xl bg-primary/10 text-primary">
                {p.icon}
              </span>
              <div>
                <h3 className="font-semibold text-ink dark:text-white text-sm">{p.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{p.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={openChat}
          className="mt-10 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
        >
          <MessageCircle size={18} /> Mở chat với AI Coach
        </button>
      </div>
    </section>
  )
}
