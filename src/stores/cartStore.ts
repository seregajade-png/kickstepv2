import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'
import { useToastStore } from './toastStore'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  addItemDirect: (item: CartItem) => void
  restoreItems: (items: CartItem[]) => void
  removeItem: (id: number, color: string, sizeRu: string) => void
  updateQuantity: (id: number, color: string, sizeRu: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.color === item.color && i.sizeRu === item.sizeRu
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.color === item.color && i.sizeRu === item.sizeRu
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
        useToastStore.getState().addToast('Товар добавлен в корзину')
      },
      addItemDirect: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.color === item.color && i.sizeRu === item.sizeRu
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.color === item.color && i.sizeRu === item.sizeRu
                  ? { ...i, quantity: item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },
      restoreItems: (restoredItems) => {
        set({ items: restoredItems })
      },
      removeItem: (id, color, sizeRu) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.color === color && i.sizeRu === sizeRu)
          ),
        }))
      },
      updateQuantity: (id, color, sizeRu, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.color === color && i.sizeRu === sizeRu
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'cart_items' }
  )
)
