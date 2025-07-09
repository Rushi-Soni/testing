// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or plugin-react-swc for fast builds

export default defineConfig({
  plugins: [react()],
})
