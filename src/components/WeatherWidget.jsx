import { useState } from 'react'
import { getTemperature } from '../services/weatherService'

// Basit hava durumu bileşeni: Konum gir, sıcaklık değerini göster
export default function WeatherWidget() {
  // Form state'leri
  const [location, setLocation] = useState('Istanbul')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sıcaklık verisini backend üzerinden çeker
  const handleFetch = async (e) => {
    e.preventDefault()
    if (!location) return
    try {
      setLoading(true)
      setError('')
      setResult(null)
      // Axios ile GET isteği, proxy üzerinden backend'e gider
      const data = await getTemperature(location)
      // Backend iki şekilde dönebilir: sadece sayı veya bir nesne
      const temp = typeof data === 'number' ? data : data?.temperature ?? data?.temp_c ?? null
      if (temp === null) {
        setError('Geçersiz yanıt alındı.')
      } else {
        setResult(temp)
      }
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Bilinmeyen hata'
      setError(`Hava durumu alınamadı: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card" style={{ gridColumn: '1 / -1' }}>
      {/* Başlık */}
      <div className="card-header">
        <h2>Hava Durumu Testi</h2>
      </div>

      {/* Konum girişi ve getir butonu */}
      <form className="form" onSubmit={handleFetch}>
        <div className="form-group">
          <label htmlFor="weather-location">Konum</label>
          <input
            id="weather-location"
            type="text"
            placeholder="Örn: Istanbul"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Yükleniyor...' : 'Getir'}
          </button>
        </div>
      </form>

      {/* Sonuç ve hata alanı */}
      {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
      {result !== null && !error && (
        <div className="info" style={{ marginTop: 8 }}>
          Sıcaklık: <strong>{result}°C</strong>
        </div>
      )}
    </section>
  )
}


