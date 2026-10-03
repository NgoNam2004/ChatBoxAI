import React from 'react'

const VARIANTS = {
  accent: 'bg-accent hover:bg-accent-dark text-white shadow-md',
  primary: 'bg-primary hover:bg-primary-dark text-white',
  ghost: 'bg-white/10 border border-white/40 hover:bg-white/20 text-white backdrop-blur-md',
  outline: 'border border-slate-200 dark:border-slate-700 text-ink dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800',
}

// Generic call-to-action button shared across features (Hero, AI Coach
// highlight, Final CTA, etc). `as="a"` renders an anchor for in-page links.
export default function Button({ as = 'button', variant = 'accent', className = '', children, ...props }) {
  const Tag = as
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-full transition-colors ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
