import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'

import HomePage from './pages/HomePage'

const CatalogPage = lazy(() => import('./pages/CatalogPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const HelpPage = lazy(() => import('./pages/HelpPage'))
const DeliveryPage = lazy(() => import('./pages/DeliveryPage'))
const PaymentPage = lazy(() => import('./pages/PaymentPage'))
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const OfferPage = lazy(() => import('./pages/OfferPage'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'))
const SizeGuidePage = lazy(() => import('./pages/SizeGuidePage'))

const MARQUEE_ITEMS = [
  'Бесплатная доставка по Москве',
  '100% оригинал',
  'Оплата после примерки',
  'Доставка по РФ СДЭК',
  'Скидка 5% за наличные',
]

function MarqueeBanner({ fixed }: { fixed?: boolean }) {
  const style: React.CSSProperties = fixed
    ? { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90 }
    : { zIndex: 90 }

  return (
    <div style={{ ...style, background: '#F4F4F4', overflow: 'hidden', padding: '0.75rem 0' }}>
      <style>{`
        @keyframes appmarq { to { transform: translateX(-50%); } }
        .app-marq-track {
          display: flex; gap: 1.5rem;
          animation: appmarq 8s linear infinite;
          white-space: nowrap; will-change: transform;
        }
        .app-marq-sticky { position: sticky; top: 4rem; z-index: 49; }
        @media (min-width: 1024px) {
          .app-marq-track { gap: 2rem; animation-duration: 14s; }
          .app-marq-sticky { top: 4.5rem; }
        }
      `}</style>
      <div className="app-marq-track">
        {[...Array(2)].flatMap((_, ii) =>
          MARQUEE_ITEMS.flatMap((t, i) => [
            <span key={`${ii}-${i}`} style={{
              flexShrink: 0, fontSize: '0.8125rem', fontWeight: 500,
              color: '#0A0A0A', fontFamily: "'Involve-SemiBold', Helvetica",
            }}>{t}</span>,
            <span key={`${ii}-${i}-dot`} style={{ flexShrink: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0A0A0A', opacity: 0.55, lineHeight: 1 }}>•</span>,
          ])
        )}
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  const navType = useNavigationType()
  useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo(0, 0)
    }
  }, [pathname, navType])
  return null
}

function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      {isHome && (
        <div className="app-marq-sticky">
          <MarqueeBanner />
        </div>
      )}
      <main className="flex-1" style={isHome ? {} : { paddingBottom: '2.5rem' }}>
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/success" element={<OrderSuccessPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/offer" element={<OfferPage />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/men" element={<CatalogPage />} />
            <Route path="/women" element={<CatalogPage />} />
            <Route path="*" element={
              <div className="py-20 text-center px-4">
                <h1 className="text-2xl font-semibold mb-4">404</h1>
                <p className="text-gray-600">Страница не найдена</p>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {!isHome && <MarqueeBanner fixed />}
      <Toast />
    </div>
  )
}

export default App
