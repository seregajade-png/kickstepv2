import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronDown } from 'lucide-react'

const sections = [
  {
    title: 'Условия доставки',
    content: `Бесплатная доставка по Москве в пределах МКАД курьерами магазина с возможностью примерить несколько моделей.\n\nДоставка по России осуществляется удобным для вас способом (СДЭК, Яндекс, Почта России). Оплата стоимости обуви производится покупателем в момент получения заказа после примерки.`,
  },
  {
    title: 'Способы оплаты',
    content: `Наличные — оплата при получении после примерки. Скидка 10% при оплате наличными.\n\nБанковская карта / QR-код (СБП) — безналичная оплата после примерки.\n\nОплата производится только если размер и модель устраивают покупателя.`,
  },
  {
    title: 'Обмен и возврат',
    content: `Возврат или обмен товара возможен в течение 7 календарных дней с момента получения заказа, если товар без следов эксплуатации и сохранена полная комплектация.`,
  },
  {
    title: 'Как оформить заказ',
    content: `1. Выберите товар в каталоге и добавьте в корзину.\n2. Перейдите в корзину и нажмите «Оформить заказ».\n3. Заполните данные для доставки и выберите способ оплаты.\n4. Подтвердите заказ. Менеджер свяжется с вами.`,
  },
  {
    title: 'Часто задаваемые вопросы',
    content: `Сколько стоит доставка?\nДоставка по Москве в пределах МКАД — бесплатная.\n\nМожно ли примерить перед покупкой?\nДа, при курьерской доставке по Москве.\n\nВсе ли товары оригинальные?\nДа, мы гарантируем 100% оригинальность.`,
  },
]

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <Helmet><title>Помощь — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        <h1 className="text-2xl font-semibold mb-4">Помощь</h1>
        <div className="flex flex-col gap-2">
          {sections.map((section, i) => (
            <div key={i} className="bg-gray-100 rounded-[14px] overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-base font-semibold">{section.title}</span>
                <ChevronDown size={24} className={`transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-sm text-gray-600 whitespace-pre-line">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
