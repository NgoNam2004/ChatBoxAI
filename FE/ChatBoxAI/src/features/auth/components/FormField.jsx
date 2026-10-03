import React from 'react'

export default function FormField({ label, name, type = 'text', placeholder, ...rest }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-ink dark:text-slate-200 mb-1.5"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required
        {...rest}
        className="w-full text-sm bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none text-ink dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/40 transition"
      />
    </div>
  )
}