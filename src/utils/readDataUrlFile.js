/** @param {File} file @param {number} [maxBytes] */
export function readFileAsDataUrl(file, maxBytes = 900_000) {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error('File too large — use a smaller image or paste an image URL.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsDataURL(file)
  })
}
