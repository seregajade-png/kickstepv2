import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '../stores/cartStore'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()

  const totalOldPrice = items.reduce((sum, i) => {
    return sum + ((i.oldPrice && i.oldPrice > i.price ? i.oldPrice : i.price) * i.quantity)
  }, 0)

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Корзина — KICKSTEP</title></Helmet>
        <div className="px-4 pt-4 pb-8 max-w-[1440px] mx-auto">
          <h1 className="text-2xl font-semibold mb-1">Корзина</h1>
          <p className="text-sm text-gray-600 mb-6">Твоя корзина пуста</p>
          <Link to="/catalog" className="block w-full py-3 text-sm font-semibold text-center border border-gray-300 rounded-[24px] hover:bg-black hover:text-white transition">
            Продолжить покупки
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>Корзина — KICKSTEP</title></Helmet>
      <div className="px-4 pt-4 pb-8 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Корзина</h1>
          <Link to="/catalog" className="text-sm text-gray-400">Все товары</Link>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-4 mb-6">
          {items.map((item) => (
            <div key={`${item.id}-${item.sizeRu}`} className="flex gap-3">
              <Link to={`/product/${item.slug}`} className="w-[100px] h-[100px] bg-gray-100 rounded-[14px] overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold truncate pr-2">{item.brand} {item.name}</p>
                  <button onClick={() => removeItem(item.id, item.color, item.sizeRu)} className="flex-shrink-0">
                    <Trash2 size={18} className="text-gray-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{item.sizeEu ? `${item.sizeEu} EU` : ''}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[15px] font-bold">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.color, item.sizeRu, item.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <span className="text-base w-5 text-center tracking-wide">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.color, item.sizeRu, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Общая стоимость</span>
            <span className="text-[15px] font-bold">{totalOldPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
          {totalOldPrice > totalPrice() && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Скидка</span>
              <span className="text-[15px] font-bold text-red-500">-{(totalOldPrice - totalPrice()).toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
        </div>

        <Link to="/checkout" className="block w-full mt-4 py-3 bg-black text-white text-sm font-semibold rounded-[24px] text-center">
          Перейти к оформлению
        </Link>
      </div>
    </>
  )
}
