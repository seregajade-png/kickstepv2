import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useLocation, useNavigationType, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useProducts, useBrands } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import { groupByModel } from '../lib/groupByModel'
import ProductCard from '../components/ProductCard'
import FilterDrawer from '../components/FilterDrawer'
import { useIsDesktop } from '../hooks/useMediaQuery'
import CatalogDesktop from './CatalogDesktop'

const SORT_OPTIONS = [
  { key: 'popular', label: 'По умолчанию' },
  { key: 'price_asc', label: 'По возрастанию цены' },
  { key: 'price_desc', label: 'По убыванию цены' },
  { key: 'new', label: 'Новинки' },
]

const MODEL_SIZE_KEY: Record<string, string> = {
  'yeezy 350': 'yeezy', 'yeezy 500': 'yeezy',
  'travis scott': 'nike', 'jordan 1': 'nike', 'jordan 4': 'nike', 'dunk': 'nike',
  'campus': 'adidas', '530': 'new-balance',
}

type CatalogChip = { label: string; search?: string; brand?: string }

const CATALOG_CHIPS: CatalogChip[] = [
  { label: 'Yeezy 350', search: 'yeezy 350' },
  { label: 'Yeezy 500', search: 'yeezy 500' },
  { label: 'Nike Travis', search: 'travis scott' },
  { label: 'Jordan 1', search: 'jordan 1' },
  { label: 'Jordan 4', search: 'jordan 4' },
  { label: 'Dunk', search: 'dunk' },
  { label: 'Campus', search: 'campus' },
  { label: 'New Balance 530', search: '530' },
  { label: 'Golden Goose', brand: 'golden-goose' },
  { label: 'Balenciaga', brand: 'balenciaga' },
  { label: 'Miu Miu', brand: 'miu-miu' },
]

function ModelChip({ label, search, brand, active, onClick }: CatalogChip & { active: boolean; onClick: () => void }) {
  const { data } = useProducts({ search, brand, pageSize: 1 })
  const count = data?.meta?.pagination?.total
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
      padding: '0.25rem 0.875rem', height: '1.75rem', borderRadius: '1.5rem',
      border: '0.0625rem solid #D1D1D1', cursor: 'pointer',
      background: active ? '#0A0A0A' : '#FFF',
      color: active ? '#FFF' : '#0A0A0A',
      fontFamily: "'Involve-Regular', Helvetica", fontWeight: 400, fontSize: '0.8125rem', whiteSpace: 'nowrap',
    }}>
      {label}
      {count !== undefined && (
        <span style={{ fontSize: '0.6875rem', opacity: active ? 0.7 : 0.45 }}>{count}</span>
      )}
    </button>
  )
}

