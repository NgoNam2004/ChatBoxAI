import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import Button from '../../components/Button.jsx'
import FormField from './components/FormField.jsx'

export default function LoginPage() {
  const navigate = useNavigate()

  // MVP: không kiểm tra tài khoản, chỉ chuyển về trang chủ.
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/')
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