import React, { useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { registerUser } from '../services/authService'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState({ type: '', message: '' })

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors((p) => ({ ...p, [e.target.name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name) next.name = 'Ad zorunludur'
    if (!form.email) next.email = 'E-posta zorunludur'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Geçerli bir e-posta girin'
    if (!form.password) next.password = 'Şifre zorunludur'
    else if (form.password.length < 6) next.password = 'Şifre en az 6 karakter olmalı'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      setNotice({})
      await registerUser(form)
      setNotice({ type: 'success', message: 'Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz...' })
      setTimeout(() => navigate('/login'), 800)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Kayıt başarısız'
      setNotice({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#003366]">Kayıt Ol</h1>
          <p className="text-sm text-gray-600">Yeni hesabınızı oluşturun</p>
        </div>

        {notice.message && (
          <div className={`mb-4 rounded-xl border p-3 text-sm ${
            notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {notice.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            label="Ad"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Adınız"
            error={errors.name}
            autoComplete="name"
          />
          <Input
            label="E-posta"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ornek@eposta.com"
            error={errors.email}
            autoComplete="email"
            autoCorrect="off"
            autoCapitalize="none"
            inputMode="email"
            spellCheck={false}
          />
          <Input
            label="Şifre"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="En az 6 karakter"
            error={errors.password}
            autoComplete="new-password"
          />

          <Button type="submit" loading={loading} className="mt-2">Kayıt Ol</Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Zaten hesabın var mı? </span>
          <Link to="/login" className="text-[#003366] font-semibold hover:underline">Giriş yap</Link>
        </div>
      </div>
    </div>
  )
}
