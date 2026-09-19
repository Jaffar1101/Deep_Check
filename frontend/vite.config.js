import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages: https://jaffar1101.github.io/Deep_Check/
  base: '/Deep_Check/',
})
