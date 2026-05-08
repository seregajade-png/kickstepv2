import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { useEffect, useState } from 'react'
import type { CartItem } from '../types'

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"
const FB = "'Involve-Bold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

export default function OrderSuccessDesktop() {
  const [orderItems, setOrderItems] = useState<CartItem[]>([])
  const items = useCartStore((s) => s.items)

  useEffect(() => {
    if (items.length > 0) { localStorage.setItem('last_order_items', JSON.stringify(items)); setOrderItems(items) }
    else { try { const s = localStorage.getItem('last_order_items'); if (s) setOrderItems(JSON.parse(s)) } catch {} }
  }, [items])

  const displayItems = orderItems.length > 0 ? orderItems : items
  const total = displayItems.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <div style={{ width: '80rem', maxWidth: '100%', margin: '0 auto', padding: '0 2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '2rem' }}>
        {/* LEFT */}
        <div style={{ width: '46.125rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#0A0A0A' }}>Заказ оформлен</h1>
            <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E', lineHeight: 'normal' }}>
              Спасибо за заказ!<br/>Наш менеджер свяжется с вами в ближайшее время для подтверждения
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" style={{ display: 'flex', width: '17.25rem', height: '3rem', alignItems: 'center', justifyContent: 'center', borderRadius: '2rem', background: '#0A0A0A', fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#FFF', textDecoration: 'none' }}>На главную</Link>
            <Link to="/catalog" style={{ display: 'flex', width: '17.25rem', height: '3rem', alignItems: 'center', justifyContent: 'center', borderRadius: '2rem', border: '0.125rem solid #D1D1D1', background: '#FFF', fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A', textDecoration: 'none' }}>Продолжить покупки</Link>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ width: '26.875rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Состав заказа */}
          {displayItems.length > 0 && (
            <div style={{ background: '#F3F3F3', borderRadius: '0.875rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>Состав заказа</h2>
              {displayItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: '10.75rem', height: '10.75rem', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem' }}>
                    <p style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', margin: 0 }}>{item.brand} {item.name}</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}><span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#B5B5B5' }}>Цвет</span><span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A' }}>{item.color}</span></div>
                    {item.sizeEu && <div style={{ display: 'flex', gap: '0.5rem' }}><span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#B5B5B5' }}>Размер</span><span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A' }}>EU {item.sizeEu}</span></div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: FB, fontWeight: 700, fontSize: '1.25rem', color: '#0A0A0A' }}>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                      {item.oldPrice && item.oldPrice > item.price && <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#6E6E6E', textDecoration: 'line-through' }}>{(item.oldPrice * item.quantity).toLocaleString('ru-RU')} ₽</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Итоги */}
          <div style={{ background: '#F4F4F4', borderRadius: '0.875rem', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>Стоимость</span>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#0A0A0A' }}>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>Доставка</span>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#0A0A0A' }}>Бесплатно</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>Общая Стоимость</span>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: '4rem' }} />
    </div>
  )
}
