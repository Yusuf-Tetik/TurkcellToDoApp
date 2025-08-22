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
import { authStorage } from './services/authService'
import { useNavigate } from 'react-router-dom'

// Ana uygulama bileşeni: todo listeleme, ekleme, güncelleme, silme ve durum değiştirme işlemlerini yönetir
export default function App() {
  // Uygulama state'leri
  const [todos, setTodos] = useState([]) // Todo listesi
  const [loading, setLoading] = useState(false) // Yükleniyor durumu
  const [error, setError] = useState('') // Hata mesajı
  const [editingTodo, setEditingTodo] = useState(null) // Düzenlenen todo
  const [menuOpen, setMenuOpen] = useState(false) // Kullanıcı menüsü
  const [filters, setFilters] = useState({ status: '', priority: '', start: '', end: '' })
  const [listResetKey, setListResetKey] = useState(0) // Listeyi sıfırlamak için anahtar
  const navigate = useNavigate()

  // Component yüklendiğinde todoları çek
  useEffect(() => {
    // İlk ekran yüklendiğinde tüm todoları getirir
    fetchTodos()
  }, [])

  // Filtreler değiştiğinde otomatik uygula (sadece mevcut kullanıcının todoları üzerinde)
  useEffect(() => {
    const hasAny = filters.status || filters.priority || filters.start || filters.end
    if (!hasAny) {
      // Filtreler tamamen temizlendiyse tüm todoları geri yükle
      fetchTodos()
      return
    }
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getAllTodos()
        const list = Array.isArray(data) ? data : []
        const filtered = list.filter((t) => {
          const normalizedStatus = String(t.status || '').toUpperCase()
          const isCompleted = Boolean(
            t.completed ||
            t.done ||
            normalizedStatus === 'DONE' ||
            normalizedStatus === 'COMPLETED'
          )
          // status
          if (filters.status === 'DONE' && !isCompleted) return false
          if (filters.status === 'NOT_DONE' && isCompleted) return false
          // priority
          if (filters.priority) {
            if (String(t.priority || '').toUpperCase() !== String(filters.priority).toUpperCase()) return false
          }
          // date range (deadline aralığı)
          if (filters.start) {
            const d = new Date(t.deadline)
            if (isFinite(d) && d < new Date(filters.start)) return false
          }
          if (filters.end) {
            const d = new Date(t.deadline)
            if (isFinite(d) && d > new Date(filters.end)) return false
          }
          return true
        })
        setTodos(filtered)
      } catch (err) {
        setError('Filtreli todolar getirilirken bir hata oluştu.')
      } finally {
        setLoading(false)
      }
    })()
  }, [filters])

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
      return true
    } catch (err) {
      // Backend'den gelen hata mesajını gösterelim
      const backendMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message
      setError(`Todo oluşturulurken bir hata oluştu${backendMessage ? `: ${backendMessage}` : ''}`)
      return false
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

  const currentUser = authStorage.get()
  const displayName = currentUser?.name || currentUser?.fullName || currentUser?.username || currentUser?.email || 'Kullanıcı'
  const handleLogout = () => {
    authStorage.clear()
    navigate('/login')
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((p) => ({ ...p, [name]: value }))
  }
  const clearFilters = () => {
    setFilters({ status: '', priority: '', start: '', end: '' })
    fetchTodos()
    setListResetKey((k) => k + 1)
  }

  return (
    <div className="app">
      {/* Üst başlık alanı */}
      <header className="header">
        <div className="header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div className="brand">
            <div className="logo-badge" aria-hidden>✓</div>
            <div>
              <h1 className="site-title">To-Do Projesi</h1>
              <p className="subtitle">Unutmamanız gereken her şeyi not alın !!</p>
            </div>
          </div>
          <div className="user-menu">
            <button className="user-menu-button" onClick={() => setMenuOpen((v) => !v)}>
              {displayName}
            </button>
            {menuOpen && (
              <div className="user-menu-card">
                <div className="muted" style={{ marginBottom: 8 }}>{currentUser?.email || ''}</div>
                <div className="user-menu-actions">
                  <button className="btn btn-outline" onClick={() => { setMenuOpen(false); navigate('/profile') }}>Profil</button>
                  <button className="btn btn-danger" onClick={handleLogout}>Çıkış Yap</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* İçerik alanı: iki sütun (sol form ~%30, sağ liste ~%70) */}
      <main className="container">
        {/* Sol sütun: TodoForm kartı */}
        <section className="card">
          <h2 className="section-title">Yeni Todo Ekle</h2>
          {/* Form: yeni kayıt ve düzenleme işlemleri */}
          <TodoForm
            editingTodo={null}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        {/* Sağ sütun: TodoList kartı */}
        <section className="card">
          <div className="card-header" style={{ alignItems: 'end' }}>
            <div>
              <h2 className="section-title">Tüm Todolar</h2>
            </div>
            <div className="card-tools" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select name="status" value={filters.status} onChange={handleFilterChange} className="btn btn-outline" style={{ paddingRight: 28 }}>
                <option value="">Durum (Hepsi)</option>
                <option value="NOT_DONE">Not Done</option>
                <option value="DONE">Done</option>
              </select>
              <select name="priority" value={filters.priority} onChange={handleFilterChange} className="btn btn-outline" style={{ paddingRight: 28 }}>
                <option value="">Öncelik (Hepsi)</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <input type="datetime-local" name="start" value={filters.start} onChange={handleFilterChange} className="btn btn-outline" />
              <input type="datetime-local" name="end" value={filters.end} onChange={handleFilterChange} className="btn btn-outline" />
              <button className="btn btn-secondary" onClick={clearFilters}>Temizle</button>
            </div>
          </div>

          {/* Yükleniyor ve hata durumları */}
          {loading && <div className="info">Yükleniyor...</div>}
          {error && <div className="error">{error}</div>}

          {/* Todo listesi */}
          <TodoList
            key={listResetKey}
            todos={todos}
            onEdit={setEditingTodo}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </section>
      </main>

      {/* Düzenleme için modal (arka plan blur) */}
      {editingTodo && (
        <div className="modal-backdrop" onClick={() => setEditingTodo(null)}>
          <div className="modal-dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <section className="card">
              <div className="card-header">
                <h2 className="section-title" style={{ marginBottom: 0 }}>Todo Düzenle</h2>
                <button className="btn btn-outline modal-close" onClick={() => setEditingTodo(null)} aria-label="Kapat">✕</button>
              </div>
              <TodoForm
                editingTodo={editingTodo}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onCancelEdit={handleCancelEdit}
              />
            </section>
          </div>
        </div>
      )}

      {/* Alt bilgi */}
      {/* Hava durumu test bileşeni: tüm satırı kaplar */}
      <div className="container" style={{ marginTop: 0 }}>
        <WeatherWidget />
      </div>

      <footer className="footer">Frontend =&gt; Yusuf | Backend =&gt; Selma &amp; Haluk</footer>
    </div>
  )
}
