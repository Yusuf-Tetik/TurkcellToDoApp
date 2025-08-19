import axios from 'axios'

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
  const response = await api.get('/all-todos')
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
  // Backend'e yeni todo verisini gönderiyoruz
  // Birçok Spring Boot DTO'su yalnızca title & description bekler.
  // completed gibi ekstra alanlar 400 (UnrecognizedProperty) hatasına sebep olabilir.
  const { title, description, completed } = payload || {}
  const body = { title, description }
  // Eğer kullanıcı tamamlandı seçtiyse completed alanını gönderelim (opsiyonel)
  if (typeof completed === 'boolean') {
    body.completed = completed
  }
  const response = await api.post('/create-todo', body)
  return response.data
}

// Var olan todo'yu günceller
export const updateTodo = async (id, payload) => {
  // Backend'e güncellenmiş todo verisini gönderiyoruz
  const response = await api.put(`/update-todo/${id}`, payload)
  return response.data
}

// Todo'nun durumunu değiştirir (tamamlandı/bekliyor)
export const toggleTodoStatus = async (id) => {
  // Backend'de status toggle işlemi yapılıyor
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
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
}


