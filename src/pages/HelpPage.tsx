import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useIsDesktop } from '../hooks/useMediaQuery'
import HelpDesktop from './HelpDesktop'

const F = "'Involve-SemiBold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

const faqItems = [
  {
    id: 1, title: 'Доставка и оплата',
    content: 'Доставка по Москве в пределах МКАД осуществляется курьерами магазина с возможностью примерить несколько моделей. После оформления заказа с Вами свяжется Менеджер для согласования подтверждения заказа.\n\nДоставка в регионы России осуществляется удобным для Вас способом (СДЭК, Яндекс, Почта России).\n\nОплата стоимости обуви производится покупателем в момент получения заказа после примерки. В случае если размер не подошел, покупатель вправе отказаться от товара.',
  },
  {
    id: 2, title: 'Обмен и возврат',
    content: 'Возврат или обмен товара возможен в течение 7 календарных дней с момента получения заказа (ст. 26.1 Закона РФ от 07.02.1992 №2300-1 "О защите прав потребителей"), если соблюдены следующие условия:\n\n• Товар без следов эксплуатации\n• Сохранена полная комплектация товара, в том числе коробка и бирки\n\nДля оформления процедуры возврата или обмена напишите нам в Telegram.',
  },
  {
    id: 3, title: 'Подобрать размер',
    content: 'Если вы сомневаетесь в выборе размера, наши консультанты помогут подобрать идеальный размер.\n\nПри курьерской доставке по Москве вы можете примерить несколько размеров и оплатить только подходящий.',
  },
  {
    id: 4, title: 'Оригинальность товара',
    content: 'Мы гарантируем 100% оригинальность всей продукции. Каждая пара кроссовок проходит проверку подлинности.\n\nВ случае сомнений, мы готовы предоставить все необходимые документы, подтверждающие оригинальность товара.',
  },
  {
    id: 5, title: 'Способы оплаты',
    content: 'Наличные — оплата при получении после примерки. При оплате наличными покупателю предоставляется СКИДКА 5% от стоимости товара.\n\nБанковская карта / QR-код (СБП) — безналичная оплата производится непосредственно после примерки товара.\n\nОплата товара производится только в случае, если размер и модель полностью устраивают покупателя. При отказе от товара оплата стоимости обуви не производится.',
  },
]

export default function HelpPage() {
  const isDesktop = useIsDesktop()
  if (isDesktop) return <><Helmet><title>Помощь — SNEAKER MOSCOW</title></Helmet><HelpDesktop /></>
  return <HelpMobile />
}

function HelpMobile() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <>
      <Helmet><title>Помощь — SNEAKER MOSCOW</title></Helmet>
      <div style={{ padding: '1rem 1rem 0' }}>
        <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>Помощь</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem 1rem 0' }}>
        {faqItems.map((item) => {
          const isOpen = openId === item.id
          return (
            <div key={item.id} style={{ background: '#F4F4F4', borderRadius: '0.875rem', padding: '1rem', transition: 'background 0.3s ease' }}>
              <button onClick={() => setOpenId(isOpen ? null : item.id)} style={{
                display: 'flex', height: '1.5rem', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}>
                <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A', flex: 1, textAlign: 'left' }}>{item.title}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M6 9L12 15L18 9"/>
                </svg>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.45s cubic-bezier(0.4,0,0.2,1)' }}>
                <div style={{ minHeight: 0, overflow: 'hidden' }}>
                  <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: 'normal', margin: 0, paddingTop: '0.5rem', whiteSpace: 'pre-line', opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0)' : 'translateY(-0.375rem)', transition: 'opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s' }}>
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ height: '2rem' }} />
    </>
  )
}
