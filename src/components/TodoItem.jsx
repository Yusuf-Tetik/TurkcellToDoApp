// Tek bir todo öğesini temsil eden bileşen
// Güncelle, durum değiştir ve sil işlemleri için butonlar içerir
export default function TodoItem({ todo, onEdit, onToggleStatus, onDelete }) {
  // JSX: Tablo satırı olarak todo bilgilerini gösteriyoruz
  const isCompleted = Boolean(todo.completed || todo.status === 'COMPLETED' || todo.done)

  return (
    <tr>
      <td>{todo.title}</td>
      <td className="muted">{todo.description}</td>
      <td>
        <span className={isCompleted ? 'badge badge-success' : 'badge badge-warning'}>
          {isCompleted ? 'Tamamlandı' : 'Bekliyor'}
        </span>
      </td>
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


