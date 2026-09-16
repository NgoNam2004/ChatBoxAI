import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Reusable image slideshow — 3–4 slides, auto-advancing, with arrows + dots.
// Renders the current slide's image/overlay and exposes the active slide's
// content via children-render-prop so Hero controls headline/CTA layout.
export default function Slideshow({ slides, intervalMs = 6000, children }) {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length])
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    const t = setInterval(next, intervalMs)
    return () => clearInterval(t)
  }, [next, intervalMs])

  const slide = slides[index]

  return (
    <>
      {/* Slide image + overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Slide-dependent content (headline, subheadline, CTAs) */}
      {children({ slide, index })}

      {/* Arrow navigation */}
      <button
        onClick={prev}
        aria-label="Slide trước"
        className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-colors"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Slide tiếp theo"
        className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-colors"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Đi tới slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-7 bg-accent' : 'w-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </>
  )
}
