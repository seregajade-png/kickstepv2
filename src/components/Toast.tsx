import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, Info } from 'lucide-react'
import { useToastStore } from '../stores/toastStore'

const icons = {
  success: <Check size={18} />,
  error: <X size={18} />,
  info: <Info size={18} />,
}

export default function Toast() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto bg-black text-white px-5 py-3 rounded-[14px] shadow-lg flex items-center gap-3 min-w-[240px] max-w-[360px]"
            onClick={() => removeToast(toast.id)}
          >
            <span className="flex-shrink-0">{icons[toast.type]}</span>
            <span className="text-sm leading-[18px] flex-1">{toast.message}</span>
            {toast.onUndo && (
              <button
                onClick={(e) => { e.stopPropagation(); toast.onUndo!(); removeToast(toast.id) }}
                className="flex-shrink-0 text-[13px] text-red-500 font-bold uppercase ml-2 hover:underline"
              >
                ОТМЕНИТЬ
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
