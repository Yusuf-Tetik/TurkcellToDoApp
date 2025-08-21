import axios from 'axios'
import { authStorage } from './authService'

// Axios örneği: Backend'in base URL'i
const api = axios.create({
  // Geliştirmede Vite proxy üzerinden istek atarız: /api -> http://localhost:8080
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Hataları daha görünür kılmak için basit bir response interceptor ekliyoruz
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend'ten gelen hata detaylarını konsola yazdır
    // Bu bilgi, 500/400 gibi durumları teşhis etmeyi kolaylaştırır
    // Not: Prod ortamında kaldırılabilir ya da bir logger'a yönlendirilebilir
    // Türkçe açıklama: URL, status ve response body gösterilir
    // eslint-disable-next-line no-console
    console.error('API error', {
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      data: error?.response?.data,
    })
    return Promise.reject(error)
  }
)

// Tüm todoları getirir
export const getAllTodos = async () => {
  // Backend'den tüm todoları çekiyoruz
  // Kullanıcıya özel liste: GET /api/users/{userId}/todos
  const currentUser = authStorage.get()
  const userId = currentUser?.id
  const path = userId ? `/users/${userId}/todos` : '/all-todos'
  const response = await api.get(path)
  return response.data
}

// Filtreli todoları getirir
export const filterTodos = async ({ status, priority, start, end }) => {
  const params = {}
  if (status) params.status = status
  if (priority) params.priority = priority
  if (start) params.start = start
  if (end) params.end = end
  const response = await api.get('/filter-todos', { params })
  return response.data
}

// ID'ye göre tek bir todo getirir
export const getTodoById = async (id) => {
  // Backend'den tek bir todo'yu çekiyoruz
  const response = await api.get(`/todo/${id}`)
  return response.data
}

// Yeni todo oluşturur
export const createTodo = async (payload) => {
  // Swagger: title, description, status, priority, deadline, tag[]
  const { title, description, status, priority, deadline, tag } = payload || {}
  const trimmedTitle = (title || '').trim()
  const trimmedDescription = (description || '').trim()
  if (!trimmedTitle) throw new Error('Başlık boş olamaz')

  const currentUser = authStorage.get()
  const userId = currentUser?.id
  if (!userId) throw new Error('Todo oluşturmak için önce giriş yapmalısınız.')

  const body = {
    title: trimmedTitle,
    description: trimmedDescription || trimmedTitle,
    status: status || 'NOT_DONE',
    priority: priority || 'LOW',
    deadline: deadline || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    tag: Array.isArray(tag) ? tag : [],
  }

  const response = await api.post(`/users/${userId}/create-todo`, body)
  return response.data
}

// Var olan todo'yu günceller
export const updateTodo = async (id, payload) => {
  // Backend'e güncellenmiş todo verisini gönderiyoruz (tüm alanları gönder)
  const { title, description, status, priority, deadline, tag, completed } = payload || {}
  const body = {
    title,
    description,
    status,
    priority,
    deadline,
    tag,
  }
  if (typeof completed === 'boolean') body.completed = completed
  const response = await api.put(`/update-todo/${id}`, body)
  return response.data
}

// Todo'nun durumunu değiştirir (tamamlandı/bekliyor)
export const toggleTodoStatus = async (id) => {
  // Backend'de status toggle işlemi yapılıyor
  // Swagger: PATCH /api/change-todo-status/{id} (gövdesiz)
  const response = await api.patch(`/change-todo-status/${id}`)
  return response.data
}

// Todo siler
export const deleteTodo = async (id) => {
  // Backend'de ilgili todo'yu siliyoruz
  const response = await api.delete(`/delete-todo/${id}`)
  return response.data
}

export default {
  getAllTodos,
  filterTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
}


