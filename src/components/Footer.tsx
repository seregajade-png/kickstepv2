import { Link } from 'react-router-dom'
import { useIsDesktop } from '../hooks/useMediaQuery'

const footerSections = [
  { title: 'Всё о заказе', links: [
    { label: 'Заказ и оплата', to: '/payment' },
    { label: 'Доставка', to: '/delivery' },
    { label: 'Правила возврата', to: '/returns' },
  ]},
  { title: 'Сервис и помощь', links: [
    { label: 'Часто задаваемые вопросы', to: '/help' },
    { label: 'Таблицы размеров', to: '/size-guide' },
    { label: 'Контакты', to: '/help' },
  ]},
  { title: 'Юридический раздел', links: [
    { label: 'Персональные данные', to: '/privacy' },
    { label: 'Публичная оферта', to: '/offer' },
  ]},
]

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"

export default function Footer() {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <footer style={{ background: '#2C2C2E', marginTop: 'auto' }}>
        <div style={{ display: 'flex', width: '80rem', maxWidth: '100%', margin: '0 auto', gap: '2rem', padding: '2.5rem' }}>
          {footerSections.map((section) => (
            <nav key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#FFF' }}>{section.title}</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.875rem', color: '#B5B5B5', textDecoration: 'none' }}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </footer>
    )
  }

  return (
    <footer style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem', paddingTop: '1.5rem', paddingBottom: '2rem', background: '#2C2C2E', marginTop: 'auto' }}>
      {footerSections.map((section) => (
        <nav key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#FFF' }}>{section.title}</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none', padding: 0, margin: 0 }}>
            {section.links.map((link) => (
              <li key={link.label}>
                <Link to={link.to} style={{ fontFamily: FM, fontWeight: 500, fontSize: '0.875rem', color: '#B5B5B5', textDecoration: 'none' }}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </footer>
  )
}
