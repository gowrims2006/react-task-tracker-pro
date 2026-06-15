import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isGitHubPages = command === 'build'
  return {
    base: isGitHubPages ? '/react-task-tracker-pro/' : '/',
    plugins: [react()],
  }
})