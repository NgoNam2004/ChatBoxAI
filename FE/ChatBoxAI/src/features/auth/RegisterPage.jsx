import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { register } from '../../services/authService.js'
import FormField from './components/FormField.jsx'

export default function RegisterPage() {
  const navigate  = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading]  = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  function validate(full_name, email, password, confirmPassword) {
    const errs = {}
    if (!full_name || full_name.trim().length < 2)
      errs.full_name = 'Họ tên tối thiểu 2 ký tự.'
    if (!email)
      errs.email = 'Vui lòng nhập email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Email không hợp lệ.'
    if (!password || password.length < 8)
      errs.password = 'Mật khẩu tối thiểu 8 ký tự.'
    else if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(password))
      errs.password = 'Mật khẩu phải có ít nhất 1 chữ cái và 1 chữ số.'
    if (password !== confirmPassword)
      errs.confirmPassword = 'Mật khẩu nhập lại không khớp.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const form            = new FormData(e.currentTarget)
    const full_name       = form.get('fullName')?.trim()
    const email           = form.get('email')?.trim().toLowerCase()
    const password        = form.get('password')
    const confirmPassword = form.get('confirmPassword')

    const errs = validate(full_name, email, password, confirmPassword)
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})

    setLoading(true)
    try {
      const { data } = await register({ full_name, email, password })
      // Đăng nhập luôn sau khi đăng ký thành công
      login(data.token, data.user)
      toast.success('Đăng ký thành công! Chào mừng bạn đến với FitAI Gym.')
      navigate('/')
    } catch (err) {
      const messages = err.details?.length ? err.details : [err.message]
      messages.forEach((m) => toast.error(m))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Bắt đầu hành trình cùng AI Coach của FitAI Gym.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          label="Họ và tên"
          name="fullName"
          placeholder="Nguyễn Văn A"
          error={fieldErrors.full_name}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="ban@email.com"
          error={fieldErrors.email}
        />
        <FormField
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="••••••••"
          error={fieldErrors.password}
        />
        <FormField
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          error={fieldErrors.confirmPassword}
        />

        <Button type="submit" variant="accent" className="w-full mt-2" disabled={loading}>
          {loading ? 'Đang tạo tài khoản...' : 'Xác nhận'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  )
}