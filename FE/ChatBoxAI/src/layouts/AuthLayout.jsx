import React from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-ink px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white">
            <Dumbbell size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display font-bold text-xl text-ink dark:text-white">
            FitAI <span className="text-primary">Gym</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <h1 className="font-display font-bold text-2xl text-ink dark:text-white">{title}</h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}