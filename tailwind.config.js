/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        turkcell: {
          navy: '#003366',
          yellow: '#FFD700',
          white: '#FFFFFF',
        },
      },
      boxShadow: {
        card: '0 10px 25px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
}
