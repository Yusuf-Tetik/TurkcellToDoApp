import TodoItem from './TodoItem'

// Tüm todoları listeleyen bileşen
export default function TodoList({ todos, onEdit, onToggleStatus, onDelete }) {
  // Boş liste durumu
  if (!todos || todos.length === 0) {
    return <div className="empty">Hiç todo bulunamadı.</div>
  }

  // JSX: Modern bir tablo ile todoları gösteriyoruz
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Açıklama</th>
            <th>Durum</th>
            <th>Öncelik</th>
            <th>Son Tarih</th>
            <th>Etiketler</th>
            <th>Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
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


