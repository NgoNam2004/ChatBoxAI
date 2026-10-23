import React from 'react'

export default function FormField({ label, name, type = 'text', placeholder, error, ...rest }) {
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
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
        className={`w-full text-sm bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none text-ink dark:text-white placeholder:text-slate-400 focus:ring-2 transition ${
          error
            ? 'ring-2 ring-red-400 focus:ring-red-400'
            : 'focus:ring-primary/40'
        }`}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}