import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Shield, Truck } from 'lucide-react'
import { useProducts, useBrands } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const { data } = useProducts({ sort: 'popular', pageSize: 8 })
  const products = (data?.data || []).map(mapApiProduct)
  const { data: brandsData } = useBrands()
  const brands = brandsData || []

  const [hitsPage, setHitsPage] = useState(0)
  const hitsRef = useRef<HTMLDivElement>(null)
  const hitsPerPage = 2
  const totalHitsPages = Math.ceil(products.length / hitsPerPage)
  const visibleHits = products.slice(hitsPage * hitsPerPage, (hitsPage + 1) * hitsPerPage)

  return (
    <>
      <Helmet>
        <title>KICKSTEP — Магазин брендовых кроссовок</title>
      </Helmet>

      <div className="px-4 max-w-[1440px] mx-auto">
        {/* Hero Banner */}
        <div className="relative mt-2 rounded-[14px] overflow-hidden aspect-[328/328] lg:aspect-[3/1]">
          <img src="/images/hero_banner.png" alt="KICKSTEP" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="font-[Maver] text-2xl lg:text-4xl text-white uppercase leading-[95%]">
              Самые подлинные кроссовки в одном месте
            </p>
            <Link
              to="/catalog"
              className="inline-block mt-3 px-4 py-2 bg-white text-black text-sm font-semibold rounded-[24px]"
            >
              Перейти в каталог
            </Link>
          </div>
        </div>

        {/* Hits section */}
        {products.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-semibold">Хиты сезона</h2>
              <Link to="/catalog" className="text-sm text-gray-400">Все модели</Link>
            </div>
            <p className="text-sm text-gray-600 mb-4">В наличии сейчас</p>

            <div ref={hitsRef} className="grid grid-cols-2 gap-4">
              {visibleHits.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Dots */}
            {totalHitsPages > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {Array.from({ length: totalHitsPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHitsPage(i)}
                    className={`w-1.5 h-1.5 rounded-full transition ${i === hitsPage ? 'bg-black' : 'bg-gray-400'}`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Бренды</h2>
            <div className="flex gap-8 overflow-x-auto scrollbar-hide pb-2 items-center">
              {brands.map((b: any) => (
                <Link
                  key={b.id}
                  to={`/catalog?brand=${b.slug}`}
                  className="flex-shrink-0 text-[15px] font-medium text-gray-400 hover:text-black transition"
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Advantages */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Наши преимущества</h2>
          <div className="flex flex-col gap-3">
            {[
              { icon: <Shield size={32} strokeWidth={1.5} />, title: 'Гарантия оригинальности' },
              { icon: <Truck size={32} strokeWidth={1.5} />, title: 'Бесплатная доставка' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 p-4 rounded-[14px] border border-gray-300">
                <span className="text-black">{item.icon}</span>
                <span className="text-xs font-semibold">{item.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom promo block */}
        <section className="mt-8 mb-8 rounded-[14px] overflow-hidden bg-black text-white p-6">
          <p className="text-xs text-gray-400 mb-1">Оплата после примерки</p>
          <p className="text-xl font-semibold leading-tight mb-4">
            УДОБНАЯ ОПЛАТА НАЛИЧНЫМИ И ПО КАРТЕ
          </p>
          <Link
            to="/catalog"
            className="inline-block px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-[24px]"
          >
            В каталог
          </Link>
        </section>
      </div>
    </>
  )
}
