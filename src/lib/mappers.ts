import type { Product, ColorSibling, Size } from '../types'
import type { ApiProduct } from './api'
import { getImageUrls, getImageUrlsSmall } from './api'
import { euToRu, euToUs } from './sizeConversion'

/**
 * Make price "uneven" — round to nearest X90 or X90
 */
function makeUnevenPrice(raw: number): number {
  const base = Math.round(raw / 100) * 100
  // End in 90 (e.g. 14990, 15490, 16990)
  return base - 10
}

/**
 * Generate a stable pseudo-random number from product id for consistent oldPrice
 */
function stableRandom(id: number): number {
  // Simple hash: consistent per product
  const x = Math.sin(id * 9301 + 49297) * 233280
  return x - Math.floor(x) // 0..1
}

const MARGIN = 12000

/**
 * Convert Strapi ApiProduct to frontend Product type
 */
export function mapApiProduct(p: ApiProduct): Product {
  // Map sizes from repeatable component → conversion table
  const sizes: Size[] = (p.sizes || []).map((s) => ({
    eu: String(s.size_eu),
    us: euToUs(s.size_eu),
    ru: euToRu(s.size_eu),
    inStock: s.in_stock !== false,
  }))

  // Map color siblings
  const colorSiblings: ColorSibling[] = (p.color_siblings || []).map((sib) => ({
    slug: sib.slug,
    colorName: sib.color_name || '',
    colorHex: sib.color_hex || '',
    image: getImageUrls(sib.images)?.[0] || '/images/placeholder-shoe.png',
  }))

  const images = getImageUrls(p.images)
  if (images.length === 0) images.push('/images/placeholder-shoe.png')
  const thumbImages = getImageUrlsSmall(p.images)
  if (thumbImages.length === 0) thumbImages.push('/images/placeholder-shoe.png')

  const decodeHtml = (s: string) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'")

  // Strip brand prefix from product name to avoid "Adidas Yeezy..." when brand is "Adidas"
  let productName = decodeHtml(p.name || '')
  const brandName = decodeHtml(p.brand?.name || '')
  if (brandName && productName.toLowerCase().startsWith(brandName.toLowerCase() + ' ')) {
    productName = productName.slice(brandName.length + 1)
  }

  // Price: base from DB + margin, made uneven
  const basePrice = makeUnevenPrice(p.price + MARGIN)
  // Old price: artificial markup 5-20% above our price (stable per product)
  const discountPct = 5 + stableRandom(p.id) * 15 // 5% to 20%
  const oldPrice = makeUnevenPrice(Math.round(basePrice / (1 - discountPct / 100)))

  return {
    id: p.id,
    name: productName,
    slug: p.slug,
    brand: brandName,
    model: decodeHtml(p.model?.name || ''),
    price: basePrice,
    oldPrice,
    images,
    thumbImages,
    colorName: p.color_name || '',
    colorHex: p.color_hex || '',
    colorSiblings,
    sizes,
    badge: p.badge === 'none' ? undefined : p.badge,
    description: p.description || undefined,
    gender: p.gender || 'unisex',
  }
}
