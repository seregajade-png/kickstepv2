import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Heart, ArrowLeft, ChevronDown, ShoppingBag } from 'lucide-react'
import { useProduct, useProducts } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import ProductCard from '../components/ProductCard'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addToCart = useCartStore((s) => s.addItem)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  const { data: apiProduct, isLoading } = useProduct(slug || '')
  const product = apiProduct ? mapApiProduct(apiProduct) : null

  const { data: suggestedData } = useProducts(
    product ? { pageSize: 8, sort: 'popular' } : undefined
  )
  const suggestedProducts = useMemo(() =>
    (suggestedData?.data || [])
      .map(mapApiProduct)
      .filter((p) => p.slug !== slug && p.brand !== product?.brand)
      .slice(0, 4),
    [suggestedData, slug, product]
  )

  const colorSiblings = useMemo(() => product?.colorSiblings || [], [product])

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  useEffect(() => {
    setActiveImageIndex(0)
    setSelectedSize(null)
  }, [slug])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Товар не найден</h1>
        <Link to="/catalog" className="text-sm text-gray-600 underline">Вернуться в каталог</Link>
      </div>
    )
  }

  const allImages = product.images
  const inWishlist = isInWishlist(product.id)
  const selectedSizeObj = product.sizes.find((s) => s.eu === selectedSize)
  const hasDiscount = product.oldPrice && product.oldPrice > product.price

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id, slug: product.slug, name: product.name, brand: product.brand,
        image: product.images[0], price: product.price, colorName: product.colorName, colorHex: product.colorHex,
      })
    }
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeDropdownOpen(true)
      return
    }
    addToCart({
      id: product.id, slug: product.slug, name: product.name, brand: product.brand,
      image: allImages[0], price: product.price, oldPrice: product.oldPrice,
      color: product.colorName || 'Default',
      sizeRu: selectedSizeObj?.ru || '', sizeEu: selectedSizeObj?.eu || selectedSize || '',
      quantity: 1, addedAt: new Date().toISOString(),
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (product.sizes.length > 0 && !selectedSize) { setSizeDropdownOpen(true); return }
    handleAddToCart()
    navigate('/cart')
  }

  const prevImage = () => setActiveImageIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))
  const nextImage = () => setActiveImageIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) { if (diff > 0) nextImage(); else prevImage() }
    setTouchStart(null)
  }

  return (
    <>
      <Helmet>
        <title>{`${product.brand} ${product.name} — KICKSTEP`}</title>
        <meta name="description" content={`${product.brand} ${product.name}. Цена ${product.price.toLocaleString('ru-RU')} ₽. Оригинал.`} />
      </Helmet>

      <div className="px-4 max-w-[1440px] mx-auto pb-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 py-3 text-sm text-gray-600">
          <ArrowLeft size={18} /> Назад
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Gallery */}
          <div>
            <div
              className="relative rounded-[14px] overflow-hidden bg-white aspect-square"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img src={allImages[activeImageIndex]} alt={product.name} className="w-full h-full object-contain p-4" />
              <button onClick={handleToggleWishlist} className="absolute top-3 right-3">
                <Heart size={24} strokeWidth={1.5} className={inWishlist ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-gray-400'} />
              </button>
            </div>
            {/* Dots */}
            {allImages.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {allImages.map((_, i) => (
                  <button key={i} onClick={() => setActiveImageIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition ${i === activeImageIndex ? 'bg-black' : 'bg-gray-400'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-4 lg:mt-0">
            <h1 className="text-xl font-semibold">{product.brand}</h1>
            <p className="text-base text-gray-600 mt-1">{product.name}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-xl font-bold">{product.price.toLocaleString('ru-RU')} ₽</span>
              {hasDiscount && (
                <span className="text-sm text-gray-600 line-through">{product.oldPrice!.toLocaleString('ru-RU')} ₽</span>
              )}
            </div>

            {/* Color siblings */}
            {colorSiblings.length > 0 && (
              <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
                {product.colorHex && (
                  <div className="w-16 h-16 rounded-[14px] border-2 border-black overflow-hidden flex-shrink-0">
                    <img src={product.images[0]} alt="" className="w-full h-full object-contain p-1" />
                  </div>
                )}
                {colorSiblings.map((sib) => (
                  <Link key={sib.slug} to={`/product/${sib.slug}`}
                    className="w-16 h-16 rounded-[14px] border border-gray-300 overflow-hidden flex-shrink-0 hover:border-black transition"
                  >
                    <img src={sib.image} alt={sib.colorName} className="w-full h-full object-contain p-1" />
                  </Link>
                ))}
              </div>
            )}

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div className="mt-4 relative">
                <button
                  onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-[24px] border border-gray-300 text-sm"
                >
                  <span className={selectedSize ? 'text-black' : 'text-gray-400'}>
                    {selectedSize ? `EU ${selectedSize}` : 'Выберите размер'}
                  </span>
                  <ChevronDown size={18} className={`transition ${sizeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {sizeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-[14px] shadow-lg z-20 mt-1 max-h-[300px] overflow-y-auto">
                    {product.sizes.map((size) => (
                      <button
                        key={size.eu}
                        onClick={() => { setSelectedSize(size.eu); setSizeDropdownOpen(false) }}
                        disabled={!size.inStock}
                        className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 transition ${
                          selectedSize === size.eu ? 'bg-black text-white' :
                          size.inStock ? 'hover:bg-gray-100' : 'text-gray-400 line-through cursor-not-allowed'
                        }`}
                      >
                        EU {size.eu}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button onClick={handleBuyNow}
                className="flex-1 py-3 bg-black text-white text-sm font-semibold rounded-[24px]"
              >
                КУПИТЬ СЕЙЧАС
              </button>
              <button onClick={handleAddToCart}
                className={`flex items-center justify-center w-12 h-12 rounded-full border transition ${
                  addedToCart ? 'bg-green-600 border-green-600' : 'border-gray-300 hover:border-black'
                }`}
              >
                <ShoppingBag size={20} className={addedToCart ? 'text-white' : ''} />
              </button>
            </div>

            {/* Description accordion */}
            <div className="mt-6 p-4 bg-gray-100 rounded-[14px]">
              <p className="text-base font-semibold">Описание</p>
              <p className="text-sm text-gray-600 mt-2">
                {product.description || `${product.brand} ${product.name} — оригинальные кроссовки.`}
              </p>
            </div>
          </div>
        </div>

        {/* Suggested */}
        {suggestedProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Вам также понравится</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {suggestedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
