import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '../stores/wishlistStore'
import type { Product } from '../types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { isInWishlist, addItem, removeItem } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      removeItem(product.id)
    } else {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        price: product.price,
        colorName: product.colorName,
        colorHex: product.colorHex,
      })
    }
  }

  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discountPercent = hasDiscount ? Math.round((1 - product.price / product.oldPrice!) * 100) : 0

  return (
    <Link to={`/product/${product.slug}`} className="block group">
      <div className="rounded-[14px] overflow-hidden bg-white border border-gray-300">
        {/* Image */}
        <div className="relative aspect-square bg-white overflow-hidden">
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
              size={24}
              strokeWidth={1.5}
              className={inWishlist ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-gray-400'}
            />
          </button>
          {/* Sale badge */}
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-white text-gray-600 text-[13px] px-3 py-1 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="px-3 py-2 pb-3">
          <p className="text-xs font-semibold text-black truncate">
            {product.brand} {product.name}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[15px] font-bold text-black">
              {product.price.toLocaleString('ru-RU')} ₽
            </span>
            {hasDiscount && (
              <span className="text-xs font-semibold text-gray-600 line-through">
                {product.oldPrice!.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
