import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts, useBrands } from '../hooks/useApi'
import { getImageUrl } from '../lib/api'
import { mapApiProduct } from '../lib/mappers'
import ProductCard from '../components/ProductCard'

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"

/* ── Icons (48px for desktop) ── */
const IconDelivery48 = () => <svg width="48" height="48" viewBox="0 0 32 32" fill="none"><path d="M26 23.333C26 25.174 24.508 26.667 22.667 26.667C20.826 26.667 19.333 25.174 19.333 23.333C19.333 21.492 20.826 20 22.667 20C24.508 20 26 21.492 26 23.333Z" stroke="#0A0A0A" strokeWidth="1.75"/><path d="M12.667 23.333C12.667 25.174 11.174 26.667 9.333 26.667C7.492 26.667 6 25.174 6 23.333C6 21.492 7.492 20 9.333 20C11.174 20 12.667 21.492 12.667 23.333Z" stroke="#0A0A0A" strokeWidth="1.75"/><path d="M19.333 23.333H12.667M26 23.333H27.018C27.311 23.333 27.457 23.333 27.581 23.318C28.489 23.205 29.205 22.489 29.318 21.581C29.333 21.457 29.333 21.311 29.333 21.018V17.333C29.333 12.547 25.453 8.667 20.667 8.667M2.667 5.333H16C17.886 5.333 18.828 5.333 19.414 5.919C20 6.505 20 7.448 20 9.333V20.667M2.667 17V20C2.667 21.246 2.667 21.869 2.935 22.333C3.11 22.637 3.363 22.89 3.667 23.065C4.131 23.333 4.754 23.333 6 23.333" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.667 9.333H10.667M2.667 13.333H8" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
const IconShield48 = () => <svg width="48" height="48" viewBox="0 0 32 32" fill="none"><path d="M12 17.333C12 17.333 13.333 17.333 14.667 20C14.667 20 18.902 13.333 22.667 12" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><path d="M28 14.911V11.041C28 8.854 28 7.76 27.461 7.047C26.922 6.334 25.704 5.987 23.268 5.295C21.603 4.822 20.136 4.252 18.963 3.731C17.365 3.022 16.565 2.667 16 2.667C15.435 2.667 14.636 3.022 13.037 3.731C11.865 4.252 10.397 4.822 8.732 5.295C6.296 5.987 5.078 6.334 4.539 7.047C4 7.76 4 8.854 4 11.041V14.911C4 22.411 10.75 26.911 14.125 28.693C14.935 29.12 15.34 29.333 16 29.333C16.661 29.333 17.065 29.12 17.875 28.693C21.25 26.911 28 22.411 28 14.911Z" stroke="#0A0A0A" strokeWidth="1.75" strokeLinecap="round"/></svg>
const IconHanger48 = () => <svg width="48" height="48" viewBox="0 0 32 32" fill="none"><path d="M16 7.333C15.131 7.333 14.389 7.888 14.114 8.666C13.929 9.187 13.358 9.46 12.837 9.276C12.317 9.092 12.044 8.52 12.228 8C12.777 6.448 14.257 5.333 16 5.333C18.209 5.333 20 7.124 20 9.333C20 10.667 19.346 11.848 18.346 12.573C17.943 12.865 17.588 13.158 17.336 13.463C17.089 13.764 17 14.006 17 14.213C17 14.536 17.177 14.833 17.461 14.986L27.604 20.469C28.669 21.045 29.333 22.159 29.333 23.37C29.333 25.191 27.857 26.667 26.036 26.667H5.964C4.143 26.667 2.667 25.191 2.667 23.37C2.667 22.159 3.331 21.045 4.396 20.469L12.53 16.073C13.015 15.81 13.622 15.991 13.885 16.477C14.147 16.963 13.967 17.569 13.481 17.832L5.347 22.228C4.928 22.455 4.667 22.893 4.667 23.37C4.667 24.086 5.247 24.667 5.964 24.667H26.036C26.753 24.667 27.333 24.086 27.333 23.37C27.333 22.893 27.072 22.455 26.653 22.228L16.51 16.746C15.58 16.243 15 15.27 15 14.213C15 13.382 15.371 12.704 15.792 12.192C16.21 11.685 16.734 11.272 17.172 10.954C17.676 10.589 18 9.999 18 9.333C18 8.229 17.105 7.333 16 7.333Z" fill="#0A0A0A"/></svg>
const IconInfo32 = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 3C18.6 3 21 4.8 21 12C21 19.2 18.6 21 12 21C5.4 21 3 19.2 3 12C3 4.8 5.4 3 12 3ZM11 11.25C10.586 11.25 10.25 11.586 10.25 12C10.25 12.414 10.586 12.75 11 12.75H11.25V16C11.25 16.414 11.586 16.75 12 16.75H13C13.414 16.75 13.75 16.414 13.75 16C13.75 15.586 13.414 15.25 13 15.25H12.75V12C12.75 11.586 12.414 11.25 12 11.25H11ZM12 8.25C11.586 8.25 11.25 8.586 11.25 9C11.25 9.414 11.586 9.75 12 9.75H12.01C12.424 9.75 12.76 9.414 12.76 9C12.76 8.586 12.424 8.25 12.01 8.25H12Z" fill="#B5B5B5"/></svg>

