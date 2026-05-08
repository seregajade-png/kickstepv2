import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCartStore } from '../stores/cartStore'
import { api } from '../lib/api'
import { useIsDesktop } from '../hooks/useMediaQuery'
import CheckoutDesktop from './CheckoutDesktop'

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"
const FB = "'Involve-Bold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

function formatPhone(value: string): string {
  let d = value.replace(/\D/g, '')
  if (d.startsWith('8')) d = '7' + d.slice(1)
  else if (!d.startsWith('7') && d.length > 0) d = '7' + d
  d = d.slice(0, 11)
  if (d.length === 0) return ''
  if (d.length === 1) return '+7'
  let r = '+7 (' + d.slice(1, Math.min(4, d.length))
  if (d.length >= 4) r += ') '
  if (d.length > 4) r += d.slice(4, Math.min(7, d.length))
  if (d.length > 7) r += '-' + d.slice(7, Math.min(9, d.length))
  if (d.length > 9) r += '-' + d.slice(9, 11)
  return r
}

const inputStyle: React.CSSProperties = {
  display: 'flex', height: '2.5rem', alignItems: 'center', padding: '0.75rem 1rem',
  background: '#FFF', borderRadius: '0.5rem', border: '0.0625rem solid #D1D1D1',
  fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A',
  outline: 'none', width: '100%',
}

const deliveryOptions = [
  { id: 'free-moscow', title: 'Бесплатная доставка по Москве\nв пределах МКАД', desc: '🚚 Доставка курьерами магазина с возможностью примерить несколько моделей.', note: '', highlight: true },
  { id: 'moscow-outside', title: 'Доставка по Москве за МКАД', desc: 'Доставка курьерами магазина с возможностью примерить несколько моделей.', note: '*стоимость рассчитывается после оформления заказа', highlight: false },
  { id: 'russia', title: 'Доставка по России', desc: 'Яндекс, Почта России, СДЭК по полной предоплате.', note: '*стоимость рассчитывается после оформления заказа', highlight: false },
]

export default function CheckoutPage() {
  const isDesktop = useIsDesktop()
  if (isDesktop) return <><Helmet><title>Оформление — SNEAKER MOSCOW</title></Helmet><CheckoutDesktop /></>
  return <CheckoutMobile />
}

