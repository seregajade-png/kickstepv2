import { Helmet } from 'react-helmet-async'

export default function OfferPage() {
  return (
    <>
      <Helmet><title>Оферта — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        <h1 className="text-2xl font-semibold mb-4">Договор оферты</h1>
        <div className="text-sm text-gray-600 leading-relaxed space-y-4">
          <p>Настоящий документ — публичная оферта интернет-магазина KICKSTEP.RU о продаже товаров.</p>
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Предмет оферты</h2>
            <p>Сайт обязуется передать покупателю товар для личного использования на основании размещённых заказов.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Возврат</h2>
            <p>Возврат осуществляется в соответствии с Законом РФ «О защите прав потребителей».</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Доставка</h2>
            <p>Доставка осуществляется в сроки, согласованные при подтверждении заказа.</p>
          </section>
        </div>
      </div>
    </>
  )
}
