import { useState, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  isOpen: boolean
  onClose: () => void
  brands: { id: number; name: string; slug: string }[]
  onApply: (filters: { brands: string[]; priceFrom: string; priceTo: string; discount: boolean; sizes: string[] }) => void
  currentBrandSlug?: string  // active brand section (for size grid + CM)
  currentSizeKey?: string    // override size key for model chips (e.g. 'yeezy', 'nike')
}

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"
const FR = "'Involve-Regular', Helvetica"

// Реальный диапазон цен: база ~2500-15000 + наценка 12000 = ~14500-27000, rounded to X90
const MIN_PRICE = 12990
const MAX_PRICE = 29990

// Размерная сетка (та же, что на v1): только реальные EU (без 39.5, 41.5 и т.п.)
const STANDARD_SIZES = ['36','36.5','37','37.5','38','38.5','39','40','40.5','41','42','42.5','43','44','44.5','45','46','47.5']
const BRAND_SIZE_MAP: Record<string, string[]> = {
  nike:        ['36','36.5','37.5','38','38.5','39','40','40.5','41','42','42.5','43','44','44.5','45','46','47.5'],
  jordan:      ['36','36.5','37.5','38','38.5','39','40','40.5','41','42','42.5','43','44','44.5','45','46','47.5'],
  yeezy:       ['36','36.5','37','38','38.5','39','40','40.5','41','42','42.5','43','44','44.5','45','46','47','48'],
  adidas:      ['36','36.5','37','38','38.5','39','40','40.5','41','42','42.5','43','44','44.5','45','46','47','48'],
  'new-balance': ['36','37','37.5','38','38.5','39','40','40.5','41.5','42','42.5','43','44','44.5','45'],
  balenciaga:  ['36','37','38','39','40','41','42','43','44','45','46'],
  'golden-goose': ['35','36','37','38','39','40','41','42','43','44','45','46'],
  'miu-miu':   ['36','37','38','39','40','41'],
  'alexander-mcqueen': ['36','37','38','39','40','41','42','43','44','45','46'],
}
// EU → CM по брендам (из v1 sizeConversion.ts)
const CM_BY_BRAND: Record<string, Record<string,string>> = {
  nike:        {'36':'22.5','36.5':'23','37.5':'23.5','38':'24','38.5':'24','39':'24.5','40':'25','40.5':'25.5','41':'26','42':'26.5','42.5':'27','43':'27.5','44':'28','44.5':'28.5','45':'29','46':'30','47.5':'31'},
  yeezy:       {'36':'22','36.5':'22.5','37':'23','38':'23.5','38.5':'24','39':'24.5','40':'25','40.5':'25.5','41':'26','42':'26.5','42.5':'27','43':'27.5','44':'28','44.5':'28.5','45':'29','46':'29.5','47':'30.5','48':'31'},
  'new-balance': {'36':'22','37':'22.5','37.5':'23','38':'23.5','38.5':'24','39':'24.5','40':'25','40.5':'25.5','41.5':'26','42':'26.5','42.5':'27','43':'27.5','44':'28','44.5':'28.5','45':'29'},
  balenciaga:  {'36':'24','37':'24.5','38':'25','39':'26','40':'26.5','41':'27','42':'27.5','43':'28.5','44':'29','45':'29.5','46':'30.5'},
  'golden-goose': {'35':'23','36':'23.5','37':'24','38':'24.5','39':'25.5','40':'26','41':'26.5','42':'27','43':'28.5','44':'29','45':'30','46':'30.5'},
  'miu-miu':   {'36':'24','37':'24.5','38':'25','39':'25.5','40':'26','41':'26.5'},
  adidas:      {'36':'22','36.5':'22.5','37':'23','38':'23.5','38.5':'24','39':'24.5','40':'25','40.5':'25.5','41':'26','42':'26.5','42.5':'27','43':'27.5','44':'28','44.5':'28.5','45':'29','46':'29.5','47':'30.5','48':'31'},
}
function normalizeBrandKey(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, '-')
}

const SIZE_LABEL_MAP: Record<string, string> = {
  nike: 'Nike', yeezy: 'Yeezy', adidas: 'Adidas',
  'new-balance': 'New Balance', balenciaga: 'Balenciaga',
  'golden-goose': 'Golden Goose', 'miu-miu': 'Miu Miu',
  'alexander-mcqueen': 'Alexander McQueen',
}

const SectionHeader = ({ title, open, onToggle }: { title: string; open: boolean; onToggle: () => void }) => (
  <button onClick={onToggle} style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', height: '1.5rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer',
  }}>
    <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A' }}>{title}</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {open ? <path d="M18 15L12 9L6 15"/> : <path d="M6 9L12 15L18 9"/>}
    </svg>
  </button>
)