function CheckoutMobile() {
  const { items, totalPrice, clearCart } = useCartStore()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+7 ')
  const [delivery, setDelivery] = useState('free-moscow')
  const [payment, setPayment] = useState<'cash' | 'card'>('cash')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [house, setHouse] = useState('')
  const [apartment, setApartment] = useState('')
  const [entrance, setEntrance] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPhoneConfirm, setShowPhoneConfirm] = useState(false)

  useEffect(() => { if (items.length === 0) navigate('/cart') }, [])

  const totalOldPrice = items.reduce((s, i) => s + ((i.oldPrice && i.oldPrice > i.price ? i.oldPrice : i.price) * i.quantity), 0)
  const discount = totalOldPrice - totalPrice()
  const cashDiscount = delivery !== 'russia' && payment === 'cash' ? Math.round(totalPrice() * 0.05) : 0
  const finalTotal = totalPrice() - cashDiscount

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = '!'
    if (phone.replace(/\D/g, '').length !== 11) e.phone = '!'
    if (delivery === 'russia' && !city.trim()) e.city = '!'
    if (!street.trim()) e.street = '!'
    if (!house.trim()) e.house = '!'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    // Show phone confirmation modal
    setShowPhoneConfirm(true)
  }

  const confirmAndSubmit = async () => {
    setShowPhoneConfirm(false)
    setSubmitting(true)
    try {
      const address = [delivery === 'russia' && city ? `г. ${city}` : '', street, house, apartment ? `кв. ${apartment}` : '', entrance ? `подъезд ${entrance}` : ''].filter(Boolean).join(', ')
      await api.submitOrder({
        customer_name: name.trim(), customer_phone: phone.replace(/\D/g, ''),
        delivery_type: delivery, delivery_address: address, comment: '',
        items: items.map(i => ({ product_id: i.id, slug: i.slug, name: i.name, brand: i.brand || '', size_eu: i.sizeEu || '', size_ru: i.sizeRu || '', color: i.color, quantity: i.quantity, price: i.price, old_price: i.oldPrice || i.price })),
        total_old_price: totalOldPrice, total_with_discount: Math.max(0, finalTotal), cash_discount: cashDiscount, payment_type: payment,
      })
      navigate('/order/success')
      setTimeout(() => clearCart(), 200)
    } catch { setErrors({ submit: 'Ошибка' }); setSubmitting(false) }
  }

  if (items.length === 0) return null

  const RadioBtn = ({ selected }: { selected: boolean }) => (
    <div style={{ width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', border: `0.125rem solid ${selected ? '#0A0A0A' : '#9CA3AF'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selected && <div style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', background: '#0A0A0A' }} />}
      </div>
    </div>
  )

  return (
    <>
      <Helmet><title>Оформление — SNEAKER MOSCOW</title></Helmet>

      {/* Title + close */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1rem 0' }}>
        <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A' }}>Оформление заказа</h1>
        <Link to="/cart" style={{ display: 'flex' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </Link>
      </div>

      {/* "Состав заказа" */}
      <div style={{ padding: '1rem 1rem 0' }}>
        <p style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.9375rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Состав заказа</p>
      </div>

      {/* Product summary cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 1rem' }}>
        {items.map((item) => (
          <div key={`${item.id}-${item.sizeEu}`} style={{ display: 'flex', background: '#FFF', borderRadius: '0.875rem', overflow: 'hidden' }}>
            <img src={item.image} alt={item.name} style={{ width: '8.125rem', height: '8.125rem', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.625rem', flex: 1 }}>
              <p style={{ fontFamily: F, fontWeight: 600, fontSize: '0.75rem', color: '#0A0A0A', margin: 0 }}>Кроссовки {item.brand} {item.name}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#B5B5B5' }}>Цвет</span>
                  <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#0A0A0A' }}>{item.color}</span>
                </div>
                {item.sizeEu && <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#B5B5B5' }}>Размер</span>
                  <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#0A0A0A' }}>EU {item.sizeEu}</span>
                </div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: FB, fontWeight: 700, fontSize: '0.9375rem', color: '#0A0A0A' }}>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                {item.oldPrice && item.oldPrice > item.price && <span style={{ fontFamily: F, fontWeight: 600, fontSize: '0.75rem', color: '#B5B5B5', textDecoration: 'line-through' }}>{(item.oldPrice * item.quantity).toLocaleString('ru-RU')} ₽</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Контактные данные */}
      <div style={{ padding: '1.5rem 1rem 0' }}>
        <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Контактные данные</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя Фамилия*"
            style={{ ...inputStyle, borderColor: errors.name ? '#EC221F' : '#D1D1D1' }} />
          <input value={phone} onChange={e => setPhone(formatPhone(e.target.value) || '+7 ')} type="tel" placeholder="Телефон*"
            style={{ ...inputStyle, borderColor: errors.phone ? '#EC221F' : '#D1D1D1' }} />
        </div>
      </div>

      {/* Доставка */}
      <div style={{ padding: '1.5rem 1rem 0' }}>
        <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Доставка</h2>
        {deliveryOptions.map((opt) => {
          const sel = delivery === opt.id
          return (
            <div key={opt.id} onClick={() => setDelivery(opt.id)} style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '0.75rem', cursor: 'pointer',
              background: sel ? '#F0FFF4' : 'transparent',
              borderRadius: 12,
              border: sel ? '0.09375rem solid #22C55E' : '0.0625rem solid #D1D1D1',
              marginBottom: 8, transition: 'all 0.2s',
            }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontFamily: FM, fontWeight: sel ? 600 : 500, fontSize: '0.9375rem', color: '#0A0A0A', whiteSpace: 'pre-line', margin: 0 }}>{opt.title}</p>
                <p style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: sel ? '#16A34A' : '#6E6E6E', margin: 0 }}>
                  {opt.desc}{opt.note && <><br />{opt.note}</>}
                </p>
              </div>
              <RadioBtn selected={sel} />
            </div>
          )
        })}
      </div>

      {/* Данные для доставки */}
      <div style={{ padding: '1.5rem 1rem 0' }}>
        <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Данные для доставки</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {delivery === 'russia' && (
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Город*"
              style={{ ...inputStyle, borderColor: errors.city ? '#EC221F' : '#D1D1D1' }} />
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={street} onChange={e => setStreet(e.target.value)} placeholder="Улица*"
              style={{ ...inputStyle, borderColor: errors.street ? '#EC221F' : '#D1D1D1' }} />
            <input value={house} onChange={e => setHouse(e.target.value)} placeholder="Дом*"
              style={{ ...inputStyle, borderColor: errors.house ? '#EC221F' : '#D1D1D1' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={apartment} onChange={e => setApartment(e.target.value)} placeholder="Квартира" style={inputStyle} />
            <input value={entrance} onChange={e => setEntrance(e.target.value)} placeholder="Подъезд" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Способы оплаты */}
      <div style={{ padding: '1.5rem 1rem 0' }}>
        <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Способы оплаты</h2>
        {delivery === 'russia' ? (
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            padding: '0.75rem', background: '#F0FFF4', borderRadius: 12,
            border: '0.09375rem solid #22C55E', marginBottom: 8,
          }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontFamily: FM, fontWeight: 600, fontSize: '0.9375rem', color: '#0A0A0A', margin: 0 }}>Полная предоплата</p>
              <p style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#16A34A', margin: 0 }}>*отправка осуществляется по полной предоплате</p>
            </div>
            <RadioBtn selected={true} />
          </div>
        ) : (
          [
            { id: 'cash' as const, label: 'Оплата наличными при получении', note: '💰 Скидка 5% при оплате наличными!' },
            { id: 'card' as const, label: 'Оплата банковской картой/QR-кодом\nпри получении', note: '' },
          ].map((m) => {
            const sel = payment === m.id
            return (
              <div key={m.id} onClick={() => setPayment(m.id)} style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                padding: '0.75rem', cursor: 'pointer',
                background: sel ? '#F0FFF4' : 'transparent',
                borderRadius: 12,
                border: sel ? '0.09375rem solid #22C55E' : '0.0625rem solid #D1D1D1',
                marginBottom: 8, transition: 'all 0.2s',
              }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ fontFamily: FM, fontWeight: sel ? 600 : 500, fontSize: '0.9375rem', color: '#0A0A0A', whiteSpace: 'pre-line', margin: 0 }}>{m.label}</p>
                  {m.note && <p style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: sel ? '#16A34A' : '#6E6E6E', margin: 0 }}>{m.note}</p>}
                </div>
                <RadioBtn selected={sel} />
              </div>
            )
          })
        )}
      </div>

      {/* Order summary on gray bg */}
      <div style={{ background: '#F4F4F4', borderRadius: '1.875rem 1.875rem 0 0', padding: '1.5rem 1rem 0', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>Ваш заказ</span>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#6E6E6E', textAlign: 'right' }}>
            {items.reduce((s, i) => s + i.quantity, 0)} товар
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#6E6E6E' }}>Начальная цена</span>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#0A0A0A' }}>{totalOldPrice.toLocaleString('ru-RU')} ₽</span>
        </div>
        {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#6E6E6E' }}>Скидка</span>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#0A0A0A' }}>- {discount.toLocaleString('ru-RU')} ₽</span>
        </div>}
        {cashDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#6E6E6E' }}>Скидка за наличные (5%)</span>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#EC221F' }}>- {cashDiscount.toLocaleString('ru-RU')} ₽</span>
        </div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.9375rem', color: '#6E6E6E' }}>Общая Стоимость</span>
          <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A' }}>{finalTotal.toLocaleString('ru-RU')} ₽</span>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={submitting} style={{
          display: 'flex', width: '100%', height: '3rem', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
          borderRadius: '1.5rem', background: '#0A0A0A', border: 'none', cursor: submitting ? 'wait' : 'pointer',
          fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#FFF',
          opacity: submitting ? 0.85 : 1, transition: 'opacity 0.4s ease, transform 0.3s ease',
        }}>
          {submitting && <span className="btn-spinner" />}
          <span>{submitting ? 'Оформляем...' : 'Оформить заказ'}</span>
        </button>

        {/* Legal */}
        <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.6875rem', color: '#0A0A0A', marginTop: '0.75rem', lineHeight: 'normal' }}>
          Нажимая кнопку, ты соглашаешься<br />с условиями <span style={{ textDecoration: 'underline' }}>оферты</span> и <span style={{ textDecoration: 'underline' }}>политикой конфиденциальности</span>
        </p>
        {errors.submit && <p style={{ color: '#EC221F', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center' }}>{errors.submit}</p>}

        <div style={{ height: '2rem' }} />
      </div>

      {/* Phone confirmation modal */}
      {showPhoneConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowPhoneConfirm(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#FFF', borderRadius: '1.25rem', padding: '1.5rem', width: '100%', maxWidth: '21.25rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1.75rem', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <p style={{ fontFamily: F, fontWeight: 600, fontSize: '1.125rem', color: '#0A0A0A', textAlign: 'center' }}>
              Проверьте номер телефона
            </p>
            <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#6E6E6E', textAlign: 'center', lineHeight: '1.4' }}>
              Мы позвоним на этот номер для подтверждения заказа
            </p>
            <div style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
              background: '#F4F4F4', textAlign: 'center',
              fontFamily: F, fontWeight: 600, fontSize: '1.125rem', color: '#0A0A0A', letterSpacing: '0.0625rem',
            }}>
              {phone}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <button onClick={() => setShowPhoneConfirm(false)} style={{
                flex: 1, height: '3rem', borderRadius: '1.5rem', border: '0.09375rem solid #D1D1D1', background: '#FFF',
                fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#0A0A0A', cursor: 'pointer',
              }}>
                Изменить
              </button>
              <button onClick={confirmAndSubmit} style={{
                flex: 1, height: '3rem', borderRadius: '1.5rem', background: '#0A0A0A', border: 'none',
                fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#FFF', cursor: 'pointer',
              }}>
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
