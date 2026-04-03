import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Всё о заказе',
    links: [
      { label: 'Заказ и оплата', to: '/payment' },
      { label: 'Доставка', to: '/delivery' },
      { label: 'Правила возврата', to: '/returns' },
    ],
  },
  {
    title: 'Сервис и помощь',
    links: [
      { label: 'Часто задаваемые вопросы', to: '/help' },
      { label: 'Таблицы размеров', to: '/size-guide' },
      { label: 'Контакты', to: '/contacts' },
    ],
  },
  {
    title: 'Юридический раздел',
    links: [
      { label: 'Персональные данные', to: '/privacy' },
      { label: 'Публичная оферта', to: '/offer' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 mt-auto">
      <div className="px-4 pt-8 pb-6 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-base font-semibold text-black mb-2">{section.title}</h3>
              <div className="flex flex-col gap-1">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-sm font-medium text-gray-400 hover:text-black transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
