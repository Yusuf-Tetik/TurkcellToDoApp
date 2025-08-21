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
    // Alternatif: path param denemesi
    try {
      const response2 = await api.get(`/weather/${encodeURIComponent(location)}`)
      return response2.data
    } catch (err2) {
      console.error('Hava durumu path denemesi de başarısız', err2)
      throw err2
    }
  }
}

export default { getTemperature }


