import { Helmet } from 'react-helmet-async'
import { useIsDesktop } from '../hooks/useMediaQuery'
const F = "'Involve-SemiBold', Helvetica"
const FR = "'Involve-Regular', Helvetica"
const s: React.CSSProperties = { fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: '1.5', marginBottom: '0.75rem' }

export default function ReturnsPage() {
  const isDesktop = useIsDesktop()
  return (<>
    <Helmet><title>Возврат — SNEAKER MOSCOW</title></Helmet>
    <div style={{ width: isDesktop ? 1280 : undefined, maxWidth: '100%', margin: '0 auto', padding: isDesktop ? '1.5rem 2.5rem 4rem' : '1rem 1rem 2rem' }}><div style={{ maxWidth: isDesktop ? 892 : undefined }}>
      <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A', marginBottom: '1rem' }}>Возврат и обмен</h1>
      <p style={s}>Возврат или обмен товара возможен в течение 7 календарных дней с момента получения заказа (ст. 26.1 Закона РФ от 07.02.1992 №2300-1 "О защите прав потребителей"), если соблюдены следующие условия:</p>
      <p style={s}>• Товар без следов эксплуатации</p>
      <p style={s}>• Сохранена полная комплектация товара, в том числе коробка и бирки (если они предусмотрены), контрольно идентификационный знак (маркировка, если она предусмотрена)</p>
      <p style={{ ...s, color: '#6E6E6E' }}>
        Для оформления процедуры возврата или обмена напишите нам в{' '}
        <a href="https://t.me/kickstepsupport_bot" target="_blank" rel="noopener noreferrer" style={{ color: '#0088CC', textDecoration: 'underline' }}>Telegram</a>
      </p>
    </div></div>
  </>)
}
