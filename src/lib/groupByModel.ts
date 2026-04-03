import type { Product } from '../types'

/**
 * Enrich products with colorSiblings and deduplicate by ID.
 * Groups products by model name (from DB relation), enriches each with siblings.
 * Also removes any duplicate IDs that might come from the API.
 */
export function groupByModel(products: Product[]): Product[] {
  // Step 1: Deduplicate by ID
  const seen = new Set<number>()
  const unique: Product[] = []
  for (const p of products) {
    if (seen.has(p.id)) continue
    seen.add(p.id)
    unique.push(p)
  }

  // Step 2: Group by model (from DB relation) for colorSiblings enrichment
  const modelGroups = new Map<string, Product[]>()

  for (const p of unique) {
    const key = p.model && p.model.trim() ? p.model : ''
    if (!key) continue
    const group = modelGroups.get(key) || []
    group.push(p)
    modelGroups.set(key, group)
  }

  return unique.map((p) => {
    const key = p.model && p.model.trim() ? p.model : ''
    if (!key) return p

    const group = modelGroups.get(key)!
    if (group.length <= 1) return p

    const enriched = { ...p }
    enriched.colorSiblings = group
      .filter((sib) => sib.slug !== p.slug)
      .map((sib) => ({
        slug: sib.slug,
        colorName: sib.colorName,
        colorHex: sib.colorHex,
        image: sib.images[0] || '/images/placeholder-shoe.png',
      }))
    return enriched
  })
}
