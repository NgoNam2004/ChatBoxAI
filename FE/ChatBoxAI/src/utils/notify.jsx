import React from 'react'
import toast from 'react-hot-toast'

// Hiện toast lỗi. Nhận một chuỗi hoặc một mảng chuỗi.
// id cố định → toast lỗi mới sẽ thay toast lỗi cũ, không bị chồng.
export function notifyError(messages) {
  const list = Array.isArray(messages) ? messages : [messages]

  const content =
    list.length === 1 ? (
      list[0]
    ) : (
      <ul className="space-y-1 text-left">
        {list.map((msg) => (
          <li key={msg}>• {msg}</li>
        ))}
      </ul>
    )

  toast.error(content, { id: 'auth-error' })
}

// Hiện toast thành công.
export function notifySuccess(message) {
  toast.success(message)
}