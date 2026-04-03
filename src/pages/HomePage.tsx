import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useProducts, useBrands } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const { data } = useProducts({ sort: 'popular', pageSize: 4 })
  const products = (data?.data || []).map(mapApiProduct)
  const { data: brandsData } = useBrands()
  const brands = brandsData || []

  return (
    <>
      <Helmet>
        <title>KICKSTEP — Магазин брендовых кроссовок</title>
      </Helmet>

      <div className="px-4 max-w-[1440px] mx-auto">
        {/* Hero Banner */}
        <div className="relative mt-4 rounded-[14px] overflow-hidden aspect-square lg:aspect-[3/1] bg-gray-100">
          <img src="/images/hero_banner.png" alt="KICKSTEP" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-8 bg-gradient-to-t from-black/40 to-transparent">
            <h1 className="font-[Maver] text-2xl lg:text-5xl text-white uppercase leading-[95%]">
              ОРИГИНАЛЬНАЯ ПРОДУКЦИЯ ДЛЯ КАЖДОГО
            </h1>
            <Link to="/catalog" className="mt-4 bg-white text-black text-sm font-semibold px-4 py-2 rounded-pill w-fit">
              ПЕРЕЙТИ В КАТАЛОГ
            </Link>
          </div>
        </div>

        {/* Gender tiles */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Link to="/men" className="relative aspect-[156/213] rounded-[14px] overflow-hidden bg-gray-100">
            <img src="/images/catalog_male.png" alt="Мужское" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/40 to-transparent">
              <span className="text-white text-base font-semibold">МУЖСКОЕ</span>
            </div>
          </Link>
          <Link to="/women" className="relative aspect-[156/213] rounded-[14px] overflow-hidden bg-gray-100">
            <img src="/images/catalog_female.png" alt="Женское" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/40 to-transparent">
              <span className="text-white text-base font-semibold">ЖЕНСКОЕ</span>
            </div>
          </Link>
        </div>

        {/* Hits */}
        {products.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Хиты продаж</h2>
              <Link to="/catalog" className="text-sm text-gray-600">Все</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Бренды</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {brands.map((b: any) => (
                <Link key={b.id} to={`/catalog?brand=${b.slug}`} className="flex-shrink-0 w-24 h-24 rounded-lg border border-gray-300 flex items-center justify-center bg-white">
                  <span className="text-xs font-medium text-center px-1">{b.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Advantages */}
        <section className="mt-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {[
              { title: 'Гарантия оригинальности', icon: '🛡️' },
              { title: 'Бесплатная доставка по Москве', icon: '🚚' },
              { title: 'Оплата после примерки', icon: '👟' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 p-4 rounded-[14px] border border-gray-300 bg-white">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-semibold">{item.title}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
