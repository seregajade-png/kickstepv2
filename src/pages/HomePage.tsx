import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useProducts, useBrands } from '../hooks/useApi'
import { mapApiProduct } from '../lib/mappers'
import { getImageUrl } from '../lib/api'
import ProductCard from '../components/ProductCard'
import { useIsDesktop } from '../hooks/useMediaQuery'
import HomeDesktop from './HomeDesktop'

/* ── SVG Icons ── */
const IconDelivery = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M26 23.333C26 25.174 24.508 26.667 22.667 26.667C20.826 26.667 19.333 25.174 19.333 23.333C19.333 21.492 20.826 20 22.667 20C24.508 20 26 21.492 26 23.333Z" stroke="#0A0A0A" strokeWidth="1.75"/><path d="M12.667 23.333C12.667 25.174 11.174 26.667 9.333 26.667C7.492 26.667 6 25.174 6 23.333C6 21.492 7.492 20 9.333 20C11.174 20 12.667 21.492 12.667 23.333Z" stroke="#0A0A0A" strokeWidth="1.75"/><path d="M19.333 23.333H12.667M26 23.333H27.018C27.311 23.333 27.457 23.333 27.581 23.318C28.489 23.205 29.205 22.489 29.318 21.581C29.333 21.457 29.333 21.311 29.333 21.018V17.333C29.333 12.547 25.453 8.667 20.667 8.667M2.667 5.333H16C17.886 5.333 18.828 5.333 19.414 5.919C20 6.505 20 7.448 20 9.333V20.667M2.667 17V20C2.667 21.246 2.667 21.869 2.935 22.333C3.11 22.637 3.363 22.89 3.667 23.065C4.131 23.333 4.754 23.333 6 23.333" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.667 9.333H10.667M2.667 13.333H8" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const IconShield = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M12 17.333C12 17.333 13.333 17.333 14.667 20C14.667 20 18.902 13.333 22.667 12" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><path d="M28 14.911V11.041C28 8.854 28 7.76 27.461 7.047C26.922 6.334 25.704 5.987 23.268 5.295C21.603 4.822 20.136 4.252 18.963 3.731C17.365 3.022 16.565 2.667 16 2.667C15.435 2.667 14.636 3.022 13.037 3.731C11.865 4.252 10.397 4.822 8.732 5.295C6.296 5.987 5.078 6.334 4.539 7.047C4 7.76 4 8.854 4 11.041V14.911C4 22.411 10.75 26.911 14.125 28.693C14.935 29.12 15.34 29.333 16 29.333C16.661 29.333 17.065 29.12 17.875 28.693C21.25 26.911 28 22.411 28 14.911Z" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round"/></svg>
)
const IconHanger = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 7.333C15.131 7.333 14.389 7.888 14.114 8.666C13.929 9.187 13.358 9.46 12.837 9.276C12.317 9.092 12.044 8.52 12.228 8C12.777 6.448 14.257 5.333 16 5.333C18.209 5.333 20 7.124 20 9.333C20 10.667 19.346 11.848 18.346 12.573C17.943 12.865 17.588 13.158 17.336 13.463C17.089 13.764 17 14.006 17 14.213C17 14.536 17.177 14.833 17.461 14.986L27.604 20.469C28.669 21.045 29.333 22.159 29.333 23.37C29.333 25.191 27.857 26.667 26.036 26.667H5.964C4.143 26.667 2.667 25.191 2.667 23.37C2.667 22.159 3.331 21.045 4.396 20.469L12.53 16.073C13.015 15.81 13.622 15.991 13.885 16.477C14.147 16.963 13.967 17.569 13.481 17.832L5.347 22.228C4.928 22.455 4.667 22.893 4.667 23.37C4.667 24.086 5.247 24.667 5.964 24.667H26.036C26.753 24.667 27.333 24.086 27.333 23.37C27.333 22.893 27.072 22.455 26.653 22.228L16.51 16.746C15.58 16.243 15 15.27 15 14.213C15 13.382 15.371 12.704 15.792 12.192C16.21 11.685 16.734 11.272 17.172 10.954C17.676 10.589 18 9.999 18 9.333C18 8.229 17.105 7.333 16 7.333Z" fill="#0A0A0A"/></svg>
)
const IconInfo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3C18.6 3 21 4.8 21 12C21 19.2 18.6 21 12 21C5.4 21 3 19.2 3 12C3 4.8 5.4 3 12 3ZM11 11.25C10.586 11.25 10.25 11.586 10.25 12C10.25 12.414 10.586 12.75 11 12.75H11.25V16C11.25 16.414 11.586 16.75 12 16.75H13C13.414 16.75 13.75 16.414 13.75 16C13.75 15.586 13.414 15.25 13 15.25H12.75V12C12.75 11.586 12.414 11.25 12 11.25H11ZM12 8.25C11.586 8.25 11.25 8.586 11.25 9C11.25 9.414 11.586 9.75 12 9.75H12.01C12.424 9.75 12.76 9.414 12.76 9C12.76 8.586 12.424 8.25 12.01 8.25H12Z" fill="#B5B5B5"/></svg>
)

