import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const menuLinks = [
  { label: 'Каталог', to: '/catalog' },
  { label: 'Мужское', to: '/men' },
  { label: 'Женское', to: '/women' },
  { label: 'Бренды', to: '/catalog' },
  { label: 'Помощь', to: '/help' },
  { label: 'О нас', to: '/about' },
  { label: 'Контакты', to: '/contacts' },
]

export default function MenuDrawer({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <span className="text-2xl font-semibold">KICKSTEP</span>
              <button onClick={onClose} aria-label="Закрыть">
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              {menuLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={onClose}
                  className="py-3 text-base font-medium border-b border-gray-100 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
