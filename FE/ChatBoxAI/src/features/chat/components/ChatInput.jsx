import React from 'react'
import { Send } from 'lucide-react'

// Text field + send button for the chat popup. Kept dumb/controlled so the
// message logic can live in the useChatMessages hook.
export default function ChatInput({ value, onChange, onSend }) {
  return (
    <div className="flex items-center gap-2 p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        placeholder="Nhập tin nhắn..."
        className="flex-1 text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2.5 outline-none text-ink dark:text-white placeholder:text-slate-400"
      />
      <button
        onClick={onSend}
        className="w-10 h-10 shrink-0 grid place-items-center rounded-full bg-accent hover:bg-accent-dark text-white transition-colors"
        aria-label="Gửi tin nhắn"
      >
        <Send size={16} />
      </button>
    </div>
  )
}
