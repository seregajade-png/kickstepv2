import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '../stores/cartStore'


export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()

  const totalOldPrice = items.reduce((sum, i) => {
    const p = i.oldPrice && i.oldPrice > i.price ? i.oldPrice : i.price
    return sum + p * i.quantity
  }, 0)
  const discount = totalOldPrice - totalPrice()

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Корзина — KICKSTEP</title></Helmet>
        <div className="px-4 py-20 text-center max-w-[1440px] mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Корзина пуста</h1>
          <Link to="/catalog" className="inline-block py-3 px-8 bg-black text-white text-sm font-semibold rounded-[24px]">
            В каталог
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>Корзина — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        <h1 className="text-2xl font-semibold mb-4">Корзина</h1>

        {/* Items */}
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.sizeRu}`} className="flex gap-3 bg-white rounded-[14px] border border-gray-300 p-3">
              <Link to={`/product/${item.slug}`} className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{item.brand} {item.name}</p>
                <p className="text-xs text-gray-600 mt-0.5">{item.sizeEu} EU | {item.color}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[15px] font-bold">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.color, item.sizeRu, item.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <span className="text-base w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.color, item.sizeRu, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => removeItem(item.id, item.color, item.sizeRu)} className="self-start">
                <Trash2 size={20} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 bg-gray-100 rounded-t-[30px] p-4 -mx-4">
          <h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Общая сумма</span>
            <span className="text-[15px] font-bold">{totalOldPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Скидка</span>
              <span className="text-[15px] font-bold text-red-500">-{discount.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-gray-300">
            <span className="text-base font-semibold">Итого</span>
            <span className="text-base font-bold">{totalPrice().toLocaleString('ru-RU')} ₽</span>
          </div>

          <Link to="/checkout" className="block w-full mt-4 py-3 bg-black text-white text-sm font-semibold rounded-[24px] text-center">
            Оформить заказ
          </Link>
        </div>
      </div>
    </>
  )
}
