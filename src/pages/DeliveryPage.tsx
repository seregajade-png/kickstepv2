import { Helmet } from 'react-helmet-async'

export default function DeliveryPage() {
  return (
    <>
      <Helmet><title>Доставка — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        <h1 className="text-2xl font-semibold mb-4">Условия доставки</h1>
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Бесплатная доставка по Москве</h2>
            <p>Доставка по Москве в пределах МКАД осуществляется курьерами магазина с возможностью примерить несколько моделей. После оформления заказа менеджер свяжется для подтверждения.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Доставка по России</h2>
            <p>Доставка в регионы России осуществляется удобным способом (СДЭК, Яндекс, Почта России). Оплата стоимости обуви производится покупателем в момент получения после примерки.</p>
            <p className="mt-2">Сумма за услуги доставки возврату не подлежит.</p>
          </section>
        </div>
      </div>
    </>
  )
}
