import { Helmet } from 'react-helmet-async'
import { useIsDesktop } from '../hooks/useMediaQuery'
const F = "'Involve-SemiBold', Helvetica"
const FR = "'Involve-Regular', Helvetica"
const s: React.CSSProperties = { fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: '1.5', marginBottom: '0.75rem' }
const h: React.CSSProperties = { fontFamily: F, fontWeight: 600, fontSize: '0.9375rem', color: '#0A0A0A', marginBottom: '0.5rem' }

export default function PrivacyPage() {
  const isDesktop = useIsDesktop()
  return (<>
    <Helmet><title>Политика конфиденциальности — SNEAKER MOSCOW</title></Helmet>
    <div style={{ width: isDesktop ? 1280 : undefined, maxWidth: '100%', margin: '0 auto', padding: isDesktop ? '1.5rem 2.5rem 4rem' : '1rem 1rem 2rem' }}><div style={{ maxWidth: isDesktop ? 892 : undefined }}>
      <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.375rem', color: '#0A0A0A', marginBottom: '1rem' }}>Политика конфиденциальности</h1>
      <p style={s}>Настоящий документ «Политика конфиденциальности» представляет собой правила использования сайтом kickstep.ru персональной информации Пользователя.</p>
      <p style={s}>Использование Сайта означает безоговорочное согласие Пользователя с настоящей Политикой и указанными в ней условиями обработки его персональной информации; в случае несогласия с этими условиями Пользователь должен воздержаться от использования Сайта.</p>
      <h2 style={h}>1. Общие положения</h2>
      <p style={s}>Настоящая Политика составлена в соответствии с ФЗ «О персональных данных» № 152-ФЗ и действует в отношении всех персональных данных, которые Оператор может получить от Пользователя.</p>
      <h2 style={h}>2. Персональная информация</h2>
      <p style={s}>Сайт не проверяет достоверность персональной информации, предоставляемой Пользователем, и не имеет возможности оценивать его дееспособность.</p>
      <h2 style={h}>3. Цели обработки</h2>
      <p style={s}>Персональная информация используется для: идентификации стороны, предоставления персонализированных сервисов, направления уведомлений, улучшения качества работы Сайта, проведения статистических исследований.</p>
      <h2 style={h}>4. Передача третьим лицам</h2>
      <p style={s}>Сайт вправе передать персональную информацию третьим лицам при согласии Пользователя, для исполнения договора, или по требованию законодательства РФ.</p>
      <h2 style={h}>5. Изменение и удаление данных</h2>
      <p style={s}>Пользователь может в любой момент изменить предоставленную персональную информацию, обратившись в Telegram-бот поддержки.</p>
      <h2 style={h}>6. Файлы Cookie</h2>
      <p style={s}>Файлы cookie используются для предоставления персонализированных сервисов и в статистических целях.</p>
      <h2 style={h}>7. Защита данных</h2>
      <p style={s}>Сайт предпринимает необходимые меры для защиты персональной информации от неправомерного доступа.</p>
      <h2 style={h}>8. Контакты</h2>
      <p style={{ ...s, color: '#6E6E6E' }}>
        Все вопросы по персональным данным направляйте в{' '}
        <a href="https://t.me/kickstepsupport_bot" target="_blank" rel="noopener noreferrer" style={{ color: '#0088CC', textDecoration: 'underline' }}>Telegram-бот поддержки</a>
      </p>
    </div></div>
  </>)
}
