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
    else if (form.name.trim().length < 3) next.name = 'Ad en az 3 karakter olmalı'
    if (!form.email) next.email = 'E-posta zorunludur'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Geçerli bir e-posta girin'
    if (!form.password) next.password = 'Şifre zorunludur'
    else if (form.password.length < 3) next.password = 'Şifre en az 3 karakter olmalı'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      setNotice({})
      // username otomatik üret (email > ad slug > fallback)
      const local = (form.email || '').split('@')[0] || ''
      const nameSlug = (form.name || '').trim().toLowerCase().replace(/\s+/g, '.')
      const base = (local || nameSlug || 'user').replace(/[^a-zA-Z0-9._-]/g, '')
      let username = base.slice(0, 24)
      if (username.length < 3) username = `${username}${Math.random().toString(36).slice(2, 5)}`
      await registerUser({ ...form, username })
      // Kayıt edilen adı ve e-postayı geçici olarak sakla; backend isim dönmezse profil için kullanacağız
      try {
        localStorage.setItem('last_register_name', (form.name || '').trim())
        localStorage.setItem('last_register_email', (form.email || '').trim())
      } catch {}
      setNotice({ type: 'success', message: 'Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz...' })
      setTimeout(() => navigate('/login'), 800)
    } catch (err) {
      // Sunucudan dönen hata içeriğini kullanıcıya yansıt
      const data = err?.response?.data
      let msg = data?.message || data?.error || 'Kayıt başarısız'
      // Bazı Spring hatalarında constraint ihlalleri liste olarak dönebilir
      if (Array.isArray(data?.violations)) {
        const details = data.violations.map(v => `${v?.field || ''} ${v?.message || ''}`.trim()).filter(Boolean).join(' | ')
        if (details) msg = `${msg}: ${details}`
      }
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
          {/* Kullanıcı adı otomatik üretilecek; alanı göstermiyoruz */}
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
            placeholder="En az 3 karakter"
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
