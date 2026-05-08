import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { useIsDesktop } from '../hooks/useMediaQuery'
import MenuDrawer from './MenuDrawer'

const F = "'Involve-SemiBold', Helvetica"

const navItems = [
  { label: 'Новинки', to: '/catalog?sort=new' },
  { label: 'Мужское', to: '/men' },
  { label: 'Женское', to: '/women' },
]
const helpItem = { label: 'Помощь', to: '/help' }

const iconSearch = <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none"><path d="M17 17L21 21" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 11C19 6.582 15.418 3 11 3C6.582 3 3 6.582 3 11C3 15.418 6.582 19 11 19C15.418 19 19 15.418 19 11Z" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const iconHeart = <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none"><path d="M19.513 12.583L12.013 20.011L4.513 12.583C4.018 12.102 3.629 11.523 3.369 10.884C3.108 10.245 2.984 9.558 3.002 8.868C3.02 8.178 3.181 7.5 3.474 6.875C3.768 6.25 4.187 5.693 4.706 5.238C5.226 4.783 5.834 4.441 6.492 4.233C7.15 4.025 7.844 3.955 8.53 4.028C9.217 4.101 9.88 4.316 10.48 4.658C11.079 5.001 11.601 5.463 12.013 6.017C12.427 5.467 12.949 5.009 13.548 4.67C14.147 4.331 14.81 4.12 15.494 4.049C16.178 3.978 16.87 4.049 17.526 4.258C18.182 4.466 18.787 4.808 19.305 5.262C19.822 5.715 20.24 6.271 20.533 6.893C20.826 7.516 20.988 8.192 21.007 8.88C21.027 9.568 20.904 10.252 20.647 10.891C20.39 11.529 20.004 12.107 19.513 12.589" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const iconCart = <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none"><path d="M8 16L16.72 15.273C19.449 15.046 20.061 14.45 20.364 11.729L21 6" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/><path d="M6 6H22" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/><circle cx="6" cy="20" r="2" stroke="#0A0A0A" strokeWidth="1.5"/><circle cx="17" cy="20" r="2" stroke="#0A0A0A" strokeWidth="1.5"/><path d="M8 20H15" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 2H2.966C3.911 2 4.734 2.625 4.963 3.515L7.939 15.077C8.089 15.661 7.96 16.28 7.588 16.762L6.632 18" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/></svg>
const iconBurger = <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M20.75 7C20.75 7.414 20.414 7.75 20 7.75H4C3.586 7.75 3.25 7.414 3.25 7C3.25 6.586 3.586 6.25 4 6.25H20C20.414 6.25 20.75 6.586 20.75 7Z" fill="#0A0A0A"/><path fillRule="evenodd" clipRule="evenodd" d="M20.75 12C20.75 12.414 20.414 12.75 20 12.75H4C3.586 12.75 3.25 12.414 3.25 12C3.25 11.586 3.586 11.25 4 11.25H20C20.414 11.25 20.75 11.586 20.75 12Z" fill="#0A0A0A"/><path fillRule="evenodd" clipRule="evenodd" d="M20.75 17C20.75 17.414 20.414 17.75 20 17.75H4C3.586 17.75 3.25 17.414 3.25 17C3.25 16.586 3.586 16.25 4 16.25H20C20.414 16.25 20.75 16.586 20.75 17Z" fill="#0A0A0A"/></svg>

const Badge = ({ count }: { count: number }) => count > 0 ? (
  <span style={{ position: 'absolute', top: '-0.25rem', right: '-0.25rem', background: '#EC221F', color: '#FFF', fontSize: '0.5rem', width: '0.875rem', height: '0.875rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{count}</span>
) : null

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '0.0625rem solid var(--stroke)', background: '#FFF' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', width: '80rem', maxWidth: '100%', margin: '0 auto', height: '4.5rem', alignItems: 'center', padding: '0 2.5rem', gap: '1rem' }}>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: 'var(--black)', textDecoration: 'none' }}>{item.label}</Link>
            ))}
          </nav>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/images/photo_2026-04-19_17-09-17-Photoroom.png" alt="Sneaker Moscow" style={{ height: '2rem', width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'flex-end' }}>
            <Link to={helpItem.to} style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: 'var(--black)', textDecoration: 'none', marginRight: '0.5rem' }}>{helpItem.label}</Link>
            <Link to="/search" style={{ display: 'flex' }}>{iconSearch}</Link>
            <Link to="/wishlist" style={{ display: 'flex', position: 'relative' }}>{iconHeart}<Badge count={wishlistCount} /></Link>
            <Link to="/cart" style={{ display: 'flex', position: 'relative' }}>{iconCart}<Badge count={cartCount} /></Link>
          </div>
        </div>
      </header>
    )
  }

  // Mobile header
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '0.0625rem solid var(--stroke)', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(0.75rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/search" style={{ display: 'flex' }}>{iconSearch}</Link>
            <Link to="/wishlist" style={{ display: 'flex', position: 'relative' }}>{iconHeart}<Badge count={wishlistCount} /></Link>
          </div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/photo_2026-04-19_17-09-17-Photoroom.png" alt="Sneaker Moscow" style={{ height: '1.5rem', width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/cart" style={{ display: 'flex', position: 'relative' }}>{iconCart}<Badge count={cartCount} /></Link>
            <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{iconBurger}</button>
          </div>
        </div>
      </header>
      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
