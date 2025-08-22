import { useMemo, useState } from 'react'
import TodoItem from './TodoItem'

// Tüm todoları listeleyen bileşen
export default function TodoList({ todos, onEdit, onToggleStatus, onDelete }) {
  // Boş liste durumu
  if (!todos || todos.length === 0) {
    return (
      <div className="empty-card">
        <div className="empty-icon" aria-hidden>🗒️</div>
        <h3 className="empty-title">Hiç todo bulunamadı</h3>
        <p className="empty-subtitle">Yapmanız gerekenleri ekleyerek başlayın.</p>
      </div>
    )
  }

  const [sort, setSort] = useState({ key: null, dir: 'asc' })

  const handleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      }
      return { key, dir: 'asc' }
    })
  }

  const sortedTodos = useMemo(() => {
    if (!Array.isArray(todos)) return []
    const withIndex = todos.map((t, i) => ({ t, i }))
    const now = Date.now()
    const priorityRank = { LOW: 0, MEDIUM: 1, HIGH: 2 }

    const compare = (a, b) => {
      if (!sort.key) return a.i - b.i
      const dir = sort.dir === 'asc' ? 1 : -1
      const at = a.t
      const bt = b.t
      switch (sort.key) {
        case 'status': {
          const as = String(at.status || '').toUpperCase()
          const bs = String(bt.status || '').toUpperCase()
          const aDone = Boolean(at.completed || at.done || as === 'DONE' || as === 'COMPLETED')
          const bDone = Boolean(bt.completed || bt.done || bs === 'DONE' || bs === 'COMPLETED')
          if (aDone === bDone) return a.i - b.i
          // asc: Done first, desc: Not Done first
          if (sort.dir === 'asc') {
            return aDone ? -1 : 1
          }
          return aDone ? 1 : -1
        }
        case 'title': {
          const av = String(at.title || '')
          const bv = String(bt.title || '')
          const r = av.localeCompare(bv)
          return r !== 0 ? r * dir : a.i - b.i
        }
        case 'description': {
          const av = String(at.description || '')
          const bv = String(bt.description || '')
          const r = av.localeCompare(bv)
          return r !== 0 ? r * dir : a.i - b.i
        }
        case 'tag': {
          const av = Array.isArray(at.tag) ? at.tag.join(', ') : String(at.tag || '')
          const bv = Array.isArray(bt.tag) ? bt.tag.join(', ') : String(bt.tag || '')
          const r = av.localeCompare(bv)
          return r !== 0 ? r * dir : a.i - b.i
        }
        case 'priority': {
          const av = priorityRank[String(at.priority || 'LOW').toUpperCase()] ?? 0
          const bv = priorityRank[String(bt.priority || 'LOW').toUpperCase()] ?? 0
          if (av === bv) return a.i - b.i
          return av < bv ? 1 * dir : -1 * dir
        }
        case 'deadline': {
          const ad = at.deadline ? new Date(at.deadline).getTime() : NaN
          const bd = bt.deadline ? new Date(bt.deadline).getTime() : NaN
          const adist = isFinite(ad) ? Math.abs(ad - now) : Number.POSITIVE_INFINITY
          const bdist = isFinite(bd) ? Math.abs(bd - now) : Number.POSITIVE_INFINITY
          if (adist === bdist) return a.i - b.i
          return adist < bdist ? 1 * dir : -1 * dir
        }
        default:
          return a.i - b.i
      }
    }

    return withIndex.sort(compare).map(({ t }) => t)
  }, [todos, sort])

  const indicator = (key) => {
    if (sort.key !== key) return ' ↕'
    return sort.dir === 'asc' ? ' ▲' : ' ▼'
  }

  // JSX: Modern bir tablo ile todoları gösteriyoruz
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }} aria-sort={sort.key === 'title' ? sort.dir : 'none'} title="Sıralamak için tıklayın (tekrar tıklayınca yön değişir)">Başlık{indicator('title')}</th>
            <th onClick={() => handleSort('description')} style={{ cursor: 'pointer' }} aria-sort={sort.key === 'description' ? sort.dir : 'none'} title="Sıralamak için tıklayın (tekrar tıklayınca yön değişir)">Açıklama{indicator('description')}</th>
            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }} aria-sort={sort.key === 'status' ? sort.dir : 'none'} title="Sıralamak için tıklayın (tekrar tıklayınca yön değişir)">Durum{indicator('status')}</th>
            <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }} aria-sort={sort.key === 'priority' ? sort.dir : 'none'} title="Sıralamak için tıklayın (tekrar tıklayınca yön değişir)">Öncelik{indicator('priority')}</th>
            <th onClick={() => handleSort('deadline')} style={{ cursor: 'pointer' }} aria-sort={sort.key === 'deadline' ? sort.dir : 'none'} title="Sıralamak için tıklayın (tekrar tıklayınca yön değişir)">Son Tarih{indicator('deadline')}</th>
            <th onClick={() => handleSort('tag')} style={{ cursor: 'pointer' }} aria-sort={sort.key === 'tag' ? sort.dir : 'none'} title="Sıralamak için tıklayın (tekrar tıklayınca yön değişir)">Etiketler{indicator('tag')}</th>
            <th>Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}


