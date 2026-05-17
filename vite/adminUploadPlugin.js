import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.resolve(__dirname, '../public/uploads')
const MAX_BYTES = 5 * 1024 * 1024

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
])

const MIME_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
}

function attachUploadMiddleware(server) {
  server.middlewares.use('/api/admin/upload', (req, res, next) => {
    if (req.method !== 'POST') {
      next()
      return
    }

    /** @type {Buffer[]} */
    const chunks = []
    let total = 0

    req.on('data', (chunk) => {
      total += chunk.length
      if (total > MAX_BYTES + 512_000) {
        res.statusCode = 413
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Payload too large' }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })

    req.on('end', async () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        const body = JSON.parse(raw)
        const filename = typeof body.filename === 'string' ? body.filename : 'image'
        const mime = typeof body.mime === 'string' ? body.mime : 'image/jpeg'
        const data = typeof body.data === 'string' ? body.data : ''

        if (!ALLOWED_MIME.has(mime)) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Unsupported image type' }))
          return
        }

        const buffer = Buffer.from(data, 'base64')
        if (!buffer.length || buffer.length > MAX_BYTES) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Invalid or oversized image' }))
          return
        }

        await fs.mkdir(UPLOADS_DIR, { recursive: true })

        const base = path
          .basename(filename, path.extname(filename))
          .replace(/[^a-zA-Z0-9._-]+/g, '-')
          .slice(0, 48)
        const ext = path.extname(filename).toLowerCase() || MIME_EXT[mime] || '.jpg'
        const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)
          ? ext === '.jpeg'
            ? '.jpg'
            : ext
          : MIME_EXT[mime] || '.jpg'
        const outName = `${Date.now()}-${randomBytes(4).toString('hex')}-${base || 'image'}${safeExt}`
        const outPath = path.join(UPLOADS_DIR, outName)

        await fs.writeFile(outPath, buffer)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ url: `/uploads/${outName}` }))
      } catch (err) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            error: err instanceof Error ? err.message : 'Upload failed',
          }),
        )
      }
    })

    req.on('error', () => {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Upload stream error' }))
    })
  })
}

/** Saves admin uploads to `public/uploads` during dev and preview. */
export function adminUploadPlugin() {
  return {
    name: 'admin-upload',
    configureServer(server) {
      attachUploadMiddleware(server)
    },
    configurePreviewServer(server) {
      attachUploadMiddleware(server)
    },
  }
}
