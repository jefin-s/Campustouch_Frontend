import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss()
  ],
  // Base path is '/' for local dev and custom domains.
  // The CI/CD pipeline sets VITE_BASE_URL to the GitHub Pages sub-path.
  base: process.env.VITE_BASE_URL || '/',
})
