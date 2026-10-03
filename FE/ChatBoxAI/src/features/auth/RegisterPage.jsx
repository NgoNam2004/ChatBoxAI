import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import Button from '../../components/Button.jsx'
import FormField from './components/FormField.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()

  // MVP: không xử lý dữ liệu, chỉ chuyển sang trang Đăng nhập.
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Bắt đầu hành trình cùng AI Coach của FitAI Gym.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Họ và tên" name="fullName" placeholder="Nguyễn Văn A" />
        <FormField label="Email" name="email" type="email" placeholder="ban@email.com" />
        <FormField label="Mật khẩu" name="password" type="password" placeholder="••••••••" />
        <FormField
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
        />

        <Button type="submit" variant="accent" className="w-full mt-2">
          Xác nhận
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