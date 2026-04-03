import { create } from 'zustand'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  onUndo?: () => void
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type'], onUndo?: () => void) => void
  removeToast: (id: number) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'success', onUndo) => {
    const id = Date.now()
    set((state) => ({
      toasts: [...state.toasts.slice(-2), { id, message, type, onUndo }],
    }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, onUndo ? 5000 : 2500)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))
