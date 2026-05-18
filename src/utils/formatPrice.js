/** Storefront currency — Pakistani Rupee (AliExpress-style: PKR589.4). */
export const CURRENCY_CODE = 'PKR'

/**
 * @param {number} amount
 * @returns {string} e.g. PKR589.4, PKR1,380.71
 */
export function formatPrice(amount) {
  const n = Number(amount)
  if (!Number.isFinite(n)) return `${CURRENCY_CODE}0`

  const formatted = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)

  return `${CURRENCY_CODE}${formatted}`
}
