import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚙️ Cambia '/ia-text-reviewer/' si tu repo tiene otro nombre
export default defineConfig({
  plugins: [react()],
  base: '/ia-text-reviewer/',
})
