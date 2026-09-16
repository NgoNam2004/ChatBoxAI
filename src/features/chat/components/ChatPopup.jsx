import React, { useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { Bot, X, Sparkles, GripHorizontal } from 'lucide-react'
import { useChat } from '../../../context/ChatContext.jsx'
import useChatMessages from '../hooks/useChatMessages.js'
import ChatMessage from './ChatMessage.jsx'
import ChatInput from './ChatInput.jsx'

const QUICK_SUGGESTIONS = ['Gợi ý bài tập', 'Thực đơn giảm cân', 'Lịch tập tuần này']

// Large AI Chat popup — the centerpiece of the site.
// Desktop: 460px × 630px (within the 420–480 × 580–650 target range).
// Mobile: full-screen for comfortable typing.
// Draggable on desktop via framer-motion; always has a clear close button.
export default function ChatPopup() {
  const { isChatOpen, closeChat } = useChat()
  const { messages, input, setInput, handleSend, sendMessage } = useChatMessages()
  const constraintsRef = useRef(null)
  const dragControls = useDragControls()

  return (
    <>
      {/* Invisible drag boundary covering the viewport */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />

      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 sm:hidden"
              onClick={closeChat}
            />

            <motion.div
              drag
              dragControls={dragControls}
              dragConstraints={constraintsRef}
              dragMomentum={false}
              dragListener={false}
              dragElastic={0}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden
                inset-0 sm:inset-auto
                sm:bottom-24 sm:right-6
                sm:w-[460px] sm:h-[630px]
                sm:rounded-3xl"
              id="ai-chat-popup-window"
            >
              <ChatPopupHeader onClose={closeChat} onDragStart={(e) => dragControls.start(e)} />

              {/* Messages */}
              <div className="chat-scroll flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 bg-slate-50 dark:bg-slate-950/40">
                {messages.map((m, i) => (
                  <ChatMessage key={i} from={m.from} text={m.text} />
                ))}
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-2 px-4 sm:px-5 pb-3">
                {QUICK_SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <ChatInput value={input} onChange={setInput} onSend={handleSend} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function ChatPopupHeader({ onClose, onDragStart }) {
  return (
    <div
      onPointerDown={onDragStart}
      className="flex items-center justify-between px-4 sm:px-5 py-4 bg-gradient-to-r from-primary to-primary-dark text-white cursor-grab active:cursor-grabbing select-none"
    >
      <div className="flex items-center gap-2">
        <GripHorizontal size={16} className="text-white/50 hidden sm:block" />
        <span className="w-8 h-8 grid place-items-center rounded-full bg-white/20">
          <Bot size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold flex items-center gap-1">
            AI Coach <Sparkles size={12} />
          </p>
          <p className="text-[11px] text-white/80">Phản hồi ngay lập tức</p>
        </div>
      </div>
      <button onClick={onClose} aria-label="Đóng chat" className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/15 transition-colors">
        <X size={18} />
      </button>
    </div>
  )
}
