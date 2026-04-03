import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useWishlistStore } from '../stores/wishlistStore'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types'

export default function WishlistPage() {
  const { items } = useWishlistStore()

  const wishlistProducts: Product[] = items.map((item) => ({
    id: item.id, slug: item.slug, name: item.name, brand: item.brand,
    images: [item.image], thumbImages: [item.image], price: item.price,
    sizes: [], colorName: item.colorName || '', colorHex: item.colorHex || '',
    colorSiblings: [], model: '',
  }))

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Избранное — KICKSTEP</title></Helmet>
        <div className="px-4 py-20 text-center max-w-[1440px] mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Избранное пусто</h1>
          <Link to="/catalog" className="inline-block py-3 px-8 bg-black text-white text-sm font-semibold rounded-[24px]">
            В каталог
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>Избранное — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        <h1 className="text-2xl font-semibold mb-4">Избранное</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  )
}
