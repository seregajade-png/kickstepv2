import { Helmet } from 'react-helmet-async'

export default function PaymentPage() {
  return (
    <>
      <Helmet><title>Оплата — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        <h1 className="text-2xl font-semibold mb-4">Способы оплаты</h1>
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Наличные</h2>
            <p>Оплата при получении после примерки. Рекомендуется подготовить сумму без сдачи.</p>
            <p className="mt-1 font-semibold text-black">Скидка 10% при оплате наличными.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Банковская карта / QR-код (СБП)</h2>
            <p>Безналичная оплата после примерки товара.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-black mb-2">Общие условия</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Оплата производится только если размер и модель устраивают покупателя.</li>
              <li>При отказе от товара оплата не производится.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
