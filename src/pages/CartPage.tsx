import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCartStore } from '../stores/cartStore'
import { useIsDesktop } from '../hooks/useMediaQuery'
import CartDesktop from './CartDesktop'

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"
const FB = "'Involve-Bold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

export default function CartPage() {
  const isDesktop = useIsDesktop()
  if (isDesktop) return <><Helmet><title>Корзина — SNEAKER MOSCOW</title></Helmet><CartDesktop /></>
  return <CartMobile />
}

function CartMobile() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()

  const totalOldPrice = items.reduce((sum, i) =>
    sum + ((i.oldPrice && i.oldPrice > i.price ? i.oldPrice : i.price) * i.quantity), 0)
  const discount = totalOldPrice - totalPrice()

  /* ══ EMPTY ══ */
  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Корзина — SNEAKER MOSCOW</title></Helmet>
        <div style={{ padding: '1rem 1rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A' }}>Корзина</h1>
              <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A' }}>Твоя корзина пуста</p>
            </div>
            <Link to="/catalog" style={{
              display: 'flex', height: '3rem', alignItems: 'center', justifyContent: 'center',
              borderRadius: '1.5rem', border: '0.09375rem solid #D1D1D1', background: '#FFF',
              fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#0A0A0A', textDecoration: 'none',
            }}>
              Продолжить покупки
            </Link>
          </div>
        </div>
        <div style={{ height: '2rem' }} />
      </>
    )
  }

  /* ══ WITH ITEMS ══ */
  return (
    <>
      <Helmet><title>Корзина — SNEAKER MOSCOW</title></Helmet>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1rem 0' }}>
        <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A' }}>Корзина</h1>
      </div>

      {/* Clear + "Все товары" */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
        <button onClick={clearCart} style={{
          fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#6E6E6E',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          Очистить корзину
        </button>
        <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A' }}>Все товары</span>
      </div>

      {/* Cart items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 1rem 0' }}>
        {items.map((item) => (
          <div key={`${item.id}-${item.sizeEu}`} style={{ display: 'flex', background: '#FFF' }}>
            {/* Image */}
            <Link to={`/product/${item.slug}`} style={{ flexShrink: 0, width: '8.125rem', height: '10rem', borderRadius: '0.875rem', overflow: 'hidden' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#FFF', padding: '0.5rem' }} />
            </Link>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Name */}
                <p style={{ fontFamily: F, fontWeight: 600, fontSize: '0.75rem', color: '#0A0A0A', margin: 0 }}>
                  Кроссовки {item.brand} {item.name}
                </p>
                {/* Color + Size */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {item.color && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#B5B5B5' }}>Цвет</span>
                      <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#0A0A0A' }}>{item.color}</span>
                    </div>
                  )}
                  {item.sizeEu && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#B5B5B5' }}>Размер</span>
                      <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#0A0A0A' }}>EU {item.sizeEu}</span>
                    </div>
                  )}
                </div>
                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.9375rem', color: '#0A0A0A' }}>
                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                  </span>
                  {item.oldPrice && item.oldPrice > item.price && (
                    <span style={{ fontFamily: F, fontWeight: 600, fontSize: '0.75rem', color: '#808080', textDecoration: 'line-through' }}>
                      {(item.oldPrice * item.quantity).toLocaleString('ru-RU')} ₽
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', height: '2rem' }}>
                <div style={{
                  display: 'flex', width: '5.5625rem', alignItems: 'center', justifyContent: 'center',
                  gap: '1rem', padding: '0.5rem', background: '#F4F4F4', borderRadius: '0.5rem',
                }}>
                  <button onClick={() => updateQuantity(item.id, item.color, item.sizeRu, item.quantity - 1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#0A0A0A', textAlign: 'center', letterSpacing: '0.05rem' }}>
                    {item.quantity}
                  </span>
                  <button onClick={() => updateQuantity(item.id, item.color, item.sizeRu, item.quantity + 1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Delete */}
            <button onClick={() => removeItem(item.id, item.color, item.sizeRu)}
              style={{ alignSelf: 'flex-start', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B5B5B5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Order summary — gray bg area */}
      <div style={{ background: '#F3F3F3', borderRadius: '1.875rem 1.875rem 0 0', padding: '1.5rem 1rem 0', marginTop: '1.5rem' }}>
        {/* "Ваш заказ" */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>Ваш заказ</span>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#6E6E6E' }}>
            {items.reduce((s, i) => s + i.quantity, 0)} товар{items.reduce((s, i) => s + i.quantity, 0) > 1 ? 'а' : ''}
          </span>
        </div>

        {/* Начальная цена */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#6E6E6E' }}>Начальная цена</span>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#0A0A0A' }}>
            {totalOldPrice.toLocaleString('ru-RU')} ₽
          </span>
        </div>

        {/* Скидка */}
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#6E6E6E' }}>Скидка</span>
            <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#0A0A0A' }}>
              - {discount.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        )}

        {/* Общая стоимость */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#6E6E6E' }}>Общая Стоимость</span>
          <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A' }}>
            {totalPrice().toLocaleString('ru-RU')} ₽
          </span>
        </div>

        {/* "Перейти к оформлению" */}
        <Link to="/checkout" style={{
          display: 'flex', width: '100%', height: '3rem', alignItems: 'center', justifyContent: 'center',
          borderRadius: '1.5rem', background: '#0A0A0A', border: 'none',
          fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#FFF', textDecoration: 'none',
        }}>
          Перейти к оформлению
        </Link>

        <div style={{ height: '2rem' }} />
      </div>
    </>
  )
}
