import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const isVercel = process.env.VERCEL === '1'
const outDir = isVercel ? 'dist' : 'docs'

const spaFallbackPlugin = () => ({
  name: 'spa-404-fallback',
  closeBundle() {
    const indexPath = resolve(outDir, 'index.html')
    writeFileSync(resolve(outDir, '404.html'), readFileSync(indexPath))
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: isVercel ? '/' : '/wandr/',
  build: {
    outDir,
  },
  plugins: [react(), tailwindcss(), spaFallbackPlugin()],
})
