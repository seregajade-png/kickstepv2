import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

interface Props { isOpen: boolean; onClose: () => void }

const FM = "'Involve-Medium', Helvetica"

const menuLinks = [
  { label: 'Новинки', to: '/catalog?sort=new' },
  { label: 'Мужское', to: '/men' },
  { label: 'Женское', to: '/women' },
  { label: 'Помощь', to: '/help' },
]

export default function MenuDrawer({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }} onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60 }} />
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '85%', maxWidth: '20rem', background: '#FFF', zIndex: 70, display: 'flex', flexDirection: 'column' }}>
            {/* Header: X + icons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/search" onClick={onClose} style={{ display: 'flex' }}>
                  <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                </Link>
                <Link to="/wishlist" onClick={onClose} style={{ display: 'flex' }}>
                  <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </Link>
                <Link to="/cart" onClick={onClose} style={{ display: 'flex' }}>
                  <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </Link>
              </div>
            </div>
            {/* Menu items */}
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 1rem' }}>
              {menuLinks.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: '-1.25rem' }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04, duration: 0.2 }}>
                  <Link to={link.to} onClick={onClose} style={{
                    display: 'block', padding: '1rem 0', fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A',
                    textDecoration: 'none', borderBottom: i < menuLinks.length - 1 ? '1px solid #F4F4F4' : 'none',
                  }}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
