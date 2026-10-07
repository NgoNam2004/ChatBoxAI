import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import Button from '../../components/Button.jsx'
import { useLoading } from '../../context/LoadingContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { login } from '../../services/authService.js'
import { notifyError, notifySuccess } from '../../utils/notify.jsx'
import FormField from './components/FormField.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useLoading()
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = new FormData(e.currentTarget)
    const email = form.get('email')
    const password = form.get('password')

    showLoading('Đang đăng nhập...')
    try {
      const { data } = await login({ email, password })
      signIn(data.token, data.user) // lưu + cập nhật state để Header hiện tên
      hideLoading()
      notifySuccess(`Chào mừng ${data.user.name}!`)
      navigate('/')
    } catch (err) {
      hideLoading()
      notifyError(err.details?.length ? err.details : err.message)
    }
  }

  return (
    <AuthLayout title="Đăng nhập" subtitle="Chào mừng bạn quay lại FitAI Gym.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email" name="email" type="email" placeholder="ban@email.com" />
        <FormField label="Mật khẩu" name="password" type="password" placeholder="••••••••" />

        <Button type="submit" variant="accent" className="w-full mt-2">
          Đăng nhập
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