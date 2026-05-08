import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useWishlistStore } from '../stores/wishlistStore'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types'
import { useIsDesktop } from '../hooks/useMediaQuery'
import WishlistDesktop from './WishlistDesktop'

const F = "'Involve-SemiBold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

export default function WishlistPage() {
  const isDesktop = useIsDesktop()
  if (isDesktop) return <><Helmet><title>Избранное — SNEAKER MOSCOW</title></Helmet><WishlistDesktop /></>
  return <WishlistMobile />
}

function WishlistMobile() {
  const { items } = useWishlistStore()

  const wishlistProducts: Product[] = items.map((item) => ({
    id: item.id, slug: item.slug, name: item.name, brand: item.brand,
    images: [item.image], thumbImages: [item.image], price: item.price,
    sizes: [], colorName: item.colorName || '', colorHex: item.colorHex || '',
    colorSiblings: [], model: '',
  }))

  /* ══ EMPTY STATE ══ */
  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Избранное — SNEAKER MOSCOW</title></Helmet>
        <div style={{ padding: '1rem 1rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A' }}>Избранное</h1>
              <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: 'normal' }}>
                Понравилась какая-то вещь?<br />
                Добавьте её в избранное и вернитесь к ней позже в любой момент
              </p>
            </div>
            <Link to="/catalog" style={{
              display: 'flex', height: '3rem', alignItems: 'center', justifyContent: 'center',
              borderRadius: '1.5rem', border: '0.09375rem solid #D1D1D1', background: '#FFF',
              fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#0A0A0A',
              textDecoration: 'none', textAlign: 'center',
            }}>
              В каталог
            </Link>
          </div>
        </div>
        <div style={{ height: '2rem' }} />
      </>
    )
  }

  /* ══ WITH ITEMS ══ */
  return (
    <>
      <Helmet><title>Избранное — SNEAKER MOSCOW</title></Helmet>

      {/* Title */}
      <div style={{ padding: '1rem 1rem 0' }}>
        <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A' }}>Избранное</h1>
      </div>

      {/* "Показать все" + arrow */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem 0' }}>
        <span style={{ fontFamily: "'Involve-Medium', Helvetica", fontWeight: 500, fontSize: '0.875rem', color: '#0A0A0A', textAlign: 'right' }}>
          Показать все
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9L12 15L18 9"/>
        </svg>
      </div>

      {/* Product grid — 2 columns */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem', padding: '1rem 1rem 0',
      }}>
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* "Смотреть ещё" button */}
      <div style={{ padding: '1.75rem 1rem 0' }}>
        <Link to="/catalog" style={{
          display: 'flex', height: '3rem', alignItems: 'center', justifyContent: 'center',
          borderRadius: '1.5rem', border: '0.09375rem solid #D1D1D1', background: '#FFF',
          fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#0A0A0A',
          textDecoration: 'none', textAlign: 'center',
        }}>
          Смотреть ещё
        </Link>
      </div>

      <div style={{ height: '2rem' }} />
    </>
  )
}
