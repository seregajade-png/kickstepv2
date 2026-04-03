import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Помощь',
    links: [
      { label: 'Условия доставки', to: '/delivery' },
      { label: 'Способы оплаты', to: '/payment' },
      { label: 'Обмен и возврат', to: '/returns' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'О компании',
    links: [
      { label: 'О нас', to: '/about' },
      { label: 'Контакты', to: '/contacts' },
      { label: 'Политика конфиденциальности', to: '/privacy' },
      { label: 'Договор оферты', to: '/offer' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-footer text-white pt-6 pb-8 px-4 mt-auto">
      <div className="max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-semibold tracking-tight block mb-6">
          KICKSTEP
        </Link>

        {/* Sections */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-base font-semibold mb-2">{section.title}</h3>
              <div className="flex flex-col gap-1">
                {section.links.map((link) => (
                  <Link key={link.label} to={link.to} className="text-sm font-medium text-gray-400 hover:text-white transition">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-4 border-t border-gray-600 text-xs text-gray-400">
          KICKSTEP © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}
