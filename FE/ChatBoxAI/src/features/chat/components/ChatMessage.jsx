import React from 'react'
import { Bot } from 'lucide-react'

// Typing indicator — 3 chấm nhảy khi AI đang xử lý
function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
        />
      ))}
    </div>
  )
}

// Một chat bubble: AI (trái, có avatar) hoặc user (phải, màu brand).
// isLoading: hiển thị typing indicator thay vì text.
// isError: style màu đỏ nhạt để phân biệt lỗi với phản hồi bình thường.
export default function ChatMessage({ from, text, isLoading, isError }) {
  const isAi = from === 'ai'

  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <span className="w-7 h-7 mr-2 shrink-0 grid place-items-center rounded-full bg-primary/10 text-primary">
          <Bot size={14} />
        </span>
      )}
      <div
        className={`max-w-[78%] text-sm px-4 py-2.5 rounded-2xl ${
          isAi
            ? isError
              ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-tl-sm'
              : 'bg-white dark:bg-slate-800 text-ink dark:text-slate-100 rounded-tl-sm shadow-sm'
            : 'bg-primary text-white rounded-tr-sm'
        }`}
      >
        {isLoading ? <TypingIndicator /> : text}
      </div>
    </div>
  )
}
