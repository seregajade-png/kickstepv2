import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCartStore } from '../stores/cartStore'
import type { Product } from '../types'

interface Props {
  product: Product
  showCartButton?: boolean
}

export default function ProductCard({ product, showCartButton = false }: Props) {
  const { isInWishlist, addItem, removeItem } = useWishlistStore()
  const addToCart = useCartStore((s) => s.addItem)
  const inWishlist = isInWishlist(product.id)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      removeItem(product.id)
    } else {
      addItem({
        id: product.id, slug: product.slug, name: product.name, brand: product.brand,
        image: product.images[0], price: product.price,
        colorName: product.colorName, colorHex: product.colorHex,
      })
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id, slug: product.slug, name: product.name, brand: product.brand,
      image: product.images[0], price: product.price, oldPrice: product.oldPrice,
      color: product.colorName || 'Default', sizeRu: '', sizeEu: '',
      quantity: 1, addedAt: new Date().toISOString(),
    })
  }

  const hasDiscount = product.oldPrice && product.oldPrice > product.price

  return (
    <Link to={`/product/${product.slug}`} className="block group">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 rounded-[14px] overflow-hidden mb-2">
        <img
          src={product.thumbImages[0]}
          alt={`${product.brand} ${product.name}`}
          className="w-full h-full object-contain p-3"
          loading="lazy"
          decoding="async"
        />
        {/* Heart */}
        <button
          onClick={toggleWishlist}
          aria-label={inWishlist ? 'Убрать из избранного' : 'Добавить в избранное'}
          className="absolute top-2.5 right-2.5 z-10"
        >
          <Heart
            size={22}
            strokeWidth={1.5}
            className={inWishlist ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-black'}
          />
        </button>
      </div>

      {/* Info */}
      <p className="text-xs font-semibold text-black leading-tight line-clamp-2">
        {product.brand} {product.name}
      </p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-[15px] font-bold text-black">
          {product.price.toLocaleString('ru-RU')} ₽
        </span>
        {hasDiscount && (
          <span className="text-xs text-gray-600 line-through">
            {product.oldPrice!.toLocaleString('ru-RU')} ₽
          </span>
        )}
      </div>

      {/* Cart button */}
      {showCartButton && (
        <button
          onClick={handleAddToCart}
          className="w-full mt-2 py-2.5 text-sm font-semibold border border-gray-300 rounded-[24px] hover:bg-black hover:text-white hover:border-black transition"
        >
          В корзину
        </button>
      )}
    </Link>
  )
}