function CatalogMobile() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navType = useNavigationType()
  const brandFromUrl = searchParams.get('brand')
  const genderFromUrl = searchParams.get('gender')
  const genderFromPath = location.pathname.startsWith('/men') ? 'men' : location.pathname.startsWith('/women') ? 'women' : null
  const effectiveGender = genderFromPath || genderFromUrl || undefined

  const [sortBy, setSortBy] = useState('popular')
  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const itemsPerPage = 8
  const modelFromUrl = searchParams.get('model')

  const { data: brandsData } = useBrands()
  const brandsList = brandsData || []

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
    search: modelFromUrl || undefined,
    sort: sortBy,
    page,
    pageSize: itemsPerPage,
  })

  const queryKey = `${brandFromUrl}|${effectiveGender}|${sortBy}|${itemsPerPage}|${modelFromUrl}`
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

  const toggleChip = (chip: CatalogChip) => {
    if (chip.search) {
      searchParams.delete('brand')
      if (modelFromUrl === chip.search) searchParams.delete('model')
      else searchParams.set('model', chip.search)
    } else if (chip.brand) {
      searchParams.delete('model')
      if (brandFromUrl === chip.brand) searchParams.delete('brand')
      else searchParams.set('brand', chip.brand)
    }
    setSearchParams(searchParams)
  }

  return (
    <>
      <Helmet><title>Каталог — SNEAKER MOSCOW</title></Helmet>

      {/* Breadcrumbs */}
      <div style={{ margin: '0.5rem 1rem 0', height: '1.875rem', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Involve-Medium', Helvetica", fontWeight: 500, fontSize: '0.6875rem', color: '#6E6E6E' }}>
          <Link to="/" style={{ color: '#6E6E6E', textDecoration: 'none' }}>Главная</Link>
          &nbsp;&nbsp;/&nbsp;&nbsp;Каталог
        </span>
      </div>

      {/* Title */}
      <h1 style={{ margin: '0.5rem 1rem 0', fontSize: '1.5rem', fontWeight: 600, color: '#0A0A0A', fontFamily: "'Involve-SemiBold', Helvetica" }}>
        Каталог
      </h1>

      {/* Category tabs (models) — sticky */}
      <div className="scrollbar-hide" style={{
        display: 'flex', gap: '0.25rem', padding: '0.5rem 1rem', height: 'auto',
        alignItems: 'center', overflowX: 'auto',
        position: 'sticky', top: '4rem', zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(0.5rem)',
        borderBottom: '0.0625rem solid #F0F0F0',
      }}>
        {CATALOG_CHIPS.map((cat) => (
          <ModelChip key={cat.search ?? cat.brand} {...cat}
            active={cat.search ? modelFromUrl === cat.search : brandFromUrl === cat.brand}
            onClick={() => toggleChip(cat)} />
        ))}
      </div>

      {/* Sort / Filter row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1rem', margin: '0.75rem 0 0', height: '2rem',
      }}>
        <button onClick={() => setFilterOpen(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem',
          background: 'none', border: 'none', cursor: 'pointer',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5">
            <path d="M3 6h18M7 12h10M10 18h4" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: "'Involve-Medium', Helvetica", fontWeight: 500, fontSize: '0.875rem', color: '#0A0A0A' }}>
            Фильтры
          </span>
        </button>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem', position: 'relative', cursor: 'pointer' }}
          onClick={() => setSortOpen(!sortOpen)}>
          <span style={{ fontFamily: "'Involve-Medium', Helvetica", fontWeight: 500, fontSize: '0.875rem', color: '#0A0A0A', textAlign: 'right' }}>
            {currentSort?.label}
          </span>
          {/* Down arrow */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5"
            style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Sort dropdown */}
      {sortOpen && (
        <div style={{
          margin: '0.25rem 1rem 0', borderRadius: '0.875rem', border: '0.0625rem solid #D1D1D1',
          background: '#FFF', overflow: 'hidden', position: 'relative', zIndex: 20,
        }}>
          {SORT_OPTIONS.map((opt) => (
            <button key={opt.key} onClick={() => { setSortBy(opt.key); setSortOpen(false) }} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem',
              border: 'none', cursor: 'pointer', fontSize: '0.875rem',
              fontFamily: "'Involve-Medium', Helvetica", fontWeight: sortBy === opt.key ? 600 : 500,
              color: '#0A0A0A', background: sortBy === opt.key ? '#F4F4F4' : '#FFF',
            }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Product grid */}
      <style>{`
        .catalog-grid { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 48rem) { .catalog-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 64rem) { .catalog-grid { grid-template-columns: repeat(4, 1fr) !important; } }
      `}</style>
      <div className="catalog-grid" style={{
        display: 'grid',
        gap: '1rem', margin: '0.5rem var(--px) 0',
      }}>
        {showSkeleton
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ width: '9.75rem', height: '14.75rem', borderRadius: '0.875rem', background: '#F4F4F4' }} />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
        }
      </div>

      {products.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: '3.75rem 1rem', color: '#6E6E6E', fontSize: '0.875rem' }}>
          Товары не найдены
        </div>
      )}

      {/* "Смотреть ещё" button */}
      {hasMore && (
        <div style={{ margin: '1rem 1rem 0' }}>
          <button onClick={() => { if (!isLoading) setPage(p => p + 1) }} disabled={isLoading} style={{
            display: 'flex', width: '100%', height: '3rem', justifyContent: 'center', alignItems: 'center',
            borderRadius: '1.5rem', border: '0.09375rem solid #D1D1D1', background: '#FFF', cursor: 'pointer',
            fontFamily: "'Involve-SemiBold', Helvetica", fontWeight: 600, fontSize: '0.875rem', color: '#0A0A0A',
            opacity: isLoading ? 0.5 : 1,
          }}>
            {isLoading ? 'Загрузка...' : 'Смотреть ещё'}
          </button>
        </div>
      )}

      {/* Spacer before footer */}
      <div style={{ height: '2rem' }} />

      {/* Filter drawer */}
      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        brands={brandsList.map((b: any) => ({ id: b.id, name: b.name, slug: b.slug }))}
        currentBrandSlug={brandFromUrl || undefined}
        currentSizeKey={modelFromUrl ? MODEL_SIZE_KEY[modelFromUrl] : undefined}
        onApply={(filters) => {
          if (filters.sizes && filters.sizes.length > 0) searchParams.set('sizes', filters.sizes.join(','))
          else searchParams.delete('sizes')
          setSearchParams(searchParams)
        }}
      />
    </>
  )
}

export default function CatalogPage() {
  const isDesktop = useIsDesktop()
  return isDesktop
    ? <><Helmet><title>Каталог — SNEAKER MOSCOW</title></Helmet><CatalogDesktop /></>
    : <CatalogMobile />
}
