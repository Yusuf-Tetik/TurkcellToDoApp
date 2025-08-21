import React from 'react'

const variants = {
  primary:
    'bg-[#FFD700] text-[#003366] hover:shadow-lg hover:shadow-yellow-400/30 active:translate-y-px',
  secondary:
    'bg-[#003366] text-white hover:shadow-lg hover:shadow-blue-900/30 active:translate-y-px',
  outline:
    'bg-transparent text-[#003366] border border-[#003366] hover:bg-[#003366]/5 active:translate-y-px',
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const base = 'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-transform duration-100 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 disabled:opacity-60 disabled:cursor-not-allowed'

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...rest}
    >
      {loading && (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      {children}
    </button>
  )
}
