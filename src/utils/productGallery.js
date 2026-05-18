/** @param {string[] | undefined} gallery @param {string} [mainImage] */
export function productGalleryList(gallery, mainImage) {
  const fromGallery = Array.isArray(gallery) ? gallery.map((s) => String(s).trim()).filter(Boolean) : []
  if (fromGallery.length) return fromGallery
  return mainImage?.trim() ? [mainImage.trim()] : []
}

/** @param {import('../data/products').Product} product @param {string} imageUrl */
export function patchProductMainImage(product, imageUrl) {
  const url = imageUrl.trim()
  const existing = productGalleryList(product.gallery, product.image)
  const gallery = existing.length ? [url, ...existing.filter((s) => s !== url).slice(1)] : [url]
  return { image: url, gallery }
}

