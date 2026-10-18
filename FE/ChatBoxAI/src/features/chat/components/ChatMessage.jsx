import React from 'react'
import { Bot, RotateCw } from 'lucide-react'

// Typing indicator — 3 chấm nhảy khi chờ token đầu tiên
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

// Streaming cursor — nhấp nháy khi AI đang gõ
function StreamingCursor() {
  return (
    <span
      className="inline-block w-0.5 h-4 ml-0.5 bg-current align-middle"
      style={{ animation: 'blink-cursor 0.8s step-end infinite' }}
    />
  )
}

/**
 * ChatMessage — hiển thị một bubble chat.
 *
 * Props:
 *   from       — 'user' | 'ai'
 *   text       — nội dung tin nhắn
 *   isLoading  — true → hiện TypingIndicator (chờ token đầu tiên)
 *   isStreaming — true → đang nhận chunks (hiện cursor nhấp nháy)
 *   isError    — true → style đỏ nhạt
 *   retryable  — true → hiện nút "Thử lại"
 *   onRetry    — callback khi nhấn "Thử lại"
 */
export default function ChatMessage({ from, text, isLoading, isStreaming, isError, retryable, onRetry }) {
  const isAi = from === 'ai'

  // Khi isStreaming && text rỗng → vẫn chưa có chunk nào → hiện TypingIndicator
  const showTyping = isLoading || (isStreaming && !text)

  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <span className="w-7 h-7 mr-2 shrink-0 grid place-items-center rounded-full bg-primary/10 text-primary">
          <Bot size={14} />
        </span>
      )}
      <div
        className={`max-w-[82%] text-sm px-4 py-2.5 rounded-2xl ${
          isAi
            ? isError
              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-tl-sm border border-red-200/70 dark:border-red-900/50'
              : 'bg-white dark:bg-slate-800 text-ink dark:text-slate-100 rounded-tl-sm shadow-sm'
            : 'bg-primary text-white rounded-tr-sm'
        }`}
      >
        {showTyping ? (
          <TypingIndicator />
        ) : (
          <div>
            <p className="whitespace-pre-wrap leading-relaxed">
              {text}
              {/* Cursor nhấp nháy khi đang stream */}
              {isStreaming && <StreamingCursor />}
            </p>
            {isError && retryable && onRetry && (
              <div className="mt-2.5 pt-2 border-t border-red-200/60 dark:border-red-900/50 flex items-center justify-between gap-2">
                <span className="text-[11px] text-red-500/80 dark:text-red-400/80">Có thể thử lại ngay</span>
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer"
                  title="Gửi lại tin nhắn này"
                >
                  <RotateCw size={12} className="shrink-0" />
                  <span>Thử lại</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
