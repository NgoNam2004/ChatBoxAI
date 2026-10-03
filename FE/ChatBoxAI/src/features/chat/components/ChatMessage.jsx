import React from 'react'
import { Bot } from 'lucide-react'

// A single chat bubble — AI messages align left with an avatar,
// user messages align right in the brand primary color.
export default function ChatMessage({ from, text }) {
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
            ? 'bg-white dark:bg-slate-800 text-ink dark:text-slate-100 rounded-tl-sm shadow-sm'
            : 'bg-primary text-white rounded-tr-sm'
        }`}
      >
        {text}
      </div>
    </div>
  )
}
