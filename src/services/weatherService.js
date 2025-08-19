import axios from 'axios'

// Weather API için axios örneği
// Not: Vite proxy ile '/api' -> 'http://localhost:8080' yönlenir
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Konuma göre sıcaklık bilgisi alır (°C)
// Türkçe açıklama: Backend'inizde endpoint farklı olabilir.
// Varsayılan olarak GET /weather?location=... kullanıyoruz.
// Eğer controller /weather/{location} biçiminde ise aşağıdaki alternatifi deneyebilirsiniz.
export const getTemperature = async (location) => {
  // Önce query param ile deneriz
  try {
    const response = await api.get('/weather', { params: { location } })
    return response.data
  } catch (err) {
    console.error('Hava durumu alınamadı', err)
    throw err
  }
}

export default { getTemperature }


