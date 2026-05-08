import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct, useProducts } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import ProductCard from '../components/ProductCard'
import { addToRecentlyViewed, useRecentlyViewedSlugs } from '../hooks/useRecentlyViewed'
import { euToCm } from '../lib/sizeConversion'

function RecentCardDesktop({ slug }: { slug: string }) {
  const { data } = useProduct(slug)
  const p = data ? mapApiProduct(data) : null
  if (!p) return null
  return <div style={{ flexShrink: 0, width: '17.25rem' }}><ProductCard product={p} /></div>
}

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"
const FB = "'Involve-Bold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

export default function ProductDesktop() {
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
  const [sizeOpen, setSizeOpen] = useState(false)
  const [openAcc, setOpenAcc] = useState<string | null>('about')

  useEffect(() => { setActiveImg(0); setSelectedSize(null) }, [slug])

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><div style={{ width: '2rem', height: '2rem', border: '0.125rem solid #0A0A0A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>
  if (!product) return <div style={{ padding: '5rem 2.5rem', textAlign: 'center' }}><p style={{ fontSize: '1.5rem', fontFamily: F }}>Товар не найден</p></div>

  const images = product.images
  const inWishlist = isInWishlist(product.id)
  const sizeObj = product.sizes.find(s => s.eu === selectedSize)
  const hasDiscount = product.oldPrice && product.oldPrice > product.price

  const toggleWishlist = () => {
    if (inWishlist) removeFromWishlist(product.id)
    else addToWishlist({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, image: images[0], price: product.price, colorName: product.colorName, colorHex: product.colorHex })
  }
  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) { setSizeOpen(true); return }
    addToCart({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, image: images[0], price: product.price, oldPrice: product.oldPrice, color: product.colorName || 'Default', sizeRu: sizeObj?.ru || '', sizeEu: sizeObj?.eu || '', quantity: 1, addedAt: new Date().toISOString() })
  }
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout') }

  const accordions = [
    { key: 'about', title: 'О товаре', content: product.description || `Силуэт ${product.brand} ${product.name} — стильные кроссовки для повседневной носки.` },
    { key: 'specs', title: 'Характеристики', specs: [{ label: 'Бренд', value: product.brand }, { label: 'Цвет', value: product.colorName || '—' }, { label: 'Артикул', value: product.slug }] },
  ]

  return (
    <div style={{ width: '80rem', maxWidth: '100%', margin: '0 auto', padding: '0 2.5rem' }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '1.5rem', marginTop: '1.5rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <p style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.8125rem', color: '#6E6E6E' }}>
          <Link to="/" style={{ color: '#6E6E6E', textDecoration: 'none' }}>Главная</Link>&nbsp;&nbsp;/&nbsp;&nbsp;
          <Link to="/catalog" style={{ color: '#6E6E6E', textDecoration: 'none' }}>Каталог</Link>&nbsp;&nbsp;/&nbsp;&nbsp;
          <span style={{ textDecoration: 'underline' }}>{product.brand}</span>&nbsp;&nbsp;/&nbsp;&nbsp;{product.name}
        </p>
      </div>

      {/* Two column layout */}
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        {/* LEFT: images */}
        <div style={{ width: '36.5rem', flexShrink: 0 }}>
          <img src={images[activeImg]} alt={product.name} style={{ width: '36.5rem', height: '26.5rem', objectFit: 'cover', borderRadius: '0.875rem' }} />
          {images.length > 1 && (
            <div className="scrollbar-hide" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', overflow: 'auto' }}>
              {images.slice(0, 4).map((src, i) => (
                <img key={i} src={src} alt="" onClick={() => setActiveImg(i)}
                  style={{ width: '6.3125rem', height: '6rem', objectFit: 'cover', cursor: 'pointer', opacity: i === activeImg ? 1 : 0.6, transition: 'opacity 0.2s' }} />
              ))}
            </div>
          )}

          {/* Accordions under image */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
            {accordions.map((acc) => (
              <div key={acc.key} style={{ background: '#F4F4F4', borderRadius: '0.875rem', padding: '1rem' }}>
                <div onClick={() => setOpenAcc(openAcc === acc.key ? null : acc.key)}
                  style={{ display: 'flex', height: '1.5rem', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>{acc.title}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {openAcc === acc.key ? <path d="M18 15L12 9L6 15"/> : <path d="M6 9L12 15L18 9"/>}
                  </svg>
                </div>
                {openAcc === acc.key && acc.content && (
                  <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#0A0A0A', marginTop: '1rem' }}>{acc.content}</p>
                )}
                {openAcc === acc.key && acc.specs && (
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {acc.specs.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.625rem' }}>
                        <span style={{ flex: 1, fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#6E6E6E' }}>{s.label}</span>
                        <span style={{ flex: 1, fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#0A0A0A' }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: info */}
        <div style={{ width: '36.5rem', flexShrink: 0, minWidth: 0 }}>
          <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#0A0A0A', lineHeight: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
            Кроссовки<br/>{product.brand} {product.name}
          </h1>

          {/* Price + heart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontFamily: FB, fontWeight: 700, fontSize: '2rem', color: '#0A0A0A' }}>{product.price.toLocaleString('ru-RU')} ₽</span>
              {hasDiscount && <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#6E6E6E', textDecoration: 'line-through' }}>{product.oldPrice!.toLocaleString('ru-RU')} ₽</span>}
            </div>
            <button onClick={toggleWishlist} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M19.513 12.583L12.013 20.011L4.513 12.583C4.018 12.102 3.629 11.523 3.369 10.884C3.108 10.245 2.984 9.558 3.002 8.868C3.02 8.178 3.181 7.5 3.474 6.875C3.768 6.25 4.187 5.693 4.706 5.238C5.226 4.783 5.834 4.441 6.492 4.233C7.15 4.025 7.844 3.955 8.53 4.028C9.217 4.101 9.88 4.316 10.48 4.658C11.079 5.001 11.601 5.463 12.013 6.017C12.427 5.467 12.949 5.009 13.548 4.67C14.147 4.331 14.81 4.12 15.494 4.049C16.178 3.978 16.87 4.049 17.526 4.258C18.182 4.466 18.787 4.808 19.305 5.262C19.822 5.715 20.24 6.271 20.533 6.893C20.826 7.516 20.988 8.192 21.007 8.88C21.027 9.568 20.904 10.252 20.647 10.891C20.39 11.529 20.004 12.107 19.513 12.589"
                  fill={inWishlist ? '#EC221F' : 'none'} stroke={inWishlist ? '#EC221F' : '#0A0A0A'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Color */}
          {product.colorName && (
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>Цвет</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1.25rem', color: '#0A0A0A' }}>{product.colorName}</span>
                {product.colorHex && (
                  <span style={{ display: 'inline-block', width: '1.25rem', height: '1.25rem', borderRadius: '50%', background: product.colorHex, border: '1px solid #D1D1D1' }} />
                )}
              </span>
            </div>
          )}

          {/* Color thumbnails */}
          {product.colorSiblings.length > 0 && (
            <div className="scrollbar-hide" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', overflow: 'auto' }}>
              <div style={{ width: '8.75rem', height: '8.75rem', flexShrink: 0, border: '0.0625rem solid #0A0A0A', overflow: 'hidden' }}>
                <img src={images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {product.colorSiblings.map((sib) => (
                <Link key={sib.slug} to={`/product/${sib.slug}`} style={{ width: '8.75rem', height: '8.75rem', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={sib.image} alt={sib.colorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Link>
              ))}
            </div>
          )}

          {/* Size select */}
          {product.sizes.length > 0 && (
            <div style={{ position: 'relative', marginTop: '1.5rem' }}>
              <div onClick={() => setSizeOpen(!sizeOpen)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem',
                borderRadius: '0.875rem', border: '0.0625rem solid #B5B5B5', background: '#FFF', cursor: 'pointer',
              }}>
                <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: selectedSize ? '#0A0A0A' : '#6E6E6E' }}>
                  {selectedSize ? `EU ${selectedSize}` : 'Выберите размер'}
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: sizeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M6 9L12 15L18 9"/>
                </svg>
              </div>
              {sizeOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.25rem', borderRadius: '0.875rem', border: '0.0625rem solid #D1D1D1', background: '#FFF', zIndex: 20, maxHeight: '18.75rem', overflow: 'auto' }}>
                  {product.sizes.map((size) => {
                    const cm = euToCm(size.eu, product.brand)
                    return (
                      <button key={size.eu} onClick={() => { setSelectedSize(size.eu); setSizeOpen(false) }}
                        disabled={!size.inStock} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          width: '100%', textAlign: 'left', padding: '0.75rem 1rem', border: 'none', cursor: size.inStock ? 'pointer' : 'not-allowed',
                          fontFamily: FM, fontWeight: 500, fontSize: '0.9375rem', color: size.inStock ? '#0A0A0A' : '#B5B5B5',
                          background: selectedSize === size.eu ? '#F4F4F4' : '#FFF',
                        }}>
                        <span>EU {size.eu}{!size.inStock ? ' — нет в наличии' : ''}</span>
                        {cm && <span style={{ color: '#6E6E6E', fontSize: '0.8125rem' }}>{cm} см</span>}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Size chart link — jump to current brand section */}
              <Link
                to={`/size-guide#${(product.brand || '').toLowerCase().replace(/\s+/g,'-')}`}
                style={{ fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#6E6E6E', textDecoration: 'underline', marginTop: '0.75rem', cursor: 'pointer', display: 'inline-block' }}
              >
                Таблица размеров
              </Link>
            </div>
          )}

          {/* Buttons — side by side */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button onClick={handleAddToCart} style={{
              flex: 1, height: '3.25rem', borderRadius: '2rem', background: '#0A0A0A', border: 'none', cursor: 'pointer',
              fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#FFF',
            }}>Добавить в корзину</button>
            <button onClick={handleBuyNow} style={{
              flex: 1, height: '3.25rem', borderRadius: '2rem', background: '#FFF', border: '0.125rem solid #D1D1D1', cursor: 'pointer',
              fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A',
            }}>Купить сейчас</button>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {suggestedProducts.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#0A0A0A' }}>Похожие товары</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '3.5rem', background: '#F4F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </div>
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '3.5rem', background: '#F4F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>
          </div>
          <div className="scrollbar-hide" style={{ display: 'flex', gap: '2rem', overflow: 'auto' }}>
            {suggestedProducts.map((p) => (
              <div key={p.id} style={{ flexShrink: 0, width: '17.25rem' }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently viewed */}
      {recentSlugs.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#0A0A0A', marginBottom: '1rem' }}>Ранее просмотренные</h2>
          <div className="scrollbar-hide" style={{ display: 'flex', gap: '2rem', overflow: 'auto' }}>
            {recentSlugs.map((s) => <RecentCardDesktop key={s} slug={s} />)}
          </div>
        </div>
      )}

      <div style={{ height: '4rem' }} />
    </div>
  )
}
