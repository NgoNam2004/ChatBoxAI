import React, { useState } from 'react' // MỚI: thêm useState
import { motion } from 'framer-motion'
import { Check, X, Dumbbell, CalendarDays, Home } from 'lucide-react'
import PlanModal from './PlanModal.jsx' // MỚI

const PLANS = [
  {
    id: 'monthly',
    name: 'Gói Tháng',
    icon: Dumbbell,
    price: '350.000đ',
    period: '/tháng',
    highlight: false,
    desc: 'Tập luyện linh hoạt tại phòng gym với đầy đủ thiết bị hiện đại.',
    features: [
      { text: 'Tập tự do toàn bộ thiết bị', ok: true },
      { text: 'Tham gia lớp nhóm (Yoga, Zumba…)', ok: true },
      { text: 'Tủ đồ & phòng tắm tiêu chuẩn', ok: true },
      { text: 'AI Workout gợi ý bài tập cơ bản', ok: true },
      { text: 'AI Coach cá nhân hóa chuyên sâu', ok: false },
      { text: 'Nutrition Plan cá nhân', ok: false },
    ],
    cta: 'Đăng ký ngay',
  },
  {
    id: 'yearly',
    name: 'Gói Năm',
    icon: CalendarDays,
    price: '2.990.000đ',
    period: '/năm',
    sub: '~249.000đ/tháng',
    highlight: true,
    desc: 'Tiết kiệm hơn 29% — cam kết cả năm, không lo gián đoạn.',
    features: [
      { text: 'Tất cả quyền lợi Gói Tháng', ok: true },
      { text: 'Lớp nhóm không giới hạn', ok: true },
      { text: 'Ưu tiên đặt lịch & khung giờ cao điểm', ok: true },
      { text: 'AI Workout gợi ý bài tập nâng cao', ok: true },
      { text: 'Báo cáo tiến độ hàng tháng', ok: true },
      { text: 'AI Coach cá nhân hóa chuyên sâu', ok: false },
    ],
    cta: 'Đăng ký 1 năm',
  },
  {
    id: 'ai-coach',
    name: 'Gói AI Coach',
    icon: Home,
    price: '199.000đ',
    period: '/tháng',
    highlight: false,
    isHome: true,
    desc: 'Không cần đến phòng gym — AI Coach cá nhân hướng dẫn bạn tập tại nhà mọi lúc.',
    features: [
      { text: 'AI Coach hướng dẫn tập realtime', ok: true },
      { text: 'Kế hoạch tập không cần thiết bị', ok: true },
      { text: 'Nutrition Plan & theo dõi calo', ok: true },
      { text: 'Thư viện 500+ bài tập video HD', ok: true },
      { text: 'Nhắc lịch & động viên từ AI', ok: true },
      { text: 'Apple Health & Google Fit', ok: true },
    ],
    cta: 'Bắt đầu tại nhà',
  },
]

export default function Membership() {
  // MỚI: gói đang được chọn (null = popup đóng)
  const [selectedPlan, setSelectedPlan] = useState(null)

  return (
    <section id="membership" className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-primary font-semibold text-sm mb-2">Gói tập</p>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink dark:text-white">
            Chọn gói phù hợp với lối sống của bạn
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Tập tại gym hoặc tại nhà — đều có AI Coach đồng hành. Đăng ký năm để tiết kiệm hơn.
          </p>
        </div>

        {/* 3-card grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`relative rounded-3xl p-8 flex flex-col overflow-hidden
                  ${plan.highlight
                    ? 'bg-ink text-white border-2 border-accent shadow-xl'
                    : plan.isHome
                    ? 'bg-gradient-to-br from-violet-600/10 via-blue-600/10 to-cyan-500/10 border border-violet-200 dark:border-violet-800/50 bg-white dark:bg-slate-900'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}
                `}
              >
                {/* Violet glow for home plan */}
                {plan.isHome && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-violet-400/20 blur-3xl" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-cyan-400/15 blur-3xl" />
                  </div>
                )}

                {/* Icon + Name */}
                <div className="relative flex items-center gap-3 mb-2">
                  <span className={`p-2 rounded-xl
                    ${plan.highlight ? 'bg-white/10' : plan.isHome ? 'bg-violet-500/15' : 'bg-primary/10'}
                  `}>
                    <Icon size={20} className={
                      plan.highlight ? 'text-accent' :
                      plan.isHome ? 'text-violet-600 dark:text-violet-400' :
                      'text-primary'
                    } />
                  </span>
                  <h3 className={`font-display font-bold text-xl ${plan.highlight ? 'text-white' : 'text-ink dark:text-white'}`}>
                    {plan.name}
                  </h3>
                </div>

                {/* Description */}
                <p className={`relative text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.desc}
                </p>

                {/* Price */}
                <div className="relative mt-6">
                  <div className="flex items-end gap-1">
                    <span className="font-display font-bold text-4xl">{plan.price}</span>
                    <span className={`text-sm mb-1 ${plan.highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      {plan.period}
                    </span>
                  </div>
                  {plan.sub && (
                    <p className="text-xs mt-1 text-emerald-500 font-medium">{plan.sub}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="relative mt-7 space-y-3.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      {f.ok ? (
                        <Check size={17} className={`shrink-0 mt-0.5
                          ${plan.highlight ? 'text-primary-light' :
                            plan.isHome ? 'text-violet-500 dark:text-violet-400' :
                            'text-primary'}
                        `} />
                      ) : (
                        <X size={17} className="text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                      )}
                      <span className={
                        f.ok
                          ? (plan.highlight ? 'text-slate-100' : 'text-slate-700 dark:text-slate-300')
                          : 'text-slate-400 dark:text-slate-600'
                      }>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA — MỚI: đổi từ <a href="#login"> thành <button> mở popup */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  id={`cta-${plan.id}`}
                  className={`relative mt-8 text-center font-semibold px-5 py-3 rounded-full transition-colors
                    ${plan.highlight
                      ? 'bg-accent hover:bg-accent-dark text-white'
                      : plan.isHome
                      ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-ink dark:text-white hover:bg-primary hover:text-white'}
                  `}
                >
                  {plan.cta}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* MỚI: popup đăng ký gói tập */}
      <PlanModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
    </section>
  )
}