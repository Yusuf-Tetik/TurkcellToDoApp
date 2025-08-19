import { useEffect, useState } from 'react'
import './index.css'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import WeatherWidget from './components/WeatherWidget'
import {
  getAllTodos,
  createTodo,
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
} from './services/todoService'

// Ana uygulama bileşeni: todo listeleme, ekleme, güncelleme, silme ve durum değiştirme işlemlerini yönetir
export default function App() {
  // Uygulama state'leri
  const [todos, setTodos] = useState([]) // Todo listesi
  const [loading, setLoading] = useState(false) // Yükleniyor durumu
  const [error, setError] = useState('') // Hata mesajı
  const [editingTodo, setEditingTodo] = useState(null) // Düzenlenen todo

  // Component yüklendiğinde todoları çek
  useEffect(() => {
    // İlk ekran yüklendiğinde tüm todoları getirir
    fetchTodos()
  }, [])

  // Tüm todoları backend'den çeker
  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError('')
      // Axios ile GET isteği atıyoruz
      const data = await getAllTodos()
      setTodos(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Todolar getirilirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  // Yeni todo oluşturma işlemi
  const handleCreate = async (payload) => {
    try {
      setLoading(true)
      setError('')
      // Axios ile POST isteği atıyoruz
      await createTodo(payload)
      await fetchTodos()
    } catch (err) {
      // Backend'den gelen hata mesajını gösterelim
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message
      setError(`Todo oluşturulurken bir hata oluştu${backendMessage ? `: ${backendMessage}` : ''}`)
    } finally {
      setLoading(false)
    }
  }

  // Var olan todo'yu güncelleme işlemi
  const handleUpdate = async (id, payload) => {
    try {
      setLoading(true)
      setError('')
      // Axios ile PUT isteği atıyoruz
      await updateTodo(id, payload)
      setEditingTodo(null)
      await fetchTodos()
    } catch (err) {
      setError('Todo güncellenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  // Todo durumunu değiştirme işlemi
  const handleToggleStatus = async (id) => {
    try {
      setLoading(true)
      setError('')
      // Axios ile PATCH isteği atıyoruz (gövdesiz)
      await toggleTodoStatus(id)
      await fetchTodos()
    } catch (err) {
      setError('Todo durumu değiştirilirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  // Todo silme işlemi
  const handleDelete = async (id) => {
    try {
      setLoading(true)
      setError('')
      // Axios ile DELETE isteği atıyoruz
      await deleteTodo(id)
      await fetchTodos()
    } catch (err) {
      setError('Todo silinirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  // Düzenleme iptal işlemi
  const handleCancelEdit = () => {
    setEditingTodo(null)
  }

  return (
    <div className="app">
      {/* Üst başlık alanı */}
      <header className="header">
        <div className="header-inner">
          <h1>To-Do Projesi</h1>
          <p className="subtitle">Unutmamanız gereken her şeyi not alın !!</p>
        </div>
      </header>

      {/* İçerik alanı: iki sütun (sol form ~%30, sağ liste ~%70) */}
      <main className="container">
        {/* Sol sütun: TodoForm kartı */}
        <section className="card">
          <h2>{editingTodo ? 'Todo Güncelle' : 'Yeni Todo Ekle'}</h2>
          {/* Form: yeni kayıt ve düzenleme işlemleri */}
          <TodoForm
            editingTodo={editingTodo}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        {/* Sağ sütun: TodoList kartı */}
        <section className="card">
          <div className="card-header">
            <h2>Tüm Todolar</h2>
            <div className="card-tools">
              <button className="btn btn-outline" onClick={fetchTodos} disabled={loading}>
                Yenile
              </button>
            </div>
          </div>

          {/* Yükleniyor ve hata durumları */}
          {loading && <div className="info">Yükleniyor...</div>}
          {error && <div className="error">{error}</div>}

          {/* Todo listesi */}
          <TodoList
            todos={todos}
            onEdit={setEditingTodo}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </section>
      </main>

      {/* Alt bilgi */}
      {/* Hava durumu test bileşeni: tüm satırı kaplar */}
      <div className="container" style={{ marginTop: 0 }}>
        <WeatherWidget />
      </div>

      <footer className="footer">Frontend =&gt; Yusuf | Backend =&gt; Selma &amp; Haluk</footer>
    </div>
  )
}
