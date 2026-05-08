import { Helmet } from 'react-helmet-async'
import { useIsDesktop } from '../hooks/useMediaQuery'
const F = "'Involve-SemiBold', Helvetica"
const FR = "'Involve-Regular', Helvetica"
const s: React.CSSProperties = { fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: '1.5', marginBottom: '0.75rem' }
const h: React.CSSProperties = { fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A', marginBottom: '0.5rem', textTransform: 'uppercase' }

export default function PaymentPage() {
  const isDesktop = useIsDesktop()
  return (<>
    <Helmet><title>Оплата — SNEAKER MOSCOW</title></Helmet>
    <div style={{ width: isDesktop ? 1280 : undefined, maxWidth: '100%', margin: '0 auto', padding: isDesktop ? '1.5rem 2.5rem 4rem' : '1rem 1rem 2rem' }}><div style={{ maxWidth: isDesktop ? 892 : undefined }}>
      <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A', marginBottom: '1rem' }}>Способы оплаты</h1>
      <p style={s}>Способы оплаты при получении заказа. При оформлении заказа Вы можете выбрать способ оплаты:</p>
      <h2 style={h}>Наличные</h2>
      <p style={s}>При выборе данного способа оплата стоимости заказа производится наличными денежными средствами в рублях при получении после примерки. Рекомендуется подготовить сумму без сдачи.</p>
      <p style={{ ...s, fontWeight: 600, color: '#D97706' }}>При оплате наличными покупателю предоставляется СКИДКА 5% от стоимости товара.</p>
      <h2 style={h}>Банковская карта / QR-код (СБП)</h2>
      <p style={s}>Безналичная оплата производится непосредственно после примерки товара.</p>
      <h2 style={{ ...h, fontSize: '0.875rem', textTransform: 'none' }}>Общие условия для всех способов оплаты при получении:</h2>
      <p style={s}>• Оплата товара производится только в случае, если размер и модель полностью устраивают покупателя.</p>
      <p style={s}>• При отказе от товара оплата стоимости обуви не производится.</p>
    </div></div>
  </>)
}
