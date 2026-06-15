import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/react-task-tracker-pro/', // ← ITHU ADD CHEYYANAM
  plugins: [react()],
})
