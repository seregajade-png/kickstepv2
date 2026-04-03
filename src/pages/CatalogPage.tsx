import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams, useLocation, useNavigationType } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useProducts } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import { groupByModel } from '../lib/groupByModel'
import ProductCard from '../components/ProductCard'

const CATALOG_SECTIONS: { key: string; label: string; brand?: string; search?: string }[] = [
  { key: 'nike-travis', label: 'Nike Travis', search: 'travis' },
  { key: 'golden-goose', label: 'Golden Goose', brand: 'golden-goose' },
  { key: 'balenciaga', label: 'Balenciaga', brand: 'balenciaga' },
  { key: 'yeezy-350', label: 'Yeezy 350', search: 'yeezy boost 350' },
  { key: 'yeezy-500', label: 'Yeezy 500', search: 'yeezy 500' },
  { key: 'jordan-1', label: 'Jordan 1', search: 'jordan 1|jordan 6' },
  { key: 'jordan-4', label: 'Jordan 4', search: 'jordan 4' },
  { key: 'nike-dunk', label: 'Nike Dunk', search: 'dunk' },
  { key: 'adidas-samba', label: 'Adidas Samba', search: 'samba' },
  { key: 'miu-miu', label: 'Miu Miu', brand: 'miu-miu' },
  { key: 'new-balance', label: 'New Balance', brand: 'new-balance' },
]

const SORT_OPTIONS = [
  { key: 'popular', label: 'Популярные' },
  { key: 'price_asc', label: 'Дешевле' },
  { key: 'price_desc', label: 'Дороже' },
  { key: 'new', label: 'Новинки' },
]

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navType = useNavigationType()
  const sectionFromUrl = searchParams.get('section')
  const brandFromUrl = searchParams.get('brand')
  const genderFromUrl = searchParams.get('gender')

  const genderFromPath = location.pathname.startsWith('/men') ? 'men' : location.pathname.startsWith('/women') ? 'women' : null
  const effectiveGender = genderFromPath || genderFromUrl || undefined

  const [activeSection, setActiveSectionState] = useState<string | null>(sectionFromUrl || brandFromUrl)
  const [sortBy, setSortBy] = useState('popular')
  const [sortOpen, setSortOpen] = useState(false)
  const itemsPerPage = 8

  const setActiveSection = (sectionKey: string | null) => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    setActiveSectionState(sectionKey)
    setPageState(1)
    if (sectionKey) {
      setSearchParams({ section: sectionKey })
    } else {
      setSearchParams({})
    }
  }

  const currentSection = CATALOG_SECTIONS.find((s) => s.key === activeSection)
  const effectiveBrand = currentSection?.brand || (activeSection && !currentSection ? activeSection : undefined) || brandFromUrl || undefined
  const effectiveSearch = currentSection && 'search' in currentSection ? currentSection.search : undefined

  const storageKey = `catalog_page_${activeSection || 'all'}`
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

  const catalogCacheKey = `catalog_cache_${effectiveBrand || ''}|${effectiveSearch || ''}|${effectiveGender || ''}|${sortBy}`
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
    brand: effectiveBrand,
    search: effectiveSearch,
    gender: effectiveGender || undefined,
    sort: sortBy,
    page,
    pageSize: itemsPerPage,
  })

  const queryKey = `${effectiveBrand}|${effectiveSearch}|${effectiveGender}|${sortBy}|${itemsPerPage}`

  useEffect(() => {
    if (queryKey !== prevKeyRef.current) {
      prevKeyRef.current = queryKey
      setPageState(1)
    }
  }, [queryKey])

  useEffect(() => {
    if (!data?.data) return
    if (restoredFromCache.current) { restoredFromCache.current = false; return }
    const newProducts = data.data.map(mapApiProduct)
    if (page === 1) {
      setAccumulated(newProducts)
    } else {
      setAccumulated(prev => {
        const existingIds = new Set(prev.map(p => p.id))
        const toAdd = newProducts.filter(p => !existingIds.has(p.id))
        return toAdd.length > 0 ? [...prev, ...toAdd] : prev
      })
    }
  }, [data, page])

  const products = groupByModel(accumulated)
  const total = data?.meta?.pagination?.total || 0
  const hasMore = accumulated.length < total
  const showSkeleton = isLoading && accumulated.length === 0

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) setPage(p => p + 1)
  }, [hasMore, isLoading])

  const currentSort = SORT_OPTIONS.find(s => s.key === sortBy)

  return (
    <>
      <Helmet>
        <title>Каталог — KICKSTEP</title>
      </Helmet>

      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        {/* Section chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
          <button
            onClick={() => setActiveSection(null)}
            className={`flex-shrink-0 px-4 py-1 rounded-full text-[13px] border transition ${
              !activeSection ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'
            }`}
          >
            Все
          </button>
          {CATALOG_SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex-shrink-0 px-4 py-1 rounded-full text-[13px] border transition ${
                activeSection === section.key ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Gender + Sort + Filter */}
        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="flex gap-2">
            {['men', 'women'].map((g) => (
              <button
                key={g}
                onClick={() => {
                  if (effectiveGender === g) {
                    searchParams.delete('gender')
                  } else {
                    searchParams.set('gender', g)
                  }
                  setSearchParams(searchParams)
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                  effectiveGender === g ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'
                }`}
              >
                {g === 'men' ? 'Мужское' : 'Женское'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border border-gray-300"
              >
                {currentSort?.label || 'Сортировка'}
                <ChevronDown size={16} className={`transition ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-[14px] shadow-lg z-20 min-w-[160px]">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setSortBy(opt.key); setSortOpen(false) }}
                      className={`w-full text-left px-4 py-3 text-sm transition first:rounded-t-[14px] last:rounded-b-[14px] ${
                        sortBy === opt.key ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-2 rounded-full border border-gray-300">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Products */}
        {showSkeleton ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-[14px] overflow-hidden">
                <div className="aspect-square animate-pulse bg-gray-100" />
                <div className="p-3">
                  <div className="h-3 w-3/4 animate-pulse bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-1/2 animate-pulse bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-base text-gray-600">Товары не найдены</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-3">Найдено {total} товаров</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        {hasMore && (
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-black text-white text-sm font-semibold rounded-[24px] disabled:opacity-50"
          >
            {isLoading ? 'Загрузка...' : 'Показать ещё'}
          </button>
        )}
      </div>
    </>
  )
}
