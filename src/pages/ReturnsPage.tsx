import { Helmet } from 'react-helmet-async'

export default function ReturnsPage() {
  return (
    <>
      <Helmet><title>Возврат и обмен — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        <h1 className="text-2xl font-semibold mb-4">Обмен и возврат</h1>
        <div className="text-sm text-gray-600 leading-relaxed space-y-3">
          <p>Возврат или обмен товара возможен в течение 7 календарных дней с момента получения заказа, если соблюдены условия:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Товар без следов эксплуатации</li>
            <li>Сохранена полная комплектация (коробка, бирки, маркировка)</li>
          </ul>
          <p>Для оформления возврата или обмена напишите нам в Telegram.</p>
        </div>
      </div>
    </>
  )
}
