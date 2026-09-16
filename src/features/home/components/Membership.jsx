import React from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, X } from 'lucide-react'

const PLANS = [
  {
    name: 'Free',
    price: '0đ',
    period: 'mãi mãi',
    desc: 'Trải nghiệm không gian tập và AI Chatbot chung.',
    highlight: false,
    features: [
      { text: 'AI Chatbot chung (hỏi đáp cơ bản)', ok: true },
      { text: 'Tham gia 2 lớp nhóm/tháng', ok: true },
      { text: 'Theo dõi tiến độ cơ bản', ok: true },
      { text: 'Workout Plan cá nhân hóa từ AI Coach', ok: false },
      { text: 'Nutrition Plan cá nhân hóa', ok: false },
    ],
    cta: 'Bắt đầu miễn phí',
  },
  {
    name: 'Basic',
    price: '299k',
    period: '/tháng',
    desc: 'Tập không giới hạn tại mọi chi nhánh, mọi khung giờ.',
    highlight: false,
    features: [
      { text: 'Tập không giới hạn, 24/7', ok: true },
      { text: 'Lớp nhóm không giới hạn', ok: true },
      { text: 'AI Chatbot chung + gợi ý bài tập', ok: true },
      { text: 'Workout Plan cá nhân hóa từ AI Coach', ok: false },
      { text: 'Nutrition Plan cá nhân hóa', ok: false },
    ],
    cta: 'Chọn gói Basic',
  },
  {
    name: 'Premium',
    price: '499k',
    period: '/tháng',
    desc: 'Toàn quyền với AI Coach cá nhân — huấn luyện viên số riêng của bạn.',
    highlight: true,
    features: [
      { text: 'Tất cả quyền lợi của gói Basic', ok: true },
      { text: 'AI Coach cá nhân: hiểu mục tiêu, thể trạng riêng', ok: true },
      { text: 'Workout Plan cập nhật theo tiến độ mỗi tuần', ok: true },
      { text: 'Nutrition Plan cá nhân hóa theo calo & mục tiêu', ok: true },
      { text: 'Báo cáo tiến độ & nhắc lịch thông minh', ok: true },
    ],
    cta: 'Nâng cấp Premium',
  },
]

export default function Membership() {
  return (
    <section id="membership" className="py-16 lg:py-20 bg-slate-50 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-primary font-semibold text-sm mb-2">Gói tập</p>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink dark:text-white">
            Chọn mức đồng hành phù hợp với bạn
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Từ trải nghiệm miễn phí đến huấn luyện viên AI riêng, luôn có một gói dành cho mục tiêu của bạn.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-ink text-white border-2 border-accent shadow-lg'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                  <Sparkles size={12} /> Phổ biến nhất
                </span>
              )}

              <h3 className={`font-display font-bold text-xl ${plan.highlight ? 'text-white' : 'text-ink dark:text-white'}`}>
                {plan.name}
              </h3>
              <p className={`mt-1 text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                {plan.desc}
              </p>

              <div className="mt-6 flex items-end gap-1">
                <span className="font-display font-bold text-4xl">{plan.price}</span>
                <span className={`text-sm mb-1 ${plan.highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="mt-7 space-y-3.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    {f.ok ? (
                      <Check size={17} className={plan.highlight ? 'text-primary-light shrink-0 mt-0.5' : 'text-primary shrink-0 mt-0.5'} />
                    ) : (
                      <X size={17} className="text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className={f.ok ? (plan.highlight ? 'text-slate-100' : 'text-slate-700 dark:text-slate-300') : 'text-slate-400 dark:text-slate-600'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#login"
                className={`mt-8 text-center font-semibold px-5 py-3 rounded-full transition-colors ${
                  plan.highlight
                    ? 'bg-accent hover:bg-accent-dark text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-ink dark:text-white hover:bg-primary hover:text-white'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
