import React from 'react'
import { Send, Loader2 } from 'lucide-react'

// Text field + send button. Disabled khi AI đang xử lý để tránh gửi nhiều request.
export default function ChatInput({ value, onChange, onSend, isLoading }) {
  const canSend = !isLoading && value.trim().length > 0

  return (
    <div className="flex items-center gap-2 p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && canSend) {
            e.preventDefault()
            onSend()
          }
        }}
        disabled={isLoading}
        placeholder={isLoading ? 'AI đang trả lời...' : 'Nhập tin nhắn...'}
        className="flex-1 text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2.5 outline-none text-ink dark:text-white placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
      />
      <button
        onClick={onSend}
        disabled={!canSend}
        className="w-10 h-10 shrink-0 grid place-items-center rounded-full bg-accent hover:bg-accent-dark text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent"
        aria-label={isLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
      </button>
    </div>
  )
}
