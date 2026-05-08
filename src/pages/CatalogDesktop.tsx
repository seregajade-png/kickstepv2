import { useState, useRef, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useProducts, useBrands } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import { groupByModel } from '../lib/groupByModel'
import ProductCard from '../components/ProductCard'
import FilterDrawer from '../components/FilterDrawer'

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"

const SORT_OPTIONS = [
  { key: 'popular', label: 'По умолчанию' },
  { key: 'price_asc', label: 'По возрастанию цены' },
  { key: 'price_desc', label: 'По убыванию цены' },
  { key: 'new', label: 'Новинки' },
]

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

const MODEL_SIZE_KEY: Record<string, string> = {
  'yeezy 350': 'yeezy', 'yeezy 500': 'yeezy',
  'travis scott': 'nike', 'jordan 1': 'nike', 'jordan 4': 'nike', 'dunk': 'nike',
  'campus': 'adidas', '530': 'new-balance',
}

function ModelChipDesktop({ label, search, brand, active, onClick }: CatalogChip & { active: boolean; onClick: () => void }) {
  const { data } = useProducts({ search, brand, pageSize: 1 })
  const count = data?.meta?.pagination?.total
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
      padding: '0.25rem 0.875rem', height: '1.75rem', borderRadius: '1.5rem', cursor: 'pointer',
      border: '0.0625rem solid var(--stroke)',
      background: active ? 'var(--black)' : '#FFF',
      color: active ? '#FFF' : 'var(--black)',
      fontFamily: "'Involve-Regular', Helvetica", fontWeight: 400, fontSize: '0.8125rem',
    }}>
      {label}
      {count !== undefined && (
        <span style={{ fontSize: '0.6875rem', opacity: active ? 0.7 : 0.45 }}>{count}</span>
      )}
    </button>
  )
}

export default function CatalogDesktop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const brandFromUrl = searchParams.get('brand')
  const modelFromUrl = searchParams.get('model')

  const [sortBy, setSortBy] = useState('popular')
  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [accumulated, setAccumulated] = useState<ReturnType<typeof mapApiProduct>[]>([])
  const prevKeyRef = useRef('')
  const chipsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = chipsRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const { data: brandsData } = useBrands()
  const brandsList = brandsData || []

  const { data, isLoading } = useProducts({
    brand: brandFromUrl || undefined,
    search: modelFromUrl || undefined,
    sort: sortBy,
    page,
    pageSize: 12,
  })

  const queryKey = `${brandFromUrl}|${modelFromUrl}|${sortBy}`
  useEffect(() => {
    if (queryKey !== prevKeyRef.current) { prevKeyRef.current = queryKey; setPage(1) }
  }, [queryKey])

  useEffect(() => {
    if (!data?.data) return
    const newProducts = data.data.map(mapApiProduct)
    if (page === 1) setAccumulated(newProducts)
    else setAccumulated(prev => {
      const ids = new Set(prev.map(p => p.id))
      return [...prev, ...newProducts.filter(p => !ids.has(p.id))]
    })
  }, [data, page])

  const products = groupByModel(accumulated)
  const total = data?.meta?.pagination?.total || 0
  const hasMore = accumulated.length < total
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
    <div style={{ width: '80rem', maxWidth: '100%', margin: '0 auto', padding: '0 2.5rem' }}>

      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', height: '1.5rem', marginTop: '1.5rem' }}>
        <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.8125rem', color: 'var(--darkgray)' }}>
          <Link to="/" style={{ color: 'var(--darkgray)', textDecoration: 'none' }}>Главная</Link>
          &nbsp;&nbsp;/&nbsp;&nbsp;Каталог
        </span>
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: 'var(--black)', marginTop: '0.5rem' }}>Каталог</h1>

      {/* Model chips — sticky */}
      <div ref={chipsRef} className="scrollbar-hide" style={{ display: 'flex', gap: '0.5rem', padding: '1rem 0', overflowX: 'auto', position: 'sticky', top: '4.5rem', zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(0.5rem)', borderBottom: '0.0625rem solid #F0F0F0' }}>
        {CATALOG_CHIPS.map((cat) => (
          <ModelChipDesktop key={cat.search ?? cat.brand} {...cat}
            active={cat.search ? modelFromUrl === cat.search : brandFromUrl === cat.brand}
            onClick={() => toggleChip(cat)} />
        ))}
      </div>

      {/* Sort / Filter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button onClick={() => setFilterOpen(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem',
          background: 'none', border: 'none', cursor: 'pointer',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M7 12h10M10 18h4"/></svg>
          <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.875rem', color: 'var(--black)' }}>Фильтры</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setSortOpen(!sortOpen)} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem',
            background: 'none', border: 'none', cursor: 'pointer',
          }}>
            <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.875rem', color: 'var(--black)', textAlign: 'right' }}>{currentSort?.label}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          {sortOpen && (
            <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.25rem', borderRadius: '0.875rem', border: '0.0625rem solid var(--stroke)', background: '#FFF', overflow: 'hidden', zIndex: 20, minWidth: '12.5rem' }}>
              {SORT_OPTIONS.map((opt) => (
                <button key={opt.key} onClick={() => { setSortBy(opt.key); setSortOpen(false) }} style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', border: 'none', cursor: 'pointer',
                  fontFamily: FM, fontWeight: sortBy === opt.key ? 600 : 500, fontSize: '0.875rem', color: 'var(--black)',
                  background: sortBy === opt.key ? 'var(--superlightgray)' : '#FFF',
                }}>{opt.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product grid — 4 columns, 17.25rem cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginTop: '1rem' }}>
        {isLoading && accumulated.length === 0
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: '100%', aspectRatio: '1/1.4', borderRadius: '0.875rem', background: 'var(--superlightgray)' }} />
            ))
          : products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
        }
      </div>

      {products.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: '3.75rem 0', color: 'var(--darkgray)', fontSize: '1rem' }}>
          Товары не найдены
        </div>
      )}

      {/* "Смотреть ещё" */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <button onClick={() => { if (!isLoading) setPage(p => p + 1) }} disabled={isLoading} style={{
            display: 'flex', width: '17.25rem', height: '3rem', justifyContent: 'center', alignItems: 'center',
            borderRadius: '2rem', border: '0.125rem solid var(--stroke)', background: '#FFF', cursor: 'pointer',
            fontFamily: F, fontWeight: 600, fontSize: '1rem', color: 'var(--black)',
            opacity: isLoading ? 0.5 : 1,
          }}>
            {isLoading ? 'Загрузка...' : 'Смотреть еще'}
          </button>
        </div>
      )}

      <div style={{ height: '4rem' }} />

      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        brands={brandsList.map((b: any) => ({ id: b.id, name: b.name, slug: b.slug }))}
        currentBrandSlug={searchParams.get('brand') || undefined}
        currentSizeKey={modelFromUrl ? MODEL_SIZE_KEY[modelFromUrl] : undefined}
        onApply={(filters) => {
          if (filters.sizes && filters.sizes.length > 0) searchParams.set('sizes', filters.sizes.join(','))
          else searchParams.delete('sizes')
          setSearchParams(searchParams)
        }}
      />
    </div>
  )
}
