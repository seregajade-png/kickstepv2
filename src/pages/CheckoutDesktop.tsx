import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { api } from '../lib/api'

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"
const FB = "'Involve-Bold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

function formatPhone(value: string): string {
  let d = value.replace(/\D/g, '')
  if (d.startsWith('8')) d = '7' + d.slice(1)
  else if (!d.startsWith('7') && d.length > 0) d = '7' + d
  d = d.slice(0, 11)
  if (!d.length) return ''
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
  fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', outline: 'none', width: '100%',
}

const deliveryOptions = [
  { id: 'free-moscow', title: 'Бесплатная доставка по Москве\nв пределах МКАД', badge: 'ПРИМЕРКА ПЕРЕД ПОКУПКОЙ', desc: 'Доставка курьерами магазина с возможностью примерить несколько моделей.', note: '' },
  { id: 'outside-mkad', title: 'Доставка по Москве за МКАД', badge: 'ПРИМЕРКА ПЕРЕД ПОКУПКОЙ', desc: 'Доставка курьерами магазина с возможностью примерить несколько моделей.', note: '*стоимость рассчитывается после оформления заказа' },
  { id: 'russia', title: 'Доставка по России', badge: '', desc: 'Яндекс, Почта России, СДЭК по полной предоплате.', note: '*стоимость рассчитывается после оформления заказа' },
]

