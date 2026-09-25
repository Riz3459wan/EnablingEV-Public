import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import seoStatic from './vite-plugins/seo-static.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoStatic()],
})
