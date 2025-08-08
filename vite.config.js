import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.', // raíz en carpeta actual (opcional, por defecto así)
  base: './', // base para build (útil si vas a servir estáticos desde subcarpeta)
  server: {
    port: 5173,
  },
})
