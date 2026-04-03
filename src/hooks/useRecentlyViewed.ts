import { useEffect, useState } from 'react'

const STORAGE_KEY = 'snykers_recently_viewed'
const MAX_ITEMS = 12

interface RecentItem {
  slug: string
  viewedAt: number
}

export function addToRecentlyViewed(slug: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const items: RecentItem[] = raw ? JSON.parse(raw) : []
    const filtered = items.filter((i) => i.slug !== slug)
    filtered.unshift({ slug, viewedAt: Date.now() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)))
  } catch {
    // ignore
  }
}

export function useRecentlyViewedSlugs(excludeSlug?: string): string[] {
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const items: RecentItem[] = raw ? JSON.parse(raw) : []
      setSlugs(
        items
          .filter((i) => i.slug !== excludeSlug)
          .map((i) => i.slug)
          .slice(0, 4)
      )
    } catch {
      // ignore
    }
  }, [excludeSlug])

  return slugs
}
