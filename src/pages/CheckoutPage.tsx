import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCartStore } from '../stores/cartStore'
import { api } from '../lib/api'

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('8')) digits = '7' + digits.slice(1)
  else if (!digits.startsWith('7') && digits.length > 0) digits = '7' + digits
  digits = digits.slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length === 1) return '+7'
  let r = '+7 (' + digits.slice(1, Math.min(4, digits.length))
  if (digits.length >= 4) r += ') '
  if (digits.length > 4) r += digits.slice(4, Math.min(7, digits.length))
  if (digits.length > 7) r += '-' + digits.slice(7, Math.min(9, digits.length))
  if (digits.length > 9) r += '-' + digits.slice(9, 11)
  return r
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', phone: '+7 ', city: 'Москва', street: '', house: '', apartment: '',
  })
  const [deliveryMethod, setDeliveryMethod] = useState('moscow_free')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (items.length === 0) navigate('/cart')
  }, [])

  const totalOldPrice = items.reduce((sum, i) => {
    return sum + ((i.oldPrice && i.oldPrice > i.price ? i.oldPrice : i.price) * i.quantity)
  }, 0)
  const discount = totalOldPrice - totalPrice()
  const cashDiscount = paymentMethod === 'cash' ? Math.round(totalPrice() * 0.1) : 0
  const total = totalPrice() - cashDiscount

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, phone: formatPhone(e.target.value) || '+7 ' }))
  }

  const validate = () => {
    const err: Record<string, string> = {}
    if (!form.name.trim()) err.name = 'Введите имя'
    const digits = form.phone.replace(/\D/g, '')
    if (digits.length !== 11) err.phone = 'Введите номер'
    if (!form.street.trim()) err.street = 'Введите улицу'
    if (!form.house.trim()) err.house = 'Введите дом'
    if (!consent) err.consent = 'Необходимо согласие'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const address = [form.city, form.street, form.house, form.apartment ? `кв. ${form.apartment}` : ''].filter(Boolean).join(', ')
      const res = await api.submitOrder({
        customer_name: form.name.trim(),
        customer_phone: form.phone.replace(/\D/g, ''),
        delivery_type: deliveryMethod,
        delivery_address: address,
        comment: '',
        items: items.map(item => ({
          product_id: item.id, slug: item.slug, name: item.name, brand: item.brand || '',
          size_eu: item.sizeEu || '', size_ru: item.sizeRu || '', color: item.color,
          quantity: item.quantity, price: item.price, old_price: item.oldPrice || item.price,
        })),
        total_old_price: totalOldPrice,
        total_with_discount: Math.max(0, total),
        cash_discount: cashDiscount,
        payment_type: paymentMethod,
      })
      navigate('/order/success', { state: { orderNumber: res.order_number } })
      setTimeout(() => clearCart(), 200)
    } catch {
      setErrors({ submit: 'Ошибка при оформлении' })
      setSubmitting(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-[24px] border text-base outline-none transition ${
      errors[field] ? 'border-red-500' : 'border-gray-300 focus:border-black'
    }`

  if (items.length === 0) return null

  return (
    <>
      <Helmet><title>Оформление — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        <h1 className="text-2xl font-semibold mb-4">Оформление заказа</h1>

        {/* Delivery */}
        <section className="mb-6">
          <h2 className="text-base font-semibold mb-3">Доставка</h2>
          {[
            { value: 'moscow_free', label: 'Бесплатно по Москве (МКАД)' },
            { value: 'moscow_paid', label: 'За МКАД' },
            { value: 'russia', label: 'По России (СДЭК)' },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-3 py-2 cursor-pointer">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${deliveryMethod === opt.value ? 'border-black' : 'border-gray-400'}`}>
                {deliveryMethod === opt.value && <div className="w-3 h-3 rounded-full bg-black" />}
              </div>
              <input type="radio" name="delivery" value={opt.value} checked={deliveryMethod === opt.value}
                onChange={() => setDeliveryMethod(opt.value)} className="sr-only" />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </section>

        {/* Contact */}
        <section className="mb-6">
          <h2 className="text-base font-semibold mb-3">Контакты</h2>
          <div className="flex flex-col gap-3">
            <input name="name" placeholder="Имя и фамилия" value={form.name} onChange={handleInput} className={inputClass('name')} />
            <input name="phone" type="tel" placeholder="+7" value={form.phone} onChange={handlePhoneChange} className={inputClass('phone')} />
          </div>
        </section>

        {/* Address */}
        <section className="mb-6">
          <h2 className="text-base font-semibold mb-3">Адрес доставки</h2>
          <div className="grid grid-cols-2 gap-3">
            <input name="street" placeholder="Улица" value={form.street} onChange={handleInput} className={inputClass('street')} />
            <input name="house" placeholder="Дом" value={form.house} onChange={handleInput} className={inputClass('house')} />
            <input name="apartment" placeholder="Квартира" value={form.apartment} onChange={handleInput} className={inputClass('apartment')} />
          </div>
        </section>

        {/* Payment */}
        <section className="mb-6">
          <h2 className="text-base font-semibold mb-3">Оплата</h2>
          {[
            { value: 'cash', label: 'Наличные (скидка 10%)' },
            { value: 'card', label: 'Карта / QR-код' },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-3 py-2 cursor-pointer">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === opt.value ? 'border-black' : 'border-gray-400'}`}>
                {paymentMethod === opt.value && <div className="w-3 h-3 rounded-full bg-black" />}
              </div>
              <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value}
                onChange={() => setPaymentMethod(opt.value)} className="sr-only" />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </section>

        {/* Consent */}
        <div onClick={() => setConsent(!consent)} className="flex items-start gap-3 mb-6 cursor-pointer select-none">
          <div className={`w-6 h-6 rounded flex-shrink-0 border-[1.5px] flex items-center justify-center mt-0.5 ${consent ? 'border-black bg-black' : 'border-gray-400'}`}>
            {consent && <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className="text-xs text-gray-600">Нажимая на кнопку, вы соглашаетесь с условиями обработки персональных данных</span>
        </div>

        {/* Summary */}
        <div className="bg-gray-100 rounded-[14px] p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Общая сумма</span>
            <span className="text-[15px] font-bold">{totalOldPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Скидка</span>
              <span className="text-[15px] font-bold text-red-500">-{discount.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
          {cashDiscount > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">За наличные (10%)</span>
              <span className="text-[15px] font-bold text-red-500">-{cashDiscount.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-gray-300">
            <span className="text-base font-semibold">Итого</span>
            <span className="text-base font-bold">{Math.max(0, total).toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-black text-white text-sm font-semibold rounded-[24px] disabled:opacity-50"
        >
          {submitting ? 'Оформляем...' : 'Подтвердить заказ'}
        </button>
        {errors.submit && <p className="text-red-500 text-xs mt-2 text-center">{errors.submit}</p>}
      </div>
    </>
  )
}
