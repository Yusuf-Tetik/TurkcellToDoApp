import { useEffect, useState } from 'react'

// Yeni todo ekleme ve mevcut todo'yu güncelleme formu
export default function TodoForm({ editingTodo, onCreate, onUpdate, onCancelEdit }) {
  // Form state'lerini tanımlıyoruz
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [completed, setCompleted] = useState(false)
  const [status, setStatus] = useState('NOT_DONE')
  const [priority, setPriority] = useState('LOW')
  const [deadline, setDeadline] = useState('') // datetime-local format
  const [tags, setTags] = useState('') // virgül (,) ile ayrılmış etiketler

  // editingTodo değiştiğinde formu dolduruyoruz
  useEffect(() => {
    // Eğer düzenleme modundaysak mevcut değerleri forma set et
    if (editingTodo) {
      setTitle(editingTodo.title || '')
      setDescription(editingTodo.description || '')
      setCompleted(Boolean(editingTodo.completed || editingTodo.status === 'COMPLETED' || editingTodo.done))
      setStatus(String(editingTodo.status || '').toUpperCase() || 'NOT_DONE')
      setPriority(String(editingTodo.priority || 'LOW').toUpperCase())
      // deadline ISO ise datetime-local' a çevir (YYYY-MM-DDTHH:mm)
      try {
        if (editingTodo.deadline) {
          const d = new Date(editingTodo.deadline)
          if (isFinite(d)) {
            const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,16)
            setDeadline(iso)
          } else {
            setDeadline('')
          }
        } else {
          setDeadline('')
        }
      } catch { setDeadline('') }
      const existingTags = Array.isArray(editingTodo.tag) ? editingTodo.tag.join(', ') : ''
      setTags(existingTags)
    } else {
      // Yeni kayıt için formu temizle
      setTitle('')
      setDescription('')
      setCompleted(false)
      setStatus('NOT_DONE')
      setPriority('LOW')
      setDeadline('')
      setTags('')
    }
  }, [editingTodo])

  // Form submit işlemi: yeni ekleme veya güncelleme yapar
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Yeni oluşturma için çoğu backend sadece title & description bekler
    const isoDeadline = deadline ? new Date(deadline).toISOString() : undefined
    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const base = { title, description, status, priority, deadline: isoDeadline, tag: tagArray }

    // Düzenleme modunda ise güncelleme, değilse ekleme
    if (editingTodo) {
      const payload = { ...base }
      // completed alanı eski backendlerle uyum için tutuluyor, ama göndermek zorunlu değil
      if (typeof completed === 'boolean') payload.completed = completed
      onUpdate(editingTodo.id, payload)
    } else {
      const ok = await onCreate(base)
      if (ok) {
        // formu resetle
        setTitle('')
        setDescription('')
        setCompleted(false)
        setStatus('NOT_DONE')
        setPriority('LOW')
        setDeadline('')
        setTags('')
      }
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
          placeholder="Örn: Turkcell"
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
          placeholder="Örn: Turkcell'de işe gir"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
      </div>

      {/* Durum ve Öncelik */}
      <div className="form-group inline">
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="status">Durum</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              className={status === 'NOT_DONE' ? 'btn btn-secondary' : 'btn btn-outline'}
              onClick={() => setStatus('NOT_DONE')}
              aria-pressed={status === 'NOT_DONE'}
              title="Not Done"
            >
              ✗ Not Done
            </button>
            <button
              type="button"
              className={status === 'DONE' ? 'btn btn-secondary' : 'btn btn-outline'}
              onClick={() => setStatus('DONE')}
              aria-pressed={status === 'DONE'}
              title="Done"
            >
              ✓ Done
            </button>
          </div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="priority">Öncelik</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* Son tarih */}
      <div className="form-group">
        <label htmlFor="deadline">Son Tarih</label>
        <input
          id="deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>

      {/* Etiketler */}
      <div className="form-group">
        <label htmlFor="tags">Etiketler</label>
        <input
          id="tags"
          type="text"
          placeholder="Örn: iş, önemli"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {/* Tamamlandı checkbox (güncellemede faydalı) */}
      {false && (
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
      )}

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


