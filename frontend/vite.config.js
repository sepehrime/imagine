import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Where /api requests are forwarded. Defaults to the local FastAPI server;
// the E2E tests point it at their own isolated backend (API_TARGET=...:8765).
const API_TARGET = process.env.API_TARGET ?? 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Unit tests live next to the code they test; Playwright E2E specs live in e2e/
  test: {
    include: ['src/**/*.test.js'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/health': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
})
