// Header component
import { Link } from 'react-router-dom'
import { Menu, Search, Heart, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'

export default function Header() {
  // TODO: implement menu and search drawers
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const wishlistCount = useWishlistStore((s) => s.items.length)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300">
      <div className="flex items-center justify-between h-16 px-4 max-w-[1440px] mx-auto">
        {/* Left: burger */}
        <button aria-label="Меню" className="w-6 h-6">
          <Menu size={24} strokeWidth={1.5} />
        </button>

        {/* Center: logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold tracking-tight">
          KICKSTEP
        </Link>

        {/* Right: icons */}
        <div className="flex items-center gap-4">
          <Link to="/search" aria-label="Поиск">
            <Search size={24} strokeWidth={1.5} />
          </Link>
          <Link to="/wishlist" aria-label="Избранное" className="relative">
            <Heart size={24} strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" aria-label="Корзина" className="relative">
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