const advantages = [
  { icon: <IconDelivery />, label: 'Бесплатная доставка' },
  { icon: <IconShield />, label: 'Оригинальная продукция' },
  { icon: <IconHanger />, label: 'Оплата после примерки' },
]

const btnStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  height: '3rem', borderRadius: '1.5rem', border: '1.5px solid #D1D1D1',
  background: '#FFF', fontSize: '0.875rem', fontWeight: 600, color: '#0A0A0A',
  textAlign: 'center', textDecoration: 'none', width: '100%',
  fontFamily: "'Involve-SemiBold', Helvetica",
}

const CSS_RESPONSIVE = `
  /* Mobile defaults — all in rem */
  .home-hero { aspect-ratio: 4/3; border-radius: 0.875rem; }
  .home-hero-btn { width: 9.75rem; height: 2.5rem; font-size: 0.875rem; border-radius: 1.5rem; }
  .home-categories { grid-template-columns: 1fr 1fr; gap: 1rem; }
  .home-cat-label { font-size: 0.875rem; }
  .home-hits-grid { display: flex; gap: 1rem; overflow-x: auto; }
  .home-hits-card { flex-shrink: 0; width: 9.75rem; }
  .home-section-title { font-size: 1.5rem; }
  .home-advantages { flex-direction: column; gap: 0.5rem; }
  .home-advantage-card { min-height: 5.9375rem; }
  .home-brands-grid { display: flex; gap: 0.5rem; overflow-x: auto; flex-wrap: nowrap; }
  .home-brand-item { width: 6rem; height: 6rem; }
  .home-cta-section { display: block; }
  .home-cta-img { height: 15.875rem; }
  .home-cta-text { position: absolute; bottom: 0; left: 0; right: 0; }

  /* Desktop 1024+ */
  @media (min-width: 1024px) {
    .home-content { padding: 0 2.5rem !important; }
    .home-hero { aspect-ratio: auto; height: 22rem; border-radius: 1.5rem; }
    .home-hero-title { font-size: 2.5rem !important; width: auto !important; max-width: 31.25rem; }
    .home-hero-btn { width: 16.125rem; height: 3.5rem; font-size: 1.25rem; }
    .home-categories { gap: 2rem; }
    .home-cat-card { height: 22rem !important; aspect-ratio: unset !important; border-radius: 1.5rem !important; }
    .home-cat-label { font-size: 2rem !important; }
    .home-section-title { font-size: 2rem !important; }
    .home-hits-grid { display: flex !important; gap: 2rem !important; overflow-x: auto; }
    .home-hits-card { width: 17.25rem !important; flex-shrink: 0; }
    .home-hits-card img { height: 17.25rem !important; }
    .home-view-all-btn { width: 17.25rem !important; height: 3rem; border-width: 0.125rem !important; font-size: 1rem !important; border-radius: 2rem !important; }
    .home-advantages { flex-direction: row !important; gap: 1.875rem !important; }
    .home-advantage-card { width: 23.75rem !important; height: 16.25rem !important; min-height: unset !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; border-width: 0.125rem !important; }
    .home-advantage-icon { width: 3rem !important; height: 3rem !important; }
    .home-advantage-icon svg { width: 3rem !important; height: 3rem !important; }
    .home-advantage-title { font-size: 1.25rem !important; text-align: center; }
    .home-advantage-desc { display: block !important; }
    .home-brands-grid { gap: 2rem !important; flex-wrap: nowrap !important; }
    .home-brand-item { width: 13.375rem !important; height: 13.375rem !important; border-radius: 0.875rem !important; }
    .home-cta-section { display: flex !important; align-items: center; gap: 2rem; }
    .home-cta-img { height: 22.5rem !important; width: 46.125rem !important; flex-shrink: 0; border-radius: 1.5rem !important; }
    .home-cta-text { position: static !important; background: none !important; padding: 0 !important; }
    .home-cta-title { color: #0A0A0A !important; font-size: 1.5rem !important; }
    .home-tg-btn { width: 17.25rem; height: 3.25rem; font-size: 1rem !important; }
  }
`

