import { Helmet } from 'react-helmet-async'
import { useIsDesktop } from '../hooks/useMediaQuery'
const F = "'Involve-SemiBold', Helvetica"
const FR = "'Involve-Regular', Helvetica"
const tg = <a href="https://t.me/kickstepsupport_bot" target="_blank" rel="noopener noreferrer" style={{ color: '#0088CC', textDecoration: 'underline' }}>Telegram</a>
const s: React.CSSProperties = { fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: '1.5', marginBottom: '0.75rem' }
const h: React.CSSProperties = { fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A', marginBottom: '0.5rem', textTransform: 'uppercase' }

export default function DeliveryPage() {
  const isDesktop = useIsDesktop()
  return (<>
    <Helmet><title>Доставка — SNEAKER MOSCOW</title></Helmet>
    <div style={{ width: isDesktop ? 1280 : undefined, maxWidth: '100%', margin: '0 auto', padding: isDesktop ? '1.5rem 2.5rem 4rem' : '1rem 1rem 2rem' }}>
      <div style={{ maxWidth: isDesktop ? 892 : undefined }}>
      <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A', marginBottom: '1rem' }}>Условия доставки</h1>
      <h2 style={h}>Бесплатная доставка по Москве в пределах МКАД</h2>
      <p style={s}>Доставка по Москве в пределах осуществляется курьерами магазина с возможностью примерить несколько моделей. После оформления заказа с Вами свяжется Менеджер для согласования подтверждения заказа.</p>
      <h2 style={h}>Доставка по России</h2>
      <p style={s}>Доставка в регионы России осуществляется удобным для Вас способом (СДЭК, Яндекс, Почта России).</p>
      <p style={s}>Оплата услуг доставки осуществляется после оформления заказа. Оплата стоимости обуви производится покупателем в момент получения заказа после примерки. В случае если размер не подошел, покупатель вправе отказаться от товара в пункте выдачи заказов. Денежные средства за товар в данном случае не взимаются.</p>
      <p style={s}>Сумма за услуги доставки возврату не подлежит.</p>
      <p style={{ ...s, color: '#6E6E6E' }}>По всем дополнительным вопросам просим обращаться в наш {tg}</p>
    </div></div>
  </>)
}
