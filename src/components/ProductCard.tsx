import { Link } from 'react-router-dom'
import { useWishlistStore } from '../stores/wishlistStore'
import type { Product } from '../types'

interface Props {
  product: Product
  showCartButton?: boolean
}

export default function ProductCard({ product }: Props) {
  const { isInWishlist, addItem, removeItem } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) removeItem(product.id)
    else addItem({
      id: product.id, slug: product.slug, name: product.name, brand: product.brand,
      image: product.images[0], price: product.price,
      colorName: product.colorName, colorHex: product.colorHex,
    })
  }

  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.oldPrice!) * 100) : 0

  return (
    <Link to={`/product/${product.slug}`} style={{ display: 'block', textDecoration: 'none', width: '100%', borderRadius: '0.875rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', background: '#FFF' }}>
        <div style={{ position: 'relative', aspectRatio: '1/1', alignSelf: 'stretch', overflow: 'hidden', borderRadius: '0.875rem 0.875rem 0 0' }}>
          <img src={product.thumbImages[0]} alt={`${product.brand} ${product.name}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s', padding: '0.5rem' }} loading="lazy" />
          {hasDiscount && discountPct > 0 && (
            <div style={{ position: 'absolute', top: '0.625rem', left: '0.625rem', height: '1.5rem', display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem', background: '#FFF', borderRadius: '1.5rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: '#6E6E6E' }}>-{discountPct}%</span>
            </div>
          )}
          <button onClick={toggleWishlist} style={{ position: 'absolute', top: '0.625rem', right: '0.625rem', width: '1.5rem', height: '1.5rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none">
              <path d="M19.513 12.583L12.013 20.011L4.513 12.583C4.018 12.102 3.629 11.523 3.369 10.884C3.108 10.245 2.984 9.558 3.002 8.868C3.02 8.178 3.181 7.5 3.474 6.875C3.768 6.25 4.187 5.693 4.706 5.238C5.226 4.783 5.834 4.441 6.492 4.233C7.15 4.025 7.844 3.955 8.53 4.028C9.217 4.101 9.88 4.316 10.48 4.658C11.079 5.001 11.601 5.463 12.013 6.017C12.427 5.467 12.949 5.009 13.548 4.67C14.147 4.331 14.81 4.12 15.494 4.049C16.178 3.978 16.87 4.049 17.526 4.258C18.182 4.466 18.787 4.808 19.305 5.262C19.822 5.715 20.24 6.271 20.533 6.893C20.826 7.516 20.988 8.192 21.007 8.88C21.027 9.568 20.904 10.252 20.647 10.891C20.39 11.529 20.004 12.107 19.513 12.589"
                fill={inWishlist ? '#EC221F' : 'white'} stroke={inWishlist ? '#EC221F' : '#6E6E6E'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem 0.75rem 0.75rem' }}>
          <p style={{ fontFamily: "'Involve-SemiBold', Helvetica", fontWeight: 600, fontSize: '0.75rem', color: '#0A0A0A', lineHeight: 'normal', margin: 0 }}>
            Кроссовки {product.brand} {product.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ fontFamily: "'Involve-Bold', Helvetica", fontWeight: 700, fontSize: '0.9375rem', color: '#0A0A0A' }}>
              {product.price.toLocaleString('ru-RU')} ₽
            </span>
            {hasDiscount && (
              <span style={{ fontFamily: "'Involve-SemiBold', Helvetica", fontWeight: 600, fontSize: '0.75rem', color: '#6E6E6E', textDecoration: 'line-through' }}>
                {product.oldPrice!.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
