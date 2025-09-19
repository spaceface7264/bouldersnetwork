import { copyFile } from 'fs/promises'
import { resolve } from 'path'

const distDir = resolve('dist')
const source = resolve(distDir, 'index.html')
const destination = resolve(distDir, '404.html')

try {
  await copyFile(source, destination)
  console.log('[deploy] Copied index.html to 404.html for SPA fallback')
} catch (error) {
  console.error('[deploy] Unable to create 404.html fallback', error)
  process.exit(1)
}
