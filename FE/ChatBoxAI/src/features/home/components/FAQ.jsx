import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'AI Coach khác gì so với AI Chatbot của gói Free?',
    a: 'AI Chatbot ở gói Free trả lời câu hỏi chung. AI Coach ở gói Premium hiểu mục tiêu, thể trạng riêng để dựng Workout Plan và Nutrition Plan cá nhân hóa, và điều chỉnh theo tiến độ thực tế.',
  },
  {
    q: 'Tôi có thể đổi gói tập bất cứ lúc nào không?',
    a: 'Có. Bạn có thể nâng cấp hoặc hạ cấp gói tập bất cứ lúc nào, thay đổi có hiệu lực từ kỳ thanh toán tiếp theo.',
  },
  {
    q: 'FitAI hỗ trợ những hình thức thanh toán nào?',
    a: 'FitAI hỗ trợ thẻ ngân hàng, ví điện tử (Momo, ZaloPay) và chuyển khoản.',
  },
  {
    q: 'Tôi mới bắt đầu tập gym, FitAI có phù hợp không?',
    a: 'Hoàn toàn phù hợp. AI Coach sẽ hỏi về kinh nghiệm của bạn và xây dựng lộ trình phù hợp cho người mới bắt đầu.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="py-16 lg:py-20 bg-slate-50 dark:bg-slate-950/40">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-primary font-semibold text-sm mb-2">Câu hỏi thường gặp</p>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink dark:text-white">Bạn còn thắc mắc gì?</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={item.q} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-sm lg:text-base text-ink dark:text-white">{item.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
