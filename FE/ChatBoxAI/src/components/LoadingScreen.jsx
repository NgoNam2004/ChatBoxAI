import React from 'react'
import { motion } from 'framer-motion'
import { Dumbbell } from 'lucide-react'
import LoadingPage from './Loading.jsx'

// Màn hình loading toàn trang. Phủ kín màn hình, nằm trên mọi thứ (kể cả popup).
export default function LoadingScreen({ message = 'Đang tải...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-white dark:bg-ink"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
          <Dumbbell size={22} strokeWidth={2.5} />
        </span>
        <span className="font-display font-bold text-2xl text-ink dark:text-white">
          FitAI <span className="text-primary">Gym</span>
        </span>
      </div>

      <LoadingPage size={36} />

      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </motion.div>
  )
}