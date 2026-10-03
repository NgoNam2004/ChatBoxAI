import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2 } from 'lucide-react'
import Button from '../../../components/Button.jsx'
import FormField from '../../auth/components/FormField.jsx'

// Popup đăng ký cho một gói tập.
// plan = null thì không hiển thị. onClose() được gọi khi người dùng đóng popup.
export default function PlanModal({ plan, onClose }) {
  const [submitted, setSubmitted] = useState(false)

  // Mỗi lần mở gói mới thì quay về màn form.
  useEffect(() => {
    setSubmitted(false)
  }, [plan])

  // Phím Esc để đóng + khóa cuộn nền khi popup đang mở.
  useEffect(() => {
    if (!plan) return
    const onKeyDown = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [plan, onClose])

  // MVP: chưa gửi dữ liệu đi đâu. Khi có API, gọi hàm gửi ở đây rồi mới setSubmitted(true).
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      {plan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/50 px-5 py-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Đăng ký ${plan.name}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Đóng"
              className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
                <h2 className="mt-4 font-display font-bold text-2xl text-ink dark:text-white">
                  Cảm ơn bạn!
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Chúng tôi sẽ liên hệ tư vấn {plan.name} sớm nhất.
                </p>
                <Button onClick={onClose} variant="primary" className="mt-6">
                  Đóng
                </Button>
              </div>
            ) : (
              <>
                <p className="text-primary font-semibold text-sm">Đăng ký gói tập</p>
                <h2 className="mt-1 font-display font-bold text-2xl text-ink dark:text-white">
                  {plan.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-ink dark:text-white">{plan.price}</span>
                  {plan.period}
                  {plan.sub && <span className="text-emerald-500"> ({plan.sub})</span>}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{plan.desc}</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <FormField
                    label="Họ và tên"
                    name="fullName"
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                  />

                  {/* Tuổi, chiều cao, cân nặng: 3 ô trên cùng một hàng */}
                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      label="Tuổi"
                      name="age"
                      type="number"
                      placeholder="25"
                      inputMode="numeric"
                      min="10"
                      max="100"
                    />
                    <FormField
                      label="Cao (cm)"
                      name="height"
                      type="number"
                      placeholder="170"
                      inputMode="numeric"
                      min="100"
                      max="250"
                    />
                    <FormField
                      label="Nặng (kg)"
                      name="weight"
                      type="number"
                      placeholder="65"
                      inputMode="decimal"
                      min="30"
                      max="250"
                    />
                  </div>

                  <FormField
                    label="Địa chỉ"
                    name="address"
                    placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                    autoComplete="street-address"
                  />
                  <FormField
                    label="Số điện thoại"
                    name="phone"
                    type="tel"
                    placeholder="0912 345 678"
                    autoComplete="tel"
                    pattern="[0-9 ]{9,12}"
                    title="Nhập số điện thoại gồm 9–12 chữ số"
                  />

                  <Button type="submit" variant="accent" className="w-full mt-2">
                    Gửi đăng ký
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}