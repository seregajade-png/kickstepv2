import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useProduct, useProducts } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import ProductCard from '../components/ProductCard'
import { useIsDesktop } from '../hooks/useMediaQuery'
import ProductDesktop from './ProductDesktop'
import { addToRecentlyViewed, useRecentlyViewedSlugs } from '../hooks/useRecentlyViewed'
import { euToCm } from '../lib/sizeConversion'

function RecentCard({ slug }: { slug: string }) {
  const { data } = useProduct(slug)
  const product = data ? mapApiProduct(data) : null
  if (!product) return null
  return <div style={{ flexShrink: 0, width: '9.75rem' }}><ProductCard product={product} /></div>
}

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"
const FB = "'Involve-Bold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

function ProductMobile() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addToCart = useCartStore((s) => s.addItem)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  const { data: apiProduct, isLoading } = useProduct(slug || '')
  const product = apiProduct ? mapApiProduct(apiProduct) : null

  const { data: suggestedData } = useProducts(product ? { pageSize: 8, sort: 'popular' } : undefined)
  const suggestedProducts = useMemo(() =>
    (suggestedData?.data || []).map(mapApiProduct).filter((p) => p.slug !== slug).slice(0, 4),
    [suggestedData, slug]
  )

  const recentSlugs = useRecentlyViewedSlugs(slug)
  useEffect(() => { if (slug) addToRecentlyViewed(slug) }, [slug])

  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [openAccordion, setOpenAccordion] = useState<string | null>('about')
  const [touchStart, setTouchStart] = useState<number | null>(null)

  useEffect(() => { setActiveImg(0); setSelectedSize(null) }, [slug])

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
      <div style={{ width: '2rem', height: '2rem', border: '0.125rem solid #0A0A0A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )
  if (!product) return (
    <div style={{ padding: '5rem 1rem', textAlign: 'center' }}>
      <p style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: F }}>Товар не найден</p>
      <Link to="/catalog" style={{ color: '#6E6E6E', fontSize: '0.875rem', fontFamily: FM }}>Вернуться в каталог</Link>
    </div>
  )

  const images = product.images
  const inWishlist = isInWishlist(product.id)
  const sizeObj = product.sizes.find((s) => s.eu === selectedSize)
  const hasDiscount = product.oldPrice && product.oldPrice > product.price

  const toggleWishlist = () => {
    if (inWishlist) removeFromWishlist(product.id)
    else addToWishlist({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, image: images[0], price: product.price, colorName: product.colorName, colorHex: product.colorHex })
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) return
    addToCart({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, image: images[0], price: product.price, oldPrice: product.oldPrice, color: product.colorName || 'Default', sizeRu: sizeObj?.ru || '', sizeEu: sizeObj?.eu || '', quantity: 1, addedAt: new Date().toISOString() })
  }

  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout') }

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeImg < images.length - 1) setActiveImg(i => i + 1)
      else if (diff < 0 && activeImg > 0) setActiveImg(i => i - 1)
    }
    setTouchStart(null)
  }

  // Size rows (4 per row)
  const sizeRows: typeof product.sizes[] = []
  for (let i = 0; i < product.sizes.length; i += 4) sizeRows.push(product.sizes.slice(i, i + 4))

  const accordions = [
    { key: 'about', title: 'О товаре', content: product.description || `Силуэт ${product.brand} ${product.name} — стильные кроссовки для повседневной носки.` },
    { key: 'specs', title: 'Характеристики', specs: [
      { label: 'Бренд', value: product.brand },
      { label: 'Цвет', value: product.colorName || '—' },
      { label: 'Артикул', value: product.slug },
    ]},
  ]

  return (
    <>
      <Helmet><title>{product.brand} {product.name} — KICKSTEP</title></Helmet>

      <style>{`
        .product-layout { display: block; }
        @media (min-width: 48rem) {
          .product-layout { display: grid !important; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 1rem var(--px); }
          .product-gallery { position: sticky; top: 5rem; align-self: start; }
        }
      `}</style>

      {/* Breadcrumbs + Back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem var(--px)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <p style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.6875rem', color: '#6E6E6E', flex: 1 }}>
          Главная&nbsp;&nbsp;/&nbsp;&nbsp;Каталог&nbsp;&nbsp;/&nbsp;&nbsp;{product.brand}&nbsp;&nbsp;/&nbsp;&nbsp;{product.name}
        </p>
      </div>

      <div className="product-layout">
      {/* Gallery column */}
      <div className="product-gallery">
      {/* Main image gallery */}
      <div className="scrollbar-hide" style={{ display: 'flex', gap: '0', padding: '0', overflowX: 'auto', scrollSnapType: 'x mandatory', width: '100%' }}
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {images.map((src, i) => (
          <div key={i} style={{ flexShrink: 0, width: '100%', padding: '0 var(--px)', boxSizing: 'border-box', scrollSnapAlign: 'center' }}>
            <img src={src} alt={product.name} style={{ width: '100%', aspectRatio: '1/1', borderRadius: '0.875rem', objectFit: 'contain', background: '#FFF', display: 'block' }} />
          </div>
        ))}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 0' }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setActiveImg(i)} style={{
              width: '0.375rem', height: '0.375rem', borderRadius: '0.1875rem', border: 'none', padding: 0, cursor: 'pointer',
              background: i === activeImg ? '#0A0A0A' : '#B5B5B5',
            }} />
          ))}
        </div>
      )}

      </div>{/* end gallery column */}

      {/* Info column */}
      <div style={{ background: '#FFF', borderRadius: '1.875rem 1.875rem 0 0', padding: '1rem 1rem 0', marginTop: -16, position: 'relative', zIndex: 1 }}>

        {/* Title */}
        <p style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A' }}>
          Кроссовки {product.brand} {product.name}
        </p>

        {/* Price + heart */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: FB, fontWeight: 700, fontSize: '1.25rem', color: '#0A0A0A' }}>
              {product.price.toLocaleString('ru-RU')} ₽
            </span>
            {hasDiscount && (
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: '0.9375rem', color: '#6E6E6E', textDecoration: 'line-through' }}>
                {product.oldPrice!.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>
          <button onClick={toggleWishlist} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19.513 12.583L12.013 20.011L4.513 12.583C4.018 12.102 3.629 11.523 3.369 10.884C3.108 10.245 2.984 9.558 3.002 8.868C3.02 8.178 3.181 7.5 3.474 6.875C3.768 6.25 4.187 5.693 4.706 5.238C5.226 4.783 5.834 4.441 6.492 4.233C7.15 4.025 7.844 3.955 8.53 4.028C9.217 4.101 9.88 4.316 10.48 4.658C11.079 5.001 11.601 5.463 12.013 6.017C12.427 5.467 12.949 5.009 13.548 4.67C14.147 4.331 14.81 4.12 15.494 4.049C16.178 3.978 16.87 4.049 17.526 4.258C18.182 4.466 18.787 4.808 19.305 5.262C19.822 5.715 20.24 6.271 20.533 6.893C20.826 7.516 20.988 8.192 21.007 8.88C21.027 9.568 20.904 10.252 20.647 10.891C20.39 11.529 20.004 12.107 19.513 12.589"
                fill={inWishlist ? '#EC221F' : 'none'} stroke={inWishlist ? '#EC221F' : '#6E6E6E'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Color */}
        {product.colorName && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A' }}>Цвет</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A' }}>{product.colorName}</span>
              {product.colorHex && (
                <span style={{ display: 'inline-block', width: '1rem', height: '1rem', borderRadius: '50%', background: product.colorHex, border: '1px solid #D1D1D1' }} />
              )}
            </span>
          </div>
        )}

        {/* Color thumbnails */}
        {product.colorSiblings.length > 0 && (
          <div className="scrollbar-hide" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', overflowX: 'auto' }}>
            <div style={{ width: '6.5rem', height: '6.5rem', flexShrink: 0, border: '0.0625rem solid #0A0A0A', borderRadius: 0, overflow: 'hidden' }}>
              <img src={images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {product.colorSiblings.map((sib) => (
              <Link key={sib.slug} to={`/product/${sib.slug}`} style={{ width: '6.5rem', height: '6.5rem', flexShrink: 0, overflow: 'hidden' }}>
                <img src={sib.image} alt={sib.colorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Link>
            ))}
          </div>
        )}

        {/* Size */}
        {product.sizes.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1.5rem' }}>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A' }}>Размер</span>
              {selectedSize && <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A' }}>{selectedSize}</span>}
            </div>

            {/* Size select dropdown */}
            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
              <select
                value={selectedSize || ''}
                onChange={e => setSelectedSize(e.target.value || null)}
                style={{
                  width: '100%', height: '3rem', padding: '0 2.5rem 0 1rem', borderRadius: '0.875rem',
                  border: '0.09375rem solid #D1D1D1', background: '#FFF', cursor: 'pointer',
                  fontFamily: FM, fontWeight: 500, fontSize: '0.9375rem', color: selectedSize ? '#0A0A0A' : '#B5B5B5',
                  appearance: 'none', WebkitAppearance: 'none', outline: 'none',
                }}
              >
                <option value="" disabled>Выберите размер (EU)</option>
                {product.sizes.map((size) => {
                  const cm = euToCm(size.eu, product.brand)
                  return (
                    <option key={size.eu} value={size.eu} disabled={!size.inStock}>
                      EU {size.eu}{cm ? ` — ${cm} см` : ''}{!size.inStock ? ' — нет в наличии' : ''}
                    </option>
                  )
                })}
              </select>
              {/* Custom arrow */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', pointerEvents: 'none' }}>
                <path d="M6 9L12 15L18 9"/>
              </svg>
            </div>
            <Link to={`/size-guide#${(product.brand || '').toLowerCase().replace(/\s+/g,'-')}`} style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.8125rem', color: '#6E6E6E', textDecoration: 'underline', marginTop: '0.5rem', display: 'inline-block' }}>
              Таблица размеров
            </Link>
          </>
        )}

        {/* Add to cart */}
        <button onClick={handleAddToCart} disabled={product.sizes.length > 0 && !selectedSize} style={{
          display: 'flex', width: '100%', height: '3rem', alignItems: 'center', justifyContent: 'center',
          borderRadius: '1.5rem', background: (product.sizes.length > 0 && !selectedSize) ? '#D1D1D1' : '#0A0A0A',
          border: 'none', cursor: 'pointer', marginTop: '1rem',
          fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#FFF',
        }}>
          Добавить в корзину
        </button>

        {/* Buy now */}
        <button onClick={handleBuyNow} disabled={product.sizes.length > 0 && !selectedSize} style={{
          display: 'flex', width: '100%', height: '3rem', alignItems: 'center', justifyContent: 'center',
          borderRadius: '1.5rem', background: '#FFF', marginTop: '0.5rem',
          border: '0.09375rem solid #D1D1D1', cursor: 'pointer',
          fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#0A0A0A',
        }}>
          Купить сейчас
        </button>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
          {accordions.map((acc) => (
            <div key={acc.key} style={{ background: '#F4F4F4', borderRadius: '0.875rem', padding: '1rem' }}>
              <button onClick={() => setOpenAccordion(openAccordion === acc.key ? null : acc.key)} style={{
                display: 'flex', height: '1.5rem', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}>
                <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A', flex: 1, textAlign: 'left' }}>{acc.title}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {openAccordion === acc.key ? <path d="M18 15L12 9L6 15"/> : <path d="M6 9L12 15L18 9"/>}
                </svg>
              </button>
              {openAccordion === acc.key && acc.content && (
                <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', marginTop: '0.5rem', lineHeight: 'normal' }}>{acc.content}</p>
              )}
              {openAccordion === acc.key && acc.specs && (
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {acc.specs.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.625rem' }}>
                      <span style={{ flex: 1, fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#6E6E6E' }}>{s.label}</span>
                      <span style={{ flex: 1, fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Related products */}
        {suggestedProducts.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Похожие товары</p>
            <div className="scrollbar-hide" style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
              {suggestedProducts.map((p) => (
                <div key={p.id} style={{ flexShrink: 0, width: '9.75rem' }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        {recentSlugs.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Ранее просмотренные</p>
            <div className="scrollbar-hide" style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
              {recentSlugs.map((s) => <RecentCard key={s} slug={s} />)}
            </div>
          </div>
        )}

        <div style={{ height: '2rem' }} />
      </div>
      </div>{/* end product-layout */}
    </>
  )
}

export default function ProductPage() {
  const isDesktop = useIsDesktop()
  const { slug } = useParams<{ slug: string }>()
  const { data: apiProduct } = useProduct(slug || '')
  const product = apiProduct ? mapApiProduct(apiProduct) : null
  const title = product ? `${product.brand} ${product.name} — KICKSTEP` : 'KICKSTEP'

  return isDesktop
    ? <><Helmet><title>{title}</title></Helmet><ProductDesktop /></>
    : <ProductMobile />
}
