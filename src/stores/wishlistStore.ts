import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem } from '../types'
import { useToastStore } from './toastStore'

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: number) => void
  isInWishlist: (id: number) => boolean
  totalItems: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const state = get()
        if (state.items.find((i) => i.id === item.id)) return
        set({ items: [...state.items, item] })
        useToastStore.getState().addToast('Товар добавлен в избранное')
      },
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
        useToastStore.getState().addToast('Товар удалён из избранного', 'error')
      },
      isInWishlist: (id) => get().items.some((i) => i.id === id),
      totalItems: () => get().items.length,
    }),
    { name: 'wishlist_items' }
  )
)
