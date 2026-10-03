import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, MessageCircle } from 'lucide-react'
import { useChat } from '../../../context/ChatContext.jsx'
import Button from '../../../components/Button.jsx'

export default function FinalCTA() {
  const { openChat } = useChat()

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-primary px-8 py-14 lg:px-16 lg:py-20 text-center"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/25 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              <Sparkles size={12} /> Dùng thử miễn phí, không cần thẻ
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-5xl text-white leading-tight max-w-2xl mx-auto">
              Sẵn sàng bắt đầu hành trình thông minh?
            </h2>
            <p className="mt-4 text-slate-200 max-w-lg mx-auto">
              Trải nghiệm AI Coach cá nhân miễn phí trong 7 ngày, không ràng buộc.
            </p>
            <Button onClick={openChat} variant="accent" className="mt-8">
              <MessageCircle size={18} /> Dùng thử AI Coach miễn phí
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