const benefits = [
  { icon: <IconShield48 />, title: 'Оригинальная продукция', desc: <>Гарантия подлинности<br/>товара в нашем каталоге</> },
  { icon: <IconDelivery48 />, title: 'Бесплатная доставка', desc: 'По Москве в пределах МКАД' },
  { icon: <IconHanger48 />, title: 'Оплата после примерки', desc: <>Платите только за то, что подошло<br/>и понравилось</> },
]

export default function HomeDesktop() {
  const { data: brandsData } = useBrands()
  const brands = brandsData || []
  const [activeBrand, setActiveBrand] = useState(0)

  const brandTabs = brands.length > 0
    ? brands.slice(0, 4).map((b: any) => ({ name: b.name, slug: b.slug }))
    : [{ name: 'Balenciaga', slug: '' }, { name: 'Adidas', slug: '' }, { name: 'Nike', slug: '' }, { name: 'Golden goose', slug: '' }]

  const activeBrandSlug = brandTabs[activeBrand]?.slug || undefined
  const { data } = useProducts({ sort: 'popular', pageSize: 8, brand: activeBrandSlug })
  const products = (data?.data || []).map(mapApiProduct)

  const BRAND_ORDER = ['golden-goose','nike','adidas','balenciaga','miu-miu','new-balance','alexander-mcqueen']
  const brandLogos = [...brands].sort((a: any, b: any) => {
    const ai = BRAND_ORDER.indexOf(a.slug); const bi = BRAND_ORDER.indexOf(b.slug)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  }).map((b: any) => {
    const logoUrl = b.logo ? getImageUrl(b.logo) : null
    return { name: b.name, slug: b.slug, img: logoUrl }
  })

  return (
    <div style={{ width: '80rem', maxWidth: '100%', margin: '0 auto' }}>
      {/* ═══ HERO ═══ */}
      <div style={{ padding: '1.5rem 2.5rem 0' }}>
        <div style={{ position: 'relative', width: '100%', height: '22rem', background: '#D9D9D9', borderRadius: '1.5rem', overflow: 'hidden' }}>
          <img src="/images/Dropout_-24_0817bd5f-37a3-4edd-8e30-60869832cd67.jpg" alt="Баннер" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '2rem' }}>
            <Link to="/catalog" style={{
              display: 'flex', width: '16.125rem', height: '3.5rem', justifyContent: 'center', alignItems: 'center',
              borderRadius: '1.5rem', border: '0.0625rem solid var(--stroke)', background: '#FFF',
              fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: 'var(--black)', textDecoration: 'none',
            }}>В каталог</Link>
          </div>
        </div>
      </div>

      {/* ═══ CATEGORIES ═══ */}
      <div style={{ display: 'flex', gap: '2rem', padding: '2rem 2.5rem 0' }}>
        <Link to="/men" style={{ position: 'relative', flex: 1, height: '22rem', borderRadius: '1.5rem', overflow: 'hidden', display: 'block' }}>
          <img src="/screenshots/e4e51ea513238fdfa030deeeb75a601f75d56d8f.png" alt="Мужское" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.04) 100%)' }} />
          <span style={{ position: 'absolute', bottom: '2rem', left: '2rem', fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#FFF' }}>Мужское</span>
        </Link>
        <Link to="/women" style={{ position: 'relative', flex: 1, height: '22rem', borderRadius: '1.5rem', overflow: 'hidden', display: 'block' }}>
          <img src="/screenshots/571714939e634d724f67a131908ac6b2895414e4.png" alt="Женское" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(143,104,104,0) 0%, rgba(245,188,178,0.41) 100%)' }} />
          <span style={{ position: 'absolute', bottom: '2rem', left: '2rem', fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#FFF' }}>Женское</span>
        </Link>
      </div>

      {/* ═══ ХИТЫ СЕЗОНА ═══ */}
      <div style={{ padding: '4rem 2.5rem 0' }}>
        <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: 'var(--black)', marginBottom: '1rem' }}>Хиты сезона</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="scrollbar-hide" style={{ display: 'flex', gap: '2rem', overflow: 'auto' }}>
            {brandTabs.map((tab: any, i: number) => (
              <button key={i} onClick={() => setActiveBrand(i)} style={{
                fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: 'var(--black)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                textDecoration: activeBrand === i ? 'underline' : 'none', textUnderlineOffset: '0.25rem',
              }}>{tab.name}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '3.5rem', background: '#F4F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </div>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '3.5rem', background: '#F4F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>
        </div>

        {products.length > 0 && (
          <div className="scrollbar-hide" style={{ display: 'flex', gap: '2rem', overflow: 'auto' }}>
            {products.map((p) => (
              <div key={p.id} style={{ flexShrink: 0, width: '17.25rem' }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Link to="/catalog" style={{
            display: 'flex', width: '17.25rem', height: '3rem', justifyContent: 'center', alignItems: 'center',
            borderRadius: '2rem', border: '0.125rem solid var(--stroke)', background: '#FFF',
            fontFamily: F, fontWeight: 600, fontSize: '1rem', color: 'var(--black)', textDecoration: 'none',
          }}>Смотреть все</Link>
        </div>
      </div>

      {/* ═══ БРЕНДЫ ═══ */}
      <div style={{ padding: '4rem 2.5rem 0' }}>
        <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: 'var(--black)', marginBottom: '1rem' }}>Бренды</h2>
        <div className="scrollbar-hide" style={{ display: 'flex', gap: '1.5rem', overflow: 'auto', flexWrap: 'wrap' }}>
          {brandLogos.map((b: any, i: number) => (
            <Link key={i} to={`/catalog?brand=${b.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '13.375rem', height: '10rem', flexShrink: 0, textDecoration: 'none', borderRadius: '0.875rem', border: '0.09375rem solid var(--stroke)', background: '#FFF', padding: '1.5rem' }}>
              {b.img
                ? <img src={b.img} alt={b.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                : <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.125rem', color: 'var(--black)', textAlign: 'center' }}>{b.name}</span>
              }
            </Link>
          ))}
          <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '13.375rem', height: '8rem', flexShrink: 0, textDecoration: 'none', borderRadius: '0.875rem', border: '0.09375rem solid var(--stroke)', background: '#FFF' }}>
            <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.125rem', color: 'var(--black)', textAlign: 'center' }}>Все бренды</span>
          </Link>
        </div>
      </div>

      {/* ═══ ПРЕИМУЩЕСТВА ═══ */}
      <div style={{ padding: '4rem 2.5rem 0' }}>
        <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: 'var(--black)', marginBottom: '1rem' }}>Наши преимущества</h2>
        <div style={{ display: 'flex', gap: '1.875rem' }}>
          {benefits.map((b) => (
            <div key={b.title} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              flex: 1, height: '16.25rem', gap: '1rem', padding: '1rem 2rem', borderRadius: '0.875rem',
              border: '0.125rem solid var(--stroke)', background: '#FFF', position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}><IconInfo32 /></div>
              {b.icon}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: 'var(--black)', marginBottom: '0.25rem' }}>{b.title}</div>
                <div style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: 'var(--darkgray)' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div style={{ display: 'flex', gap: '2rem', padding: '4rem 2.5rem 0', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '26.875rem', flexShrink: 0 }}>
          <p style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: 'var(--black)', lineHeight: 1.4 }}>
            ОСТАЛИСЬ ВОПРОСЫ?<br/>ЗАДАЙТЕ ИХ В ЧАТ ПОДДЕРЖКИ
          </p>
          <a href="https://t.me/kickstepsupport_bot" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', width: '17.25rem', height: '3.25rem', alignItems: 'center', justifyContent: 'center', gap: '0.5625rem',
            borderRadius: '1.5rem', background: '#0088CC', fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#FFF', textDecoration: 'none',
          }}>
            Наш Telegram
            <svg width="2rem" height="2rem" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M18.239 4.103C18.448 4.012 18.677 3.98 18.902 4.012C19.126 4.043 19.339 4.136 19.517 4.281C19.695 4.426 19.832 4.618 19.914 4.837C19.996 5.055 20.02 5.292 19.983 5.523L18.065 17.542C17.879 18.701 16.647 19.366 15.618 18.788C14.757 18.305 13.478 17.561 12.328 16.784C11.753 16.395 9.991 15.15 10.207 14.265C10.393 13.507 13.354 10.661 15.045 8.969C15.709 8.304 15.406 7.92 14.622 8.532C12.675 10.05 9.549 12.359 8.516 13.009C7.604 13.582 7.128 13.68 6.56 13.582C5.523 13.404 4.561 13.128 3.776 12.792C2.716 12.337 2.767 10.831 3.776 10.393L18.239 4.103Z" fill="white"/></svg>
          </a>
        </div>
        <img src="/screenshots/af27361a58735c43d37d62fc3fa80882b0ee0a63.png" alt="Кроссовки" style={{ flex: 1, maxWidth: '46.125rem', height: '22.5rem', objectFit: 'cover', borderRadius: '1.5rem' }} />
      </div>

      <div style={{ height: '4rem' }} />
    </div>
  )
}
