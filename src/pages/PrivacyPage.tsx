import { Helmet } from 'react-helmet-async'

export default function PrivacyPage() {
  return (
    <>
      <Helmet><title>Политика конфиденциальности — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        <h1 className="text-2xl font-semibold mb-4">Политика конфиденциальности</h1>
        <div className="text-sm text-gray-600 leading-relaxed space-y-4">
          <p>Настоящий документ представляет собой правила использования сайтом персональной информации Пользователя.</p>
          <p>Использование Сайта означает безоговорочное согласие Пользователя с настоящей Политикой.</p>
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Собираемые данные</h2>
            <p>При оформлении заказа мы собираем: имя, номер телефона, адрес доставки.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Цели обработки</h2>
            <p>Данные используются для обработки заказов, связи с покупателем и доставки товаров.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Защита данных</h2>
            <p>Мы принимаем необходимые меры для защиты персональных данных от несанкционированного доступа.</p>
          </section>
        </div>
      </div>
    </>
  )
}
