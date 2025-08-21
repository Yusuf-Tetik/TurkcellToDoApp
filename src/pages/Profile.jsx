import React from 'react'
import { authStorage } from '../services/authService'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  const user = authStorage.get()

  const logout = () => {
    authStorage.clear()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8 text-center">
          <h2 className="text-xl font-bold text-[#003366]">Oturum bulunamadı</h2>
          <p className="text-gray-600 mt-2">Devam etmek için giriş yapın.</p>
          <Button className="mt-6" onClick={() => navigate('/login')}>Giriş Yap</Button>
        </div>
      </div>
    )
  }

  const displayName = user?.name || user?.fullName || user?.username || '-'

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-[#003366]">Profil</h1>
        <div className="mt-6 grid gap-3">
          <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">Ad</span><span className="col-span-2 font-semibold">{displayName}</span></div>
          <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">E-posta</span><span className="col-span-2 font-semibold">{user.email || '-'}</span></div>
          <div className="grid grid-cols-3 gap-2"><span className="text-gray-500">ID</span><span className="col-span-2 font-semibold">{user.id ?? '-'}</span></div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/users')}>Kullanıcılar</Button>
          <Button variant="outline" onClick={() => navigate('/todos')}>Todo'lar</Button>
          <div className="flex-1" />
          <Button onClick={logout}>Çıkış Yap</Button>
        </div>
      </div>
    </div>
  )
}
