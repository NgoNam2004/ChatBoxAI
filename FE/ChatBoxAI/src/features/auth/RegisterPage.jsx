import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import Button from '../../components/Button.jsx'
import { useLoading } from '../../context/LoadingContext.jsx'
import { register } from '../../services/authService.js'
import { notifyError, notifySuccess } from '../../utils/notify.jsx'
import FormField from './components/FormField.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { showLoading, hideLoading } = useLoading()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Đọc giá trị từ các ô input theo thuộc tính name
    const form = new FormData(e.currentTarget)
    const name = form.get('fullName')
    const email = form.get('email')
    const password = form.get('password')
    const confirmPassword = form.get('confirmPassword')

    // BE không kiểm tra confirmPassword nên FE tự kiểm tra
    if (password !== confirmPassword) {
      notifyError('Mật khẩu nhập lại không khớp.')
      return
    }

    showLoading('Đang tạo tài khoản...')
    try {
      await register({ name, email, password }) // FE đặt tên fullName, BE cần name
      hideLoading()
      notifySuccess('Đăng ký thành công! Vui lòng đăng nhập.')
      navigate('/login')
    } catch (err) {
      hideLoading()
      notifyError(err.details?.length ? err.details : err.message)
    }
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