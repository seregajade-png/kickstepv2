import { Link } from 'react-router-dom'
import { useWishlistStore } from '../stores/wishlistStore'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types'

const F = "'Involve-SemiBold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

export default function WishlistDesktop() {
  const { items } = useWishlistStore()

  const wishlistProducts: Product[] = items.map((item) => ({
    id: item.id, slug: item.slug, name: item.name, brand: item.brand,
    images: [item.image], thumbImages: [item.image], price: item.price,
    sizes: [], colorName: item.colorName || '', colorHex: item.colorHex || '',
    colorSiblings: [], model: '',
  }))

  if (items.length === 0) {
    return (
      <div style={{ width: '80rem', maxWidth: '100%', margin: '0 auto', padding: '0 2.5rem' }}>
        <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#0A0A0A', marginTop: '1.5rem' }}>Избранное</h1>
        <div style={{ padding: '5rem 0', textAlign: 'center' }}>
          <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#0A0A0A', marginBottom: '1.5rem' }}>
            Понравилась какая-то вещь?<br/>Добавьте её в избранное и вернитесь к ней позже в любой момент
          </p>
          <Link to="/catalog" style={{
            display: 'inline-flex', width: '17.25rem', height: '3rem', justifyContent: 'center', alignItems: 'center',
            borderRadius: '2rem', border: '0.125rem solid #D1D1D1', background: '#FFF',
            fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A', textDecoration: 'none',
          }}>В каталог</Link>
        </div>
        <div style={{ height: '4rem' }} />
      </div>
    )
  }

  return (
    <div style={{ width: '80rem', maxWidth: '100%', margin: '0 auto', padding: '0 2.5rem' }}>
      <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#0A0A0A', marginTop: '1.5rem' }}>Избранное</h1>

      {/* Grid 4 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginTop: '2rem' }}>
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* "Смотреть еще" */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Link to="/catalog" style={{
          display: 'flex', width: '17.25rem', height: '3rem', justifyContent: 'center', alignItems: 'center',
          borderRadius: '2rem', border: '0.125rem solid #D1D1D1', background: '#FFF',
          fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A', textDecoration: 'none',
        }}>Смотреть еще</Link>
      </div>

      <div style={{ height: '4rem' }} />
    </div>
  )
}
