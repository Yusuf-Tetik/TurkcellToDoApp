// Axios tabanlı basit auth servisi
import axios from 'axios'

const api = axios.create({
  baseURL: '/api/users',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

export async function registerUser(payload) {
  // payload: { name, email, password }
  const body = {
    name: (payload?.name || '').trim(),
    email: (payload?.email || '').trim(),
    password: payload?.password || '',
  }
  const { data } = await api.post('/register', body)
  return data
}

export async function loginUser({ email, password }) {
  // POST /api/users/login?email=...&password=...
  const { data } = await api.post('/login', null, {
    params: { email, password },
  })
  let user = data
  // Bazı durumlarda login dönüşünde ad gelmeyebilir; id ile detay çekip ad bilgisini tamamlayalım
  if (user?.id && (!user?.name || String(user.name).trim().length === 0)) {
    try {
      const { data: byId } = await api.get('/userById', { params: { id: user.id } })
      user = { ...user, ...byId }
    } catch {
      // sessiz geç; mevcut kullanıcı objesi kullanılacak
    }
  }
  return user
}

export async function getUserById(id) {
  const { data } = await api.get('/userById', { params: { id } })
  return data
}

export async function getAllUsers() {
  const { data } = await api.get('/all-users')
  return data
}

export const authStorage = {
  key: 'auth_user',
  get() {
    try {
      const raw = localStorage.getItem(this.key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(user) {
    localStorage.setItem(this.key, JSON.stringify(user))
  },
  clear() {
    localStorage.removeItem(this.key)
  },
}
