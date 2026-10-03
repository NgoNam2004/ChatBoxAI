import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Crown } from 'lucide-react'
import { useChat } from '../../../context/ChatContext.jsx'
import Button from '../../../components/Button.jsx'
import Slideshow from './Slideshow.jsx'

// 3–4 slide showcase for the gym. Only image + headline/subheadline change
// per slide; CTAs stay fixed underneath for a calmer, cleaner hero.
const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80',
    headline: 'Tập gym thông minh với AI Coach cá nhân',
    subheadline: 'Nhận Workout Plan & Nutrition Plan cá nhân hóa, chỉ từ 299k/tháng.',
  },
  {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80',
    headline: 'Theo dõi tiến độ real-time cùng AI',
    subheadline: 'Mỗi buổi tập được log và phân tích để AI điều chỉnh lộ trình phù hợp.',
  },
  {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
    headline: 'Không gian hiện đại, mở cửa 24/7',
    subheadline: 'Tập luyện bất cứ khi nào bạn muốn, thoải mái mọi khung giờ.',
  },
]

export default function Hero() {
  const { openChat } = useChat()

  return (
    <section id="hero" className="relative h-[560px] lg:h-[620px] overflow-hidden">
      <Slideshow slides={SLIDES}>
        {({ slide, index }) => (
          <div className="relative h-full max-w-7xl mx-auto px-5 lg:px-8 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl"
              >
                <h1 className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  {slide.headline}
                </h1>
                <p className="mt-4 text-slate-200 text-base lg:text-lg max-w-lg">{slide.subheadline}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button onClick={openChat} variant="accent">
                <MessageCircle size={18} /> Mở AI Chat ngay
              </Button>
              <Button as="a" href="#membership" variant="ghost">
                <Crown size={18} /> Xem gói Premium
              </Button>
            </div>
          </div>
        )}
      </Slideshow>
    </section>
  )
}
