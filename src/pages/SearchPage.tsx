import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useProducts } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import ProductCard from '../components/ProductCard'
import { useIsDesktop } from '../hooks/useMediaQuery'

const FM = "'Involve-Medium', Helvetica"
const FR = "'Involve-Regular', Helvetica"

const popularSearches = ['nike', 'adidas', 'balenciaga']

// Levenshtein distance — small helper for typo-tolerant search
function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const m = a.length, n = b.length
  let prev = new Array(n + 1).fill(0)
  let curr = new Array(n + 1).fill(0)
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[n]
}

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase().trim()
  const t = text.toLowerCase()
  if (!q) return false
  if (t.includes(q)) return true
  // Allowed typos: 1 for short queries, up to floor(len/4)
  const maxDist = Math.max(1, Math.floor(q.length / 4))
  // Sliding window over text, comparing substrings of length q.length ± maxDist
  const tokens = t.split(/\s+/)
  for (const tok of tokens) {
    if (tok.startsWith(q.slice(0, 2))) {
      if (levenshtein(q, tok.slice(0, q.length + maxDist)) <= maxDist) return true
    }
    if (Math.abs(tok.length - q.length) <= maxDist && levenshtein(q, tok) <= maxDist) return true
  }
  return false
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()

  // Fetch a wide product set; we filter locally so typos still match
  const { data, isLoading } = useProducts(query.length >= 2 ? { pageSize: 200 } : undefined)
  const allProducts = query.length >= 2 ? (data?.data || []).map(mapApiProduct) : []
  const results = query.length >= 2
    ? allProducts.filter((p: any) => {
        const haystack = `${p.brand || ''} ${p.name || ''} ${p.colorName || ''}`
        return fuzzyMatch(query, haystack)
      })
    : []

  const containerStyle = isDesktop
    ? { width: '80rem', maxWidth: '100%', margin: '0 auto', padding: '0 2.5rem' }
    : {}

  return (
    <>
      <Helmet><title>Поиск — SNEAKER MOSCOW</title></Helmet>
      <div style={containerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderBottom: '0.0625rem solid #D1D1D1' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск" autoFocus
            style={{ flex: 1, fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#0A0A0A', background: 'none', border: 'none', outline: 'none', padding: 0 }} />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>

        {query.length < 2 ? (
          <div style={{ padding: '0 1rem' }}>
            {popularSearches.map((term) => (
              <button key={term} onClick={() => setQuery(term)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                padding: '0.875rem 0', background: 'none', border: 'none', borderBottom: '0.0625rem solid #F4F4F4', cursor: 'pointer', textAlign: 'left',
              }}>
                <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.9375rem', color: '#0A0A0A' }}>{term}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B5B5B5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
            ))}
          </div>
        ) : isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem' }}>
            <div style={{ width: '1.5rem', height: '1.5rem', border: '0.125rem solid #0A0A0A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : results.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', gap: '1rem', padding: '1rem' }}>
            {results.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
            <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#6E6E6E' }}>Ничего не найдено по запросу «{query}»</p>
          </div>
        )}
      </div>
    </>
  )
}