function HomeMobile() {
  const { data: brandsData } = useBrands()
  const brands = brandsData || []
  const [activeBrandTab, setActiveBrandTab] = useState(0)
  const [activeDot, setActiveDot] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const brandTabs = brands.length > 0
    ? brands.slice(0, 5).map((b: any) => ({ name: b.name, slug: b.slug }))
    : [{ name: 'Balenciaga', slug: '' }, { name: 'Adidas', slug: '' }, { name: 'Nike', slug: '' }, { name: 'Golden goose', slug: '' }]

  const activeBrandSlug = brandTabs[activeBrandTab]?.slug || undefined
  const { data } = useProducts({ sort: 'popular', pageSize: 8, brand: activeBrandSlug })
  const products = (data?.data || []).map(mapApiProduct)

  const handleScroll = () => {
    if (!scrollRef.current) return
    setActiveDot(Math.round(scrollRef.current.scrollLeft / 172))
  }

  return (
    <>
      <Helmet><title>SNEAKER MOSCOW — Оригинальные кроссовки</title></Helmet>
      <style>{CSS_RESPONSIVE}</style>

      {/* ═══ HERO BANNER ═══ */}
      <div className="home-content" style={{ padding: '0 1rem 0' }}>
        <div className="home-hero" style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#D9D9D9' }}>
          <img src="/HOME/bg.png" alt="Баннер" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(57.52% 18.75% at 50% 50%, rgba(0,0,0,0.50) 0%, rgba(255,255,255,0.00) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="home-hero-title" style={{ width: '14.875rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 600, lineHeight: '95%', color: '#F4F6E5', fontFamily: 'Maver' }}>
              ваши ЛЮбимые Весенние модели
            </p>
          </div>
          <Link to="/catalog" className="home-hero-btn" style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '0.0625rem solid #D1D1D1', background: '#FFF', fontWeight: 600, color: '#0A0A0A', textDecoration: 'none', fontFamily: "'Involve-SemiBold', Helvetica" }}>
            В каталог
          </Link>
        </div>
      </div>

      {/* ═══ CATEGORIES ═══ */}
      <div className="home-content home-categories" style={{ display: 'grid', padding: '1rem 1rem 0' }}>
        <Link to="/men" className="home-cat-card" style={{ position: 'relative', aspectRatio: '156/213', borderRadius: '0.875rem', overflow: 'hidden', display: 'block' }}>
          <img src="/HOME/мужчины.png" alt="Мужское" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.04) 100%)' }} />
          <span className="home-cat-label" style={{ position: 'absolute', bottom: '1.125rem', left: '1rem', fontWeight: 600, color: '#FFF', zIndex: 1, fontFamily: "'Involve-SemiBold', Helvetica" }}>Мужское</span>
        </Link>
        <Link to="/women" className="home-cat-card" style={{ position: 'relative', aspectRatio: '156/213', borderRadius: '0.875rem', overflow: 'hidden', display: 'block' }}>
          <img src="/HOME/женщины.png" alt="Женское" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(143,104,104,0) 0%, rgba(245,188,178,0.41) 100%)' }} />
          <span className="home-cat-label" style={{ position: 'absolute', bottom: '1.125rem', left: '1rem', fontWeight: 600, color: '#FFF', zIndex: 1, fontFamily: "'Involve-SemiBold', Helvetica" }}>Женское</span>
        </Link>
      </div>

      {/* ═══ ХИТЫ СЕЗОНА ═══ */}
      <div className="home-content" style={{ padding: '2rem 1rem 0' }}>
        <h2 className="home-section-title" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '0.875rem', fontFamily: "'Involve-SemiBold', Helvetica" }}>Хиты сезона</h2>

        <div className="scrollbar-hide" style={{ display: 'flex', gap: '2rem', overflowX: 'auto', marginBottom: '1rem' }}>
          {brandTabs.map((tab: any, i: number) => (
            <button key={i} onClick={() => setActiveBrandTab(i)} style={{
              flexShrink: 0, fontSize: '0.9375rem', fontWeight: 500, whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit',
              color: i === activeBrandTab ? '#0A0A0A' : '#B5B5B5',
              textDecoration: i === activeBrandTab ? 'underline' : 'none', textUnderlineOffset: 4,
            }}>{tab.name}</button>
          ))}
        </div>

        {products.length > 0 && (
          <div ref={scrollRef} onScroll={handleScroll} className="home-hits-grid scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {products.map((p) => (
              <div key={p.id} className="home-hits-card" style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem 0' }}>
          {Array.from({ length: Math.max(1, Math.ceil(products.length / 2)) }).map((_, i) => (
            <button key={i} onClick={() => setActiveDot(i)} style={{
              width: '0.375rem', height: '0.375rem', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
              background: i === activeDot ? '#0A0A0A' : '#B5B5B5',
            }} />
          ))}
        </div>

        <Link to="/catalog" className="home-view-all-btn" style={btnStyle}>Смотреть все</Link>
      </div>

      {/* ═══ БРЕНДЫ ═══ */}
      <div className="home-content" style={{ padding: '2rem 1rem 0' }}>
        <h2 className="home-section-title" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '0.75rem', fontFamily: "'Involve-SemiBold', Helvetica" }}>Бренды</h2>
        <div className="home-brands-grid scrollbar-hide" style={{ marginBottom: '1rem' }}>
          {(() => {
            const ORDER = ['golden-goose','nike','adidas','balenciaga','miu-miu','new-balance','alexander-mcqueen']
            const sorted = [...brands].sort((a: any, b: any) => {
              const ai = ORDER.indexOf(a.slug); const bi = ORDER.indexOf(b.slug)
              return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
            })
            return sorted.map((b: any) => {
              const logoUrl = b.logo ? getImageUrl(b.logo) : null
              return (
                <Link key={b.id} to={`/catalog?brand=${b.slug}`} className="home-brand-item" style={{
                  flexShrink: 0, borderRadius: '0.5rem', border: '0.09375rem solid #D1D1D1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF', textDecoration: 'none', overflow: 'hidden', padding: '0.75rem',
                }}>
                  {logoUrl
                    ? <img src={logoUrl} alt={b.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                    : <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0A0A0A', textAlign: 'center', fontFamily: "'Involve-SemiBold', Helvetica" }}>{b.name}</span>
                  }
                </Link>
              )
            })
          })()}
        </div>
      </div>

      {/* ═══ НАШИ ПРЕИМУЩЕСТВА ═══ */}
      <div className="home-content" style={{ padding: '2rem 1rem 0' }}>
        <h2 className="home-section-title" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '0.75rem', fontFamily: "'Involve-SemiBold', Helvetica" }}>Наши преимущества</h2>
        <div className="home-advantages" style={{ display: 'flex' }}>
          {advantages.map((adv) => (
            <div key={adv.label} className="home-advantage-card" style={{ position: 'relative', minHeight: '5.9375rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', padding: '1rem', borderRadius: '0.875rem', border: '0.09375rem solid #D1D1D1', background: '#FFF', height: '100%', alignItems: 'flex-start' }}>
                <span className="home-advantage-icon">{adv.icon}</span>
                <span className="home-advantage-title" style={{ fontWeight: 600, fontSize: '1rem', color: '#0A0A0A', fontFamily: "'Involve-SemiBold', Helvetica" }}>{adv.label}</span>
                <span className="home-advantage-desc" style={{ display: 'none', fontFamily: "'Involve-Medium', Helvetica", fontWeight: 500, fontSize: '1rem', color: '#6E6E6E', textAlign: 'center' }}>
                  {adv.label === 'Бесплатная доставка' ? 'По Москве в пределах МКАД' :
                   adv.label === 'Оригинальная продукция' ? <>Гарантия подлинности<br/>товара в нашем каталоге</> :
                   <>Платите только за то, что подошло<br/>и понравилось</>}
                </span>
              </div>
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}><IconInfo /></div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div className="home-content home-cta-section" style={{ margin: '2rem 1rem 1.5rem', position: 'relative', borderRadius: '0.875rem', overflow: 'hidden' }}>
        <img src="/HOME/Rectangle 16.png" alt="Кроссовки" className="home-cta-img" style={{ width: '100%', height: '15.875rem', objectFit: 'cover', display: 'block', borderRadius: '0.875rem' }} />
        <div className="home-cta-text" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1rem 1.25rem', background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)' }}>
          <p className="home-cta-title" style={{ fontWeight: 700, fontSize: '1rem', color: '#FFF', lineHeight: 1.4, textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'Involve-SemiBold', Helvetica" }}>
            ОСТАЛИСЬ ВОПРОСЫ?<br />ЗАДАЙТЕ ИХ В ЧАТ ПОДДЕРЖКИ
          </p>
          <a href="https://t.me/kickstepsupport_bot" target="_blank" rel="noopener noreferrer" className="home-tg-btn" style={{
            display: 'inline-flex', height: '2.5rem', alignItems: 'center', gap: '0.5625rem', padding: '0.625rem 1rem',
            borderRadius: '1.5rem', background: '#0088CC', color: '#FFF', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', fontFamily: "'Involve-SemiBold', Helvetica",
          }}>
            Наш Telegram
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M18.239 4.103C18.448 4.012 18.677 3.98 18.902 4.012C19.126 4.043 19.339 4.136 19.517 4.281C19.695 4.426 19.832 4.618 19.914 4.837C19.996 5.055 20.02 5.292 19.983 5.523L18.065 17.542C17.879 18.701 16.647 19.366 15.618 18.788C14.757 18.305 13.478 17.561 12.328 16.784C11.753 16.395 9.991 15.15 10.207 14.265C10.393 13.507 13.354 10.661 15.045 8.969C15.709 8.304 15.406 7.92 14.622 8.532C12.675 10.05 9.549 12.359 8.516 13.009C7.604 13.582 7.128 13.68 6.56 13.582C5.523 13.404 4.561 13.128 3.776 12.792C2.716 12.337 2.767 10.831 3.776 10.393L18.239 4.103Z" fill="white"/></svg>
          </a>
        </div>
      </div>
    </>
  )
}

export default function HomePage() {
  const isDesktop = useIsDesktop()
  return isDesktop ? <><Helmet><title>SNEAKER MOSCOW — Оригинальные кроссовки</title></Helmet><HomeDesktop /></> : <HomeMobile />
}
