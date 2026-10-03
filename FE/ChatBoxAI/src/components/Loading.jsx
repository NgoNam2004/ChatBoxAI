import React from 'react'
export default function LoadingPage({ size = 24, className = '' }) {
  return (
    <span
      role="status"
      aria-label="Đang tải"
      style={{ width: size, height: size }}
      className={`inline-block rounded-full border-2 border-current border-t-transparent animate-spin text-primary ${className}`}
    />
  )
}