const RadioBtn = ({ selected }: { selected: boolean }) => (
  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: `0.125rem solid ${selected ? '#0A0A0A' : '#D9D9D9'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    {selected && <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#0A0A0A' }} />}
  </div>
)

export default function CheckoutDesktop() {
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

  useEffect(() => { if (items.length === 0) navigate('/cart') }, [])

  const totalOldPrice = items.reduce((s, i) => s + ((i.oldPrice && i.oldPrice > i.price ? i.oldPrice : i.price) * i.quantity), 0)
  const discount = totalOldPrice - totalPrice()
  const cashDiscount = payment === 'cash' ? Math.round(totalPrice() * 0.05) : 0
  const total = totalPrice() - cashDiscount

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

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const address = [delivery === 'russia' && city ? `г. ${city}` : '', street, house, apartment ? `кв. ${apartment}` : '', entrance ? `подъезд ${entrance}` : ''].filter(Boolean).join(', ')
      await api.submitOrder({
        customer_name: name.trim(), customer_phone: phone.replace(/\D/g, ''),
        delivery_type: delivery, delivery_address: address, comment: '',
        items: items.map(i => ({ product_id: i.id, slug: i.slug, name: i.name, brand: i.brand || '', size_eu: i.sizeEu || '', size_ru: i.sizeRu || '', color: i.color, quantity: i.quantity, price: i.price, old_price: i.oldPrice || i.price })),
        total_old_price: totalOldPrice, total_with_discount: Math.max(0, total), cash_discount: cashDiscount, payment_type: payment,
      })
      navigate('/order/success')
      setTimeout(() => clearCart(), 200)
    } catch { setErrors({ submit: 'Ошибка' }); setSubmitting(false) }
  }

  if (items.length === 0) return null

  return (
    <div style={{ width: '80rem', maxWidth: '100%', margin: '0 auto', padding: '0 2.5rem' }}>
      <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#0A0A0A', marginTop: '1.5rem' }}>Оформление заказа</h1>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        {/* LEFT: form */}
        <div style={{ width: '46.125rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Контактные данные */}
          <div>
            <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Контактные данные</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя Фамилия*"
                style={{ ...inputStyle, borderColor: errors.name ? '#EC221F' : '#D1D1D1' }} />
              <input value={phone} onChange={e => setPhone(formatPhone(e.target.value) || '+7 ')} type="tel" placeholder="Телефон*"
                style={{ ...inputStyle, borderColor: errors.phone ? '#EC221F' : '#D1D1D1' }} />
            </div>
          </div>

          {/* Доставка */}
          <div>
            <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Доставка</h2>
            {deliveryOptions.map((opt) => {
              const sel = delivery === opt.id
              return (
                <div key={opt.id} onClick={() => setDelivery(opt.id)} style={{
                  display: 'flex', gap: '0.75rem', padding: '1rem', cursor: 'pointer',
                  background: sel ? '#F0FFF4' : 'transparent', borderRadius: 12,
                  border: sel ? '0.09375rem solid #22C55E' : '0.0625rem solid #D1D1D1',
                  marginBottom: 8, transition: 'all 0.2s',
                }}>
                  <RadioBtn selected={sel} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ fontFamily: FM, fontWeight: sel ? 600 : 500, fontSize: '0.9375rem', color: '#0A0A0A', whiteSpace: 'pre-line', margin: 0 }}>{opt.title}</p>
                    <p style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: sel ? '#16A34A' : '#6E6E6E', margin: 0 }}>
                      {opt.desc}{opt.note && <><br/>{opt.note}</>}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Данные для доставки */}
          <div>
            <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Данные для доставки</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {delivery === 'russia' && (
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="Город*" style={{ ...inputStyle, borderColor: errors.city ? '#EC221F' : '#D1D1D1' }} />
              )}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={street} onChange={e => setStreet(e.target.value)} placeholder="Улица*" style={{ ...inputStyle, borderColor: errors.street ? '#EC221F' : '#D1D1D1' }} />
                <input value={house} onChange={e => setHouse(e.target.value)} placeholder="Дом*" style={{ ...inputStyle, borderColor: errors.house ? '#EC221F' : '#D1D1D1' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={apartment} onChange={e => setApartment(e.target.value)} placeholder="Квартира" style={inputStyle} />
                <input value={entrance} onChange={e => setEntrance(e.target.value)} placeholder="Подъезд" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Способы оплаты */}
          <div>
            <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Способы оплаты</h2>
            {delivery === 'russia' ? (
              <div style={{
                display: 'flex', gap: '0.75rem', padding: '1rem',
                background: '#F0FFF4', borderRadius: 12,
                border: '0.09375rem solid #22C55E', marginBottom: 8,
              }}>
                <RadioBtn selected={true} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ fontFamily: FM, fontWeight: 600, fontSize: '0.9375rem', color: '#0A0A0A', margin: 0 }}>Полная предоплата</p>
                  <p style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.75rem', color: '#16A34A', margin: 0 }}>*отправка осуществляется по полной предоплате</p>
                </div>
              </div>
            ) : (
              [
                { id: 'cash' as const, label: 'Оплата наличными при получении', badge: 'СКИДКА 5%' },
                { id: 'card' as const, label: 'Оплата банковской картой/QR-кодом при получении', badge: '' },
              ].map((m) => {
                const sel = payment === m.id
                return (
                  <div key={m.id} onClick={() => setPayment(m.id)} style={{
                    display: 'flex', gap: '0.75rem', padding: '1rem', cursor: 'pointer',
                    background: sel ? '#F0FFF4' : 'transparent', borderRadius: 12,
                    border: sel ? '0.09375rem solid #22C55E' : '0.0625rem solid #D1D1D1',
                    marginBottom: 8, transition: 'all 0.2s',
                  }}>
                    <RadioBtn selected={sel} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <p style={{ fontFamily: FM, fontWeight: sel ? 600 : 500, fontSize: '0.9375rem', color: '#0A0A0A', margin: 0 }}>{m.label}</p>
                      {m.badge && (
                        <span style={{ display: 'inline-flex', height: '1.75rem', alignItems: 'center', padding: '0 0.75rem', background: sel ? '#22C55E' : '#0A0A0A', borderRadius: '0.375rem', fontFamily: F, fontWeight: 600, fontSize: '0.6875rem', color: '#FFF', width: 'fit-content' }}>{m.badge}</span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT: sidebar */}
        <div style={{ width: '26.875rem', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '6rem', alignSelf: 'flex-start' }}>
          {/* Состав заказа */}
          <div style={{ background: '#F3F3F3', borderRadius: '0.875rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>Состав заказа</h3>
            {items.map((item, i) => (
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

          {/* Итоги */}
          <div style={{ background: '#F4F4F4', borderRadius: '0.875rem', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>Ваш заказ</span>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>{items.reduce((s, i) => s + i.quantity, 0)} товар</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>Начальная цена</span>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#0A0A0A' }}>{totalOldPrice.toLocaleString('ru-RU')} ₽</span>
            </div>
            {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>Скидка</span>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#0A0A0A' }}>- {discount.toLocaleString('ru-RU')} ₽</span>
            </div>}
            {cashDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>Скидка за наличные (5%)</span>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#EC221F' }}>- {cashDiscount.toLocaleString('ru-RU')} ₽</span>
            </div>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FR, fontWeight: 400, fontSize: '1rem', color: '#6E6E6E' }}>Общая Стоимость</span>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.25rem', color: '#0A0A0A' }}>{Math.max(0, total).toLocaleString('ru-RU')} ₽</span>
            </div>

            <button onClick={handleSubmit} disabled={submitting} style={{
              display: 'flex', height: '3rem', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
              borderRadius: '1.5rem', background: '#0A0A0A', border: 'none', cursor: submitting ? 'wait' : 'pointer',
              fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#FFF',
              opacity: submitting ? 0.85 : 1, transition: 'opacity 0.4s ease, transform 0.3s ease',
            }}>
              {submitting && <span className="btn-spinner" />}
              <span>{submitting ? 'Оформляем...' : 'Оформить заказ'}</span>
            </button>

            <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.75rem', color: '#0A0A0A', lineHeight: 'normal' }}>
              Нажимая кнопку, ты соглашаешься<br/>с условиями <span style={{ textDecoration: 'underline' }}>оферты</span> и <span style={{ textDecoration: 'underline' }}>политикой конфиденциальности</span>
            </p>
            {errors.submit && <p style={{ color: '#EC221F', fontSize: '0.75rem' }}>{errors.submit}</p>}
          </div>
        </div>
      </div>

      <div style={{ height: '4rem' }} />
    </div>
  )
}
