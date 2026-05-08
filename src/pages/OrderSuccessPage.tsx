import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCartStore } from '../stores/cartStore'
import { useEffect, useState } from 'react'
import type { CartItem } from '../types'
import { useIsDesktop } from '../hooks/useMediaQuery'
import OrderSuccessDesktop from './OrderSuccessDesktop'

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"
const FB = "'Involve-Bold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

export default function OrderSuccessPage() {
  const isDesktop = useIsDesktop()
  if (isDesktop) return <><Helmet><title>Заказ оформлен — SNEAKER MOSCOW</title></Helmet><OrderSuccessDesktop /></>
  return <OrderSuccessMobile />
}

function OrderSuccessMobile() {
  const location = useLocation()
  const orderNumber = (location.state as any)?.orderNumber
  const [orderItems, setOrderItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('last_order_items')
    if (saved) {
      try { setOrderItems(JSON.parse(saved)) } catch {}
    }
  }, [])

  // Save cart items before they're cleared
  const items = useCartStore((s) => s.items)
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('last_order_items', JSON.stringify(items))
      setOrderItems(items)
    }
  }, [items])

  const displayItems = orderItems.length > 0 ? orderItems : items
  const total = displayItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalOld = displayItems.reduce((s, i) => s + ((i.oldPrice && i.oldPrice > i.price ? i.oldPrice : i.price) * i.quantity), 0)
  const discount = totalOld - total

  return (
    <>
      <Helmet><title>Заказ оформлен — SNEAKER MOSCOW</title></Helmet>
      <div style={{ padding: '1rem 1rem 0' }}>
        <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A', marginBottom: '0.25rem' }}>Спасибо за заказ!</h1>
        <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#6E6E6E', marginBottom: '0.25rem' }}>
          Наш менеджер свяжется с вами в ближайшее время для подтверждения.
        </p>
        {orderNumber && (
          <p style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.875rem', color: '#0A0A0A', marginBottom: '1rem' }}>
            Номер заказа: #{orderNumber}
          </p>
        )}
      </div>

      {/* Состав заказа */}
      {displayItems.length > 0 && (
        <div style={{ padding: '0 1rem' }}>
          <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.125rem', color: '#0A0A0A', marginBottom: '0.75rem' }}>Состав заказа</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {displayItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '0.0625rem solid #F0F0F0' }}>
                <img src={item.image} alt={item.name} style={{ width: '4.375rem', height: '4.375rem', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <p style={{ fontFamily: F, fontWeight: 600, fontSize: '0.75rem', color: '#0A0A0A', margin: 0 }}>
                    {item.brand} {item.name}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {item.sizeEu && <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#6E6E6E' }}>EU {item.sizeEu}</span>}
                    {item.color && <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#6E6E6E' }}>{item.color}</span>}
                    {item.quantity > 1 && <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#6E6E6E' }}>×{item.quantity}</span>}
                  </div>
                  <span style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.875rem', color: '#0A0A0A' }}>
                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Итоги */}
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {discount > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#6E6E6E' }}>Сумма без скидки</span>
                  <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#6E6E6E', textDecoration: 'line-through' }}>{totalOld.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#6E6E6E' }}>Скидка</span>
                  <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#E53935' }}>-{discount.toLocaleString('ru-RU')} ₽</span>
                </div>
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '0.0625rem solid #D1D1D1' }}>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A' }}>Итого</span>
              <span style={{ fontFamily: FB, fontWeight: 700, fontSize: '1rem', color: '#0A0A0A' }}>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem 1rem' }}>
        <Link to="/catalog" style={{
          display: 'flex', height: '3rem', alignItems: 'center', justifyContent: 'center',
          borderRadius: '1.5rem', border: '0.09375rem solid #D1D1D1', background: '#FFF',
          fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#0A0A0A', textDecoration: 'none',
        }}>
          Продолжить покупки
        </Link>
        <Link to="/" style={{
          display: 'flex', height: '3rem', alignItems: 'center', justifyContent: 'center',
          borderRadius: '1.5rem', background: '#0A0A0A',
          fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#FFF', textDecoration: 'none',
        }}>
          На главную
        </Link>
      </div>
    </>
  )
}
