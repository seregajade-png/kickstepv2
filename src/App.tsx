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
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
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
      <Toast />
    </div>
  )
}

export default App
