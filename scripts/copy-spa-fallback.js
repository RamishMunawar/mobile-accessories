import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const index = join(process.cwd(), 'dist', 'index.html')
const fallback = join(process.cwd(), 'dist', '404.html')

if (!existsSync(index)) {
  console.error('copy-spa-fallback: dist/index.html missing — run vite build first')
  process.exit(1)
}

copyFileSync(index, fallback)
console.log('copy-spa-fallback: wrote dist/404.html for SPA routing')
