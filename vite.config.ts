import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    // Drawing Photo Studio などが 5173 を使うため、SimpleNote 専用ポートに固定
    port: 5280,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 5280,
    strictPort: true,
    host: true,
  },
})
