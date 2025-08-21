import React from 'react'

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className = '',
  ...rest
}) {
  const base = 'w-full px-4 py-3 rounded-2xl bg-white border outline-none transition duration-200'
  const normal = 'border-gray-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 hover:ring-1 hover:ring-[#003366]/10'
  const errored = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'

  return (
    <div className={`grid gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-[#003366]">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${base} ${error ? errored : normal}`}
        {...rest}
      />
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  )
}