/* ── Dual Range Slider ── */
function DualRangeSlider({ min, max, from, to, onChange }: {
  min: number; max: number; from: number; to: number;
  onChange: (from: number, to: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<'from' | 'to' | null>(null)

  const pct = (v: number) => ((v - min) / (max - min)) * 100

  const getVal = useCallback((clientX: number) => {
    if (!trackRef.current) return min
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(min + ratio * (max - min))
  }, [min, max])

  const onPointerDown = (which: 'from' | 'to') => (e: React.PointerEvent) => {
    dragging.current = which
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const val = getVal(e.clientX)
    if (dragging.current === 'from') onChange(Math.min(val, to - 100), to)
    else onChange(from, Math.max(val, from + 100))
  }

  const onPointerUp = () => { dragging.current = null }

  return (
    <div style={{ position: 'relative', padding: '0 0.875rem' }}>
      <div ref={trackRef} style={{ position: 'relative', height: '2.75rem', display: 'flex', alignItems: 'center', touchAction: 'none' }}
        onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        {/* Track bg */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: '0.1875rem', background: '#B5B5B5', borderRadius: '0.125rem' }} />
        {/* Active track */}
        <div style={{ position: 'absolute', left: `${pct(from)}%`, right: `${100 - pct(to)}%`, height: '0.1875rem', background: '#0A0A0A', borderRadius: '0.125rem' }} />
        {/* From thumb */}
        <div onPointerDown={onPointerDown('from')} style={{
          position: 'absolute', left: `${pct(from)}%`, transform: 'translateX(-50%)',
          width: '1.75rem', height: '1.75rem', borderRadius: '1.75rem', border: '0.125rem solid #0A0A0A', background: '#FFF',
          cursor: 'grab', zIndex: 2, touchAction: 'none',
        }} />
        {/* To thumb */}
        <div onPointerDown={onPointerDown('to')} style={{
          position: 'absolute', left: `${pct(to)}%`, transform: 'translateX(-50%)',
          width: '1.75rem', height: '1.75rem', borderRadius: '1.75rem', border: '0.125rem solid #0A0A0A', background: '#FFF',
          cursor: 'grab', zIndex: 2, touchAction: 'none',
        }} />
      </div>
    </div>
  )
}

export default function FilterDrawer({ isOpen, onClose, brands, onApply, currentBrandSlug, currentSizeKey: propSizeKey }: Props) {
  const [discount, setDiscount] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceFrom, setPriceFrom] = useState(MIN_PRICE)
  const [priceTo, setPriceTo] = useState(MAX_PRICE)
  const [priceOpen, setPriceOpen] = useState(true)
  const [sizeOpen, setSizeOpen] = useState(true)
  const [colorOpen, setColorOpen] = useState(false)

  const activeBrand = currentBrandSlug ? brands.find(b => b.slug === currentBrandSlug) : null
  const brandKey = activeBrand ? normalizeBrandKey(activeBrand.slug || activeBrand.name) : ''
  const sizeKey = propSizeKey || brandKey
  const allSizes = (sizeKey && BRAND_SIZE_MAP[sizeKey]) || STANDARD_SIZES
  const sizeBrandLabel = SIZE_LABEL_MAP[sizeKey] || (activeBrand ? activeBrand.name : '')
  const sizeSectionTitle = sizeBrandLabel ? `Размер ${sizeBrandLabel}` : 'Размер'
  const sizeSectionSubtitle = sizeKey ? 'Размеры указаны по сетке бренда' : ''
  const showCm = !!(sizeKey && CM_BY_BRAND[sizeKey])
  const getCm = (sz: string): string => showCm ? (CM_BY_BRAND[sizeKey]?.[sz] || '') : ''
  const allColors = [
    { name: 'Черный', hex: '#000000' }, { name: 'Белый', hex: '#FFFFFF' },
    { name: 'Бежевый', hex: '#E8D5B7' }, { name: 'Розовый', hex: '#F5A0B0' },
    { name: 'Красный', hex: '#D32F2F' }, { name: 'Серый', hex: '#9E9E9E' },
    { name: 'Синий', hex: '#1565C0' }, { name: 'Голубой', hex: '#90CAF9' },
    { name: 'Зеленый', hex: '#4CAF50' }, { name: 'Фиолетовый', hex: '#7B1FA2' },
    { name: 'Коричневый', hex: '#795548' }, { name: 'Оранжевый', hex: '#FF9800' },
  ]

  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const clearAll = () => { setDiscount(false); setSelectedSizes([]); setSelectedColors([]); setPriceFrom(MIN_PRICE); setPriceTo(MAX_PRICE) }

  const handleApply = () => {
    onApply({ brands: [], priceFrom: String(priceFrom), priceTo: String(priceTo), discount, sizes: selectedSizes })
    onClose()
  }

  const sectionBorder: React.CSSProperties = { borderBottom: '0.0625rem solid #B5B5B5' }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 199 }} />

          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%',
              background: '#FFF', zIndex: 200, display: 'flex', flexDirection: 'column',
              maxWidth: '26.875rem',
            }}
          >
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: '1rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', height: '2.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'inline-flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: F, fontWeight: 600, fontSize: '1.5rem', color: '#0A0A0A' }}>Фильтры</span>
                  <button onClick={clearAll} style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#6E6E6E', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    Очистить все
                  </button>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6L18 18"/>
                  </svg>
                </button>
              </div>

              {/* Price */}
              <div style={{ padding: '1rem', ...sectionBorder }}>
                <SectionHeader title="Цена" open={priceOpen} onToggle={() => setPriceOpen(v => !v)} />
                {priceOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', marginTop: '0.5rem' }}>
                    <DualRangeSlider min={MIN_PRICE} max={MAX_PRICE} from={priceFrom} to={priceTo}
                      onChange={(f, t) => { setPriceFrom(f); setPriceTo(t) }} />
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', flex: 1, borderRadius: '1.5rem', border: '0.0625rem solid #D1D1D1' }}>
                        <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#B5B5B5' }}>от</span>
                        <input value={priceFrom} onChange={e => setPriceFrom(Number(e.target.value) || 0)} style={{
                          flex: 1, fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A', background: 'none', border: 'none', outline: 'none', padding: 0, width: '100%',
                        }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', flex: 1, borderRadius: '1.5rem', border: '0.0625rem solid #D1D1D1' }}>
                        <span style={{ fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#B5B5B5' }}>до</span>
                        <input value={priceTo} onChange={e => setPriceTo(Number(e.target.value) || 0)} style={{
                          flex: 1, fontFamily: FM, fontWeight: 500, fontSize: '1rem', color: '#0A0A0A', background: 'none', border: 'none', outline: 'none', padding: 0, width: '100%',
                        }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Discount */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', ...sectionBorder }}>
                <span style={{ flex: 1, fontFamily: F, fontWeight: 600, fontSize: '1rem', color: '#0A0A0A' }}>Скидка</span>
                <button onClick={() => setDiscount(v => !v)} style={{
                  position: 'relative', width: '2.625rem', height: '1.5rem', borderRadius: '2rem',
                  background: discount ? '#0A0A0A' : '#B5B5B5', border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'background 0.2s',
                }}>
                  <div style={{
                    position: 'absolute', width: '1.125rem', height: '1.125rem', top: '0.1875rem', borderRadius: '2rem', background: '#FFF',
                    left: discount ? 21 : 3, transition: 'left 0.2s',
                  }} />
                </button>
              </div>

              {/* Size — row list EU/CM */}
              <div style={{ padding: '1rem', ...sectionBorder }}>
                <SectionHeader title={sizeSectionTitle} open={sizeOpen} onToggle={() => setSizeOpen(v => !v)} />
                {sizeSectionSubtitle && sizeOpen && (
                  <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.75rem', color: '#6E6E6E', margin: '0.25rem 0 0' }}>{sizeSectionSubtitle}</p>
                )}
                <AnimatePresence>
                  {sizeOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {allSizes.map((size) => {
                          const active = selectedSizes.includes(size)
                          const cm = showCm ? getCm(size) : ''
                          return (
                            <button key={size} onClick={() => toggleSize(size)} style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '0.875rem 0.25rem',
                              background: 'none', border: 0, borderBottom: '0.0625rem solid #F0F0F0', cursor: 'pointer', textAlign: 'left',
                              color: active ? '#ff5a00' : '#0A0A0A', fontWeight: active ? 600 : 500,
                              fontFamily: FM, fontSize: '1rem',
                            }}>
                              <span>{size} EU{cm ? ` / ${cm} см` : ''}</span>
                              <span style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', border: `0.09375rem solid ${active ? '#ff5a00' : '#cbcbcb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {active && <span style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', background: '#ff5a00' }} />}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Color */}
              <div style={{ padding: '1rem', ...sectionBorder }}>
                <SectionHeader title="Цвет" open={colorOpen} onToggle={() => setColorOpen(v => !v)} />
                <AnimatePresence>
                  {colorOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {allColors.map((color) => (
                          <button key={color.name} onClick={() => toggleColor(color.name)} style={{
                            width: '2.25rem', height: '2.25rem', borderRadius: '50%', cursor: 'pointer',
                            background: color.hex, border: selectedColors.includes(color.name) ? '0.1875rem solid #0A0A0A' : color.hex === '#FFFFFF' ? '0.0625rem solid #D1D1D1' : 'none',
                            boxShadow: selectedColors.includes(color.name) ? '0 0 0 0.125rem #FFF inset' : 'none',
                          }} title={color.name} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Apply button */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
              style={{ padding: '0.75rem 1rem 1.5rem', background: '#FFF' }}>
              <button onClick={handleApply} style={{
                display: 'flex', width: '100%', height: '3rem', alignItems: 'center', justifyContent: 'center',
                borderRadius: '1.5rem', background: '#0A0A0A', border: 'none', cursor: 'pointer',
                fontFamily: F, fontWeight: 600, fontSize: '0.875rem', color: '#FFF',
                transition: 'transform 0.1s',
              }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}>
                Применить
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
