import React from 'react'

export default function Alert({ type = 'info', children, className = '' }) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  }

  return (
    <div className={`rounded-xl border p-3 text-sm ${styles[type] || styles.info} ${className}`}>
      {children}
    </div>
  )
}
