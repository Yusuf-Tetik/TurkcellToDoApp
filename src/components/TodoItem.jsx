// Tek bir todo öğesini temsil eden bileşen
// Güncelle, durum değiştir ve sil işlemleri için butonlar içerir
export default function TodoItem({ todo, onEdit, onToggleStatus, onDelete }) {
  // JSX: Tablo satırı olarak todo bilgilerini gösteriyoruz
  const normalizedStatus = String(todo.status || '').toUpperCase()
  const isCompleted = Boolean(
    todo.completed ||
    todo.done ||
    normalizedStatus === 'DONE' ||
    normalizedStatus === 'COMPLETED'
  )

  const priority = String(todo.priority || 'LOW').toUpperCase()
  let deadlineText = '-'
  try {
    if (todo.deadline) {
      const d = new Date(todo.deadline)
      if (isFinite(d)) {
        deadlineText = d.toLocaleString()
      }
    }
  } catch { /* ignore */ }

  const tags = Array.isArray(todo.tag) ? todo.tag.join(', ') : '-'

  return (
    <tr>
      <td>{todo.title}</td>
      <td className="muted">{todo.description}</td>
      <td>
        <span className={isCompleted ? 'badge badge-success' : 'badge badge-warning'}>
          {isCompleted ? 'Done' : 'Not Done'}
        </span>
      </td>
      <td>{priority}</td>
      <td className="muted">{deadlineText}</td>
      <td className="muted">{tags}</td>
      <td className="actions">
        <button className="btn btn-secondary" onClick={() => onEdit(todo)}>
          Düzenle
        </button>
        <button className="btn btn-outline" onClick={() => onToggleStatus(todo.id)}>
          Durum Değiştir
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(todo.id)}>
          Sil
        </button>
      </td>
    </tr>
  )
}


