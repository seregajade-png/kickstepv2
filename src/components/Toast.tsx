import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore } from '../stores/toastStore'

export default function Toast() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', pointerEvents: 'none' }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={() => removeToast(toast.id)}
            style={{
              pointerEvents: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#0A0A0A', color: '#FFF', padding: '12px 20px',
              borderRadius: 50, cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: "'Involve-Medium', Helvetica", fontWeight: 500, fontSize: 14,
            }}
          >
            {/* Checkmark */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
