import { readFileAsDataUrl } from './readDataUrlFile'

const UPLOAD_MAX_BYTES = 5 * 1024 * 1024
const DATA_URL_FALLBACK_MAX = 900_000

/**
 * Uploads an admin image to `public/uploads` via the Vite dev/preview API.
 * Falls back to a data URL when the API is unavailable (e.g. static hosting).
 * @param {File} file
 * @param {number} [maxBytes]
 * @returns {Promise<string>} Public path like `/uploads/...` or a data URL
 */
export async function uploadAdminImage(file, maxBytes = UPLOAD_MAX_BYTES) {
  if (file.size > maxBytes) {
    throw new Error('File too large — use a smaller image (max 5 MB) or paste an image URL.')
  }

  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }
  const data = btoa(binary)

  try {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        mime: file.type || 'image/jpeg',
        data,
      }),
    })

    if (res.ok) {
      const payload = await res.json()
      if (payload?.url && typeof payload.url === 'string') {
        return payload.url
      }
    }
  } catch {
    // Static deploy or API unavailable — use embedded data URL below.
  }

  if (file.size > DATA_URL_FALLBACK_MAX) {
    throw new Error(
      'Could not save to public/uploads. Run `npm run dev` to enable file uploads, or use a smaller image / image URL.',
    )
  }

  return readFileAsDataUrl(file, DATA_URL_FALLBACK_MAX)
}
