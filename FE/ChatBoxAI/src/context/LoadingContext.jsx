import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from '../components/LoadingScreen.jsx'

const LoadingContext = createContext(null)

// Phải nằm BÊN TRONG <BrowserRouter> vì dùng useNavigate (main.jsx đã bọc sẵn).
export function LoadingProvider({ children }) {
  const navigate = useNavigate()
  const [message, setMessage] = useState(null) // null = không loading
  const timerRef = useRef(null)

  // Hiện loading, chờ `delay` ms rồi chuyển trang (dùng khi KHÔNG có API).
  const navigateWithLoading = useCallback(
    (to, { message = 'Đang tải...', delay = 1500 } = {}) => {
      clearTimeout(timerRef.current)
      setMessage(message)
      timerRef.current = setTimeout(() => {
        navigate(to)
        setMessage(null)
      }, delay)
    },
    [navigate]
  )

  // MỚI: bật / tắt loading thủ công, dùng khi chờ API.
  const showLoading = useCallback((msg = 'Đang tải...') => {
    clearTimeout(timerRef.current)
    setMessage(msg)
  }, [])

  const hideLoading = useCallback(() => setMessage(null), [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <LoadingContext.Provider value={{ navigateWithLoading, showLoading, hideLoading }}>
      {children}
      <AnimatePresence>{message && <LoadingScreen message={message} />}</AnimatePresence>
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  return useContext(LoadingContext)
}