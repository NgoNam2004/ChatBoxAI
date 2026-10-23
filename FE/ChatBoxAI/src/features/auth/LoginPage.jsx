import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { login } from '../../services/authService.js'
import FormField from './components/FormField.jsx'

export default function LoginPage() {
  const navigate      = useNavigate()
  const { login: signIn } = useAuth()
  const [loading, setLoading]  = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  function validate(email, password) {
    const errs = {}
    if (!email)    errs.email    = 'Vui lòng nhập email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email không hợp lệ.'
    if (!password) errs.password = 'Vui lòng nhập mật khẩu.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const form     = new FormData(e.currentTarget)
    const email    = form.get('email')?.trim().toLowerCase()
    const password = form.get('password')

    const errs = validate(email, password)
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})

    setLoading(true)
    try {
      const { data } = await login({ email, password })
      signIn(data.token, data.user)
      toast.success(`Chào mừng ${data.user.full_name}!`)
      navigate('/')
    } catch (err) {
      const messages = err.details?.length ? err.details : [err.message]
      messages.forEach((m) => toast.error(m))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Đăng nhập" subtitle="Chào mừng bạn quay lại FitAI Gym.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

        <Button type="submit" variant="accent" className="w-full mt-2" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Đăng ký
        </Link>
      </p>
    </AuthLayout>
  )
}