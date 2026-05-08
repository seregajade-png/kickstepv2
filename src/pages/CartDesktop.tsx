import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"
const FB = "'Involve-Bold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

export default function CartDesktop() {
  const { items, updateQuantity, totalPrice, clearCart } = useCartStore()

  const totalOldPrice = items.reduce((s, i) => s + ((i.oldPrice && i.oldPrice > i.price ? i.oldPrice : i.price) * i.quantity), 0)
  const discount = totalOldPrice - totalPrice()

  if (items.length === 0) {
    return (
      <div style={{ width: '80rem', maxWidth: '100%', margin: '0 auto', padding: '0 2.5rem' }}>
        <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#0A0A0A', marginTop: '1.5rem' }}>Корзина</h1>
        <div style={{ padding: '5rem 0', textAlign: 'center' }}>
          <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#0A0A0A', marginBottom: '1.5rem' }}>Твоя корзина пуста</p>
          <Link to="/catalog" style={{
            display: 'inline-flex', width: '17.25rem', height: '3rem', justifyContent: 'center', alignItems: 'center',
            borderRadius: '2rem', border: '0.125rem solid #D1D1D1', background: '#FFF',
            fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A', textDecoration: 'none',
          }}>Продолжить покупки</Link>
        </div>
        <div style={{ height: '4rem' }} />
      </div>
    )
  }

  return (
    <div style={{ width: '80rem', maxWidth: '100%', margin: '0 auto', padding: '0 2.5rem' }}>
      <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#0A0A0A', marginTop: '1.5rem' }}>Корзина</h1>

      {/* Title bar */}
      <div style={{ display: 'flex', width: '46.125rem', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', marginTop: '0.5rem', borderBottom: '0.0625rem solid #D1D1D1' }}>
        <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A' }}>Все товары</span>
        <button onClick={clearCart} style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#6E6E6E', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Очистить корзину
        </button>
      </div>

      {/* Two columns */}
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        {/* LEFT: items */}
        <div style={{ width: '46.125rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {items.map((item) => (
            <div key={`${item.id}-${item.sizeEu}`} style={{ display: 'flex', gap: '1rem', background: '#FFF' }}>
              <Link to={`/product/${item.slug}`} style={{ flexShrink: 0, width: '10.75rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#FFF', padding: '0.5rem' }} />
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem', flex: 1 }}>
                <p style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', margin: 0 }}>
                  Кроссовки {item.brand} {item.name}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#B5B5B5' }}>Цвет</span>
                    <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A' }}>{item.color}</span>
                  </div>
                  {item.sizeEu && <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#B5B5B5' }}>Размер</span>
                    <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A' }}>EU {item.sizeEu}</span>
                  </div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: FB, fontWeight: 700, fontSize: '1.25rem', color: '#0A0A0A' }}>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                  {item.oldPrice && item.oldPrice > item.price && (
                    <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#808080', textDecoration: 'line-through' }}>{(item.oldPrice * item.quantity).toLocaleString('ru-RU')} ₽</span>
                  )}
                </div>
                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', height: '2rem', marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', width: '5.5625rem', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '0.5rem', background: '#F3F3F3', borderRadius: '0.5rem' }}>
                    <button onClick={() => updateQuantity(item.id, item.color, item.sizeRu, item.quantity - 1)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                    <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A', textAlign: 'center', letterSpacing: '0.05rem' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.color, item.sizeRu, item.quantity + 1)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: order summary */}
        <div style={{ width: '26.875rem', flexShrink: 0, background: '#F4F4F4', borderRadius: '0.875rem', padding: '1.5rem 1rem', alignSelf: 'flex-start', position: 'sticky', top: '6rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>Ваш заказ</span>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E', textAlign: 'right' }}>
                {items.reduce((s, i) => s + i.quantity, 0)} товар{items.reduce((s, i) => s + i.quantity, 0) > 1 ? 'а' : ''}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>Начальная цена</span>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#0A0A0A' }}>{totalOldPrice.toLocaleString('ru-RU')} ₽</span>
            </div>
            {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>Скидка</span>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#0A0A0A' }}>- {discount.toLocaleString('ru-RU')} ₽</span>
            </div>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>Общая Стоимость</span>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>{totalPrice().toLocaleString('ru-RU')} ₽</span>
            </div>

            <Link to="/checkout" style={{
              display: 'flex', height: '3rem', alignItems: 'center', justifyContent: 'center',
              borderRadius: '1.5rem', background: '#0A0A0A', marginTop: '0.5rem',
              fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#FFF', textDecoration: 'none',
            }}>Перейти к оформлению</Link>
          </div>
        </div>
      </div>

      <div style={{ height: '4rem' }} />
    </div>
  )
}
