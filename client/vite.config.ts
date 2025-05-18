import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: {
      origin: true,  // This allows all origins
      credentials: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8008',
        changeOrigin: true,
        secure: false
      }
    }
  }
})