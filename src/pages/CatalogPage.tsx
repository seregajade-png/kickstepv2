import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useLocation, useNavigationType, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useProducts } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import { groupByModel } from '../lib/groupByModel'
import ProductCard from '../components/ProductCard'

const SORT_OPTIONS = [
  { key: 'popular', label: 'По популярности' },
  { key: 'price_asc', label: 'По возрастанию цены' },
  { key: 'price_desc', label: 'По убыванию цены' },
  { key: 'new', label: 'Новинки' },
]

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navType = useNavigationType()
  const brandFromUrl = searchParams.get('brand')
  const genderFromUrl = searchParams.get('gender')
  const genderFromPath = location.pathname.startsWith('/men') ? 'men' : location.pathname.startsWith('/women') ? 'women' : null
  const effectiveGender = genderFromPath || genderFromUrl || undefined

  const [sortBy, setSortBy] = useState('popular')
  const [sortOpen, setSortOpen] = useState(false)
  const itemsPerPage = 8

  const storageKey = `catalog_page_${brandFromUrl || 'all'}`
  const [page, setPageState] = useState(() => {
    if (navType === 'POP') {
      const saved = sessionStorage.getItem(storageKey)
      return saved ? parseInt(saved, 10) : 1
    }
    return 1
  })
  const setPage = (v: number | ((p: number) => number)) => {
    setPageState((prev) => {
      const next = typeof v === 'function' ? v(prev) : v
      sessionStorage.setItem(storageKey, String(next))
      return next
    })
  }

  const catalogCacheKey = `catalog_cache_${brandFromUrl || ''}|${effectiveGender || ''}|${sortBy}`
  const [accumulated, setAccumulated] = useState<ReturnType<typeof mapApiProduct>[]>(() => {
    if (navType === 'POP') {
      try {
        const cached = sessionStorage.getItem(catalogCacheKey)
        if (cached) return JSON.parse(cached)
      } catch { /* ignore */ }
    }
    return []
  })
  const prevKeyRef = useRef('')
  const restoredFromCache = useRef(navType === 'POP' && accumulated.length > 0)

  useEffect(() => {
    if (accumulated.length > 0) {
      try { sessionStorage.setItem(catalogCacheKey, JSON.stringify(accumulated)) } catch { /* ignore */ }
    }
  }, [accumulated, catalogCacheKey])

  const { data, isLoading } = useProducts({
    brand: brandFromUrl || undefined,
    gender: effectiveGender || undefined,
    sort: sortBy,
    page,
    pageSize: itemsPerPage,
  })

  const queryKey = `${brandFromUrl}|${effectiveGender}|${sortBy}|${itemsPerPage}`
  useEffect(() => {
    if (queryKey !== prevKeyRef.current) { prevKeyRef.current = queryKey; setPageState(1) }
  }, [queryKey])

  useEffect(() => {
    if (!data?.data) return
    if (restoredFromCache.current) { restoredFromCache.current = false; return }
    const newProducts = data.data.map(mapApiProduct)
    if (page === 1) { setAccumulated(newProducts) }
    else {
      setAccumulated(prev => {
        const ids = new Set(prev.map(p => p.id))
        const toAdd = newProducts.filter(p => !ids.has(p.id))
        return toAdd.length > 0 ? [...prev, ...toAdd] : prev
      })
    }
  }, [data, page])

  const products = groupByModel(accumulated)
  const total = data?.meta?.pagination?.total || 0
  const hasMore = accumulated.length < total
  const showSkeleton = isLoading && accumulated.length === 0
  const currentSort = SORT_OPTIONS.find(s => s.key === sortBy)

  return (
    <>
      <Helmet><title>Каталог — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <Link to="/" className="hover:text-black transition">Главная</Link>
          <span>/</span>
          <span className="text-black">Каталог</span>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Каталог</h1>

        <div className="flex gap-0 mb-4 border-b border-gray-300">
          {[{ key: undefined, label: 'Кроссовки' }, { key: 'women', label: 'Женское' }].map((tab) => (
            <button key={tab.label} onClick={() => { if (tab.key) searchParams.set('gender', tab.key); else searchParams.delete('gender'); setSearchParams(searchParams) }}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${effectiveGender === tab.key ? 'border-black text-black' : 'border-transparent text-gray-400'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-1.5 text-sm"><SlidersHorizontal size={18} /> Фильтры</button>
          <div className="relative">
            <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1 text-sm text-gray-600">
              {currentSort?.label}<ChevronDown size={16} className={`transition ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-[14px] shadow-lg z-20 min-w-[200px]">
                {SORT_OPTIONS.map((opt) => (
                  <button key={opt.key} onClick={() => { setSortBy(opt.key); setSortOpen(false) }}
                    className={`w-full text-left px-4 py-3 text-sm transition first:rounded-t-[14px] last:rounded-b-[14px] ${sortBy === opt.key ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {showSkeleton ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}><div className="aspect-square animate-pulse bg-gray-100 rounded-[14px]" /><div className="mt-2 h-3 w-3/4 animate-pulse bg-gray-100 rounded" /></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20"><p className="text-base text-gray-600">Товары не найдены</p></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (<ProductCard key={product.id} product={product} showCartButton />))}
          </div>
        )}

        {hasMore && (
          <button onClick={() => { if (!isLoading) setPage(p => p + 1) }} disabled={isLoading}
            className="w-full mt-6 py-3 text-sm font-semibold border border-gray-300 rounded-[24px] hover:bg-black hover:text-white hover:border-black transition disabled:opacity-50">
            {isLoading ? 'Загрузка...' : 'Смотреть ещё'}
          </button>
        )}
      </div>
    </>
  )
}
