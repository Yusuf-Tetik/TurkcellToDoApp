import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Geliştirmede CORS sorununu aşmak için proxy kullanıyoruz
  server: {
    proxy: {
      // Todo & Weather gibi /api/* kullanan servisler
      '/api': {
        target: 'http://localhost:8080', // Spring Boot backend
        changeOrigin: true,
        secure: false,
      },
      // Auth servisleri kök path'te olabilir: /register, /login, /userById, /all-users
      '/register': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/userById': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/all-users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
