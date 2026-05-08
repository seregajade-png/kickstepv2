import { Helmet } from 'react-helmet-async'
import { useIsDesktop } from '../hooks/useMediaQuery'
const F = "'Involve-SemiBold', Helvetica"
const FR = "'Involve-Regular', Helvetica"
const s: React.CSSProperties = { fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: '1.5', marginBottom: '0.75rem' }
const h: React.CSSProperties = { fontFamily: F, fontWeight: 600, fontSize: '0.9375rem', color: '#0A0A0A', marginBottom: '0.5rem' }

export default function OfferPage() {
  const isDesktop = useIsDesktop()
  return (<>
    <Helmet><title>Оферта — SNEAKER MOSCOW</title></Helmet>
    <div style={{ width: isDesktop ? 1280 : undefined, maxWidth: '100%', margin: '0 auto', padding: isDesktop ? '1.5rem 2.5rem 4rem' : '1rem 1rem 2rem' }}><div style={{ maxWidth: isDesktop ? 892 : undefined }}>
      <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.375rem', color: '#0A0A0A', marginBottom: '1rem' }}>Договор оферты</h1>
      <h2 style={h}>1. Публичная оферта</h2>
      <p style={s}>Настоящий документ — это публичная оферта интернет-магазина KICKSTEP.RU о продаже товаров.</p>
      <p style={s}>Заказ Покупателем товаров означает согласие со всеми условиями настоящей Оферты, Политикой конфиденциальности и Пользовательского соглашения.</p>
      <p style={s}>Сайт имеет право вносить изменения в Оферту без уведомления Покупателя. Срок действия Оферты не ограничен.</p>
      <h2 style={h}>2. Предмет Оферты</h2>
      <p style={s}>Сайт обязуется передать Покупателю товар для личного использования, не связанного с предпринимательской деятельностью, а Покупатель обязуется принять и оплатить Товар.</p>
      <p style={s}>Право собственности переходит к Покупателю с момента фактической передачи и оплаты.</p>
      <h2 style={h}>3. Стоимость товаров</h2>
      <p style={s}>Цена определяется Продавцом и указывается на страницах магазина в рублях РФ. Все цены носят информационный характер.</p>
      <h2 style={h}>4. Момент заключения</h2>
      <p style={s}>Акцептом Оферты является оформление Покупателем заказа на товар на сайте kickstep.ru.</p>
      <h2 style={h}>5. Возврат товара</h2>
      <p style={s}>Возврат осуществляется в соответствии с Законом РФ «О защите прав потребителей». Денежные средства возвращаются на банковскую карту оплаты.</p>
      <p style={s}>Продавец может отказать в возврате если товар имеет признаки использования, загрязнения или механических повреждений.</p>
      <h2 style={h}>6. Доставка</h2>
      <p style={s}>Доставка осуществляется в сроки, согласованные при подтверждении заказа.</p>
      <h2 style={h}>7. Срок действия</h2>
      <p style={s}>Оферта действует до момента отзыва акцепта.</p>
      <h2 style={h}>8. Дополнительные условия</h2>
      <p style={s}>К отношениям между Покупателем и Сайтом применяются положения Российского законодательства. Споры решаются путем переговоров, при недостижении соглашения — передаются в судебный орган.</p>
    </div></div>
  </>)
}
