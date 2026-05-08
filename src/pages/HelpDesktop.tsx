import { useState } from 'react'

const F = "'Involve-SemiBold', Helvetica"
const FR = "'Involve-Regular', Helvetica"

const faqItems = [
  { id: 'delivery', title: 'Доставка и оплата', content: 'Доставка по Москве осуществляется собственными курьерами магазина. После оформления заказа с Вами свяжется наш Менеджер для согласования времени и даты доставки.\n\nСтандартная стоимость доставки по Москве – 500 ₽, для некоторых отдаленных районов Москвы и ближайшего Подмосковья – 1000 ₽. Также возможна срочная доставка сторонними курьерами в отдаленные районы Московской области, стоимость доставки рассчитывается индивидуально.' },
  { id: 'exchange', title: 'Обмен и возврат', content: 'Возврат или обмен товара возможен в течение 7 календарных дней с момента получения заказа, если товар без следов эксплуатации и сохранена полная комплектация.' },
  { id: 'size', title: 'Подобрать размер', content: 'Если вы сомневаетесь в выборе размера, наши консультанты помогут подобрать идеальный размер. При курьерской доставке по Москве вы можете примерить несколько размеров.' },
  { id: 'original', title: 'Оригинальность товара', content: 'Мы гарантируем 100% оригинальность всей продукции. Каждая пара кроссовок проходит проверку подлинности.' },
  { id: 'payment', title: 'Способы оплаты', content: 'Наличные — оплата при получении после примерки. Скидка 5% при оплате наличными.\n\nБанковская карта / QR-код (СБП) — безналичная оплата после примерки.' },
]

export default function HelpDesktop() {
  const [openId, setOpenId] = useState<string>('')

  return (
    <div style={{ width: '80rem', maxWidth: '100%', margin: '0 auto', padding: '0 2.5rem' }}>
      <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '2rem', color: '#0A0A0A', marginTop: '1.5rem' }}>Информация для покупателя</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '55.75rem', marginTop: '2rem' }}>
        {faqItems.map((item) => {
          const isOpen = openId === item.id
          return (
            <div key={item.id} style={{ background: '#F4F4F4', borderRadius: '0.875rem', padding: '1rem' }}>
              <button onClick={() => setOpenId(isOpen ? '' : item.id)} style={{
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
                  <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', paddingTop: '0.5rem', whiteSpace: 'pre-line', lineHeight: 'normal', margin: 0, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0)' : 'translateY(-0.375rem)', transition: 'opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s' }}>{item.content}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ height: '4rem' }} />
    </div>
  )
}
