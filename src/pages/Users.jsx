import React, { useEffect, useState } from 'react'
import { getAllUsers } from '../services/authService'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState({ type: '', message: '' })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setNotice({})
      const data = await getAllUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Kullanıcılar alınamadı'
      setNotice({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#003366]">Kullanıcılar</h1>
            <p className="text-sm text-gray-600">Sistemdeki tüm kullanıcılar</p>
          </div>
        </div>

        {notice.message && (
          <div className={`mt-4 rounded-xl border p-3 text-sm ${
            notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {notice.message}
          </div>
        )}

        <div className="mt-6 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Ad</th>
                <th className="py-2 pr-4">E-posta</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id ?? idx} className="border-b last:border-b-0">
                  <td className="py-3 pr-4">{u.id ?? '-'}</td>
                  <td className="py-3 pr-4">{u.name ?? '-'}</td>
                  <td className="py-3 pr-4">{u.email ?? '-'}</td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td className="py-6 text-gray-500" colSpan={3}>Kayıt bulunamadı</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
