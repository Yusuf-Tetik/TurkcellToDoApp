import React, { useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { loginUser, authStorage } from '../services/authService'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState({ type: '', message: '' })

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors((p) => ({ ...p, [e.target.name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.email) next.email = 'E-posta zorunludur'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Geçerli bir e-posta girin'
    if (!form.password) next.password = 'Şifre zorunludur'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      setNotice({})
      const user = await loginUser({ email: form.email, password: form.password })
      authStorage.set(user)
      setNotice({ type: 'success', message: 'Giriş başarılı. Yönlendiriliyorsunuz...' })
      setTimeout(() => navigate('/todos'), 600)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Giriş başarısız'
      setNotice({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#003366]">Giriş Yap</h1>
          <p className="text-sm text-gray-600">Hesabınıza erişin</p>
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
            placeholder="******"
            error={errors.password}
            autoComplete="current-password"
          />

          <Button type="submit" loading={loading} className="mt-2">Giriş Yap</Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Hesabın yok mu? </span>
          <Link to="/register" className="text-[#003366] font-semibold hover:underline">Kayıt ol</Link>
        </div>
      </div>
    </div>
  )
}
