import { useEffect, useState } from 'react'

// Yeni todo ekleme ve mevcut todo'yu güncelleme formu
export default function TodoForm({ editingTodo, onCreate, onUpdate, onCancelEdit }) {
  // Form state'lerini tanımlıyoruz
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [completed, setCompleted] = useState(false)

  // editingTodo değiştiğinde formu dolduruyoruz
  useEffect(() => {
    // Eğer düzenleme modundaysak mevcut değerleri forma set et
    if (editingTodo) {
      setTitle(editingTodo.title || '')
      setDescription(editingTodo.description || '')
      setCompleted(Boolean(editingTodo.completed || editingTodo.status === 'COMPLETED' || editingTodo.done))
    } else {
      // Yeni kayıt için formu temizle
      setTitle('')
      setDescription('')
      setCompleted(false)
    }
  }, [editingTodo])

  // Form submit işlemi: yeni ekleme veya güncelleme yapar
  const handleSubmit = (e) => {
    e.preventDefault()
    // Yeni oluşturma için çoğu backend sadece title & description bekler
    const payload = editingTodo ? { title, description, completed } : { title, description }

    // Düzenleme modunda ise güncelleme, değilse ekleme
    if (editingTodo) {
      onUpdate(editingTodo.id, payload)
    } else {
      onCreate(payload)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {/* Başlık alanı */}
      <div className="form-group">
        <label htmlFor="title">Başlık</label>
        <input
          id="title"
          type="text"
          placeholder="Örn: Turkcell'de işe gir"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Açıklama alanı */}
      <div className="form-group">
        <label htmlFor="description">Açıklama</label>
        <textarea
          id="description"
          placeholder=""
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Tamamlandı checkbox (güncellemede faydalı) */}
      <div className="form-group inline">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <span>Tamamlandı</span>
        </label>
      </div>

      {/* Form butonları */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingTodo ? 'Güncelle' : 'Ekle'}
        </button>
        {editingTodo && (
          <button type="button" className="btn btn-outline" onClick={onCancelEdit}>
            İptal
          </button>
        )}
      </div>
    </form>
  )
}


