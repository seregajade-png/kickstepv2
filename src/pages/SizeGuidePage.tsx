import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { useIsDesktop } from '../hooks/useMediaQuery'

const F = "'Involve-SemiBold', Helvetica"
const FM = "'Involve-Medium', Helvetica"
const FR = "'Involve-Regular', Helvetica"

const sizeTablesData = [
  { id: 'nike', brand: 'NIKE / JORDAN', cols: ['EU','UK','US','СМ'], rows: [
    ['36','4','4.5','23'],['36.5','4.5','5','23.5'],['37.5','5','5.5','24'],['38','5.5','6','24.5'],['38.5','6','6.5','25'],['39','6.5','7','25.5'],['40','7','7.5','26'],['40.5','7.5','8','26.5'],['41','8','8.5','27'],['42','8.5','9','27.5'],['42.5','9','9.5','28'],['43','9.5','10','28.5'],['44','10','10.5','29'],['44.5','10.5','11','29.5'],['45','11','11.5','30'],['45.5','11.5','12','30.5'],['47.5','12.5','13','31'],
  ]},
  { id: 'adidas', brand: 'YEEZY / ADIDAS', cols: ['EU','UK','US','СМ'], rows: [
    ['36','3.5','4','22'],['36 2/3','4','4.5','22.5'],['37 1/3','4.5','5','23'],['38','5','5.5','23.5'],['38 2/3','5.5','6','24'],['39 1/3','6','6.5','24.5'],['40','6.5','7','25'],['40 2/3','7','7.5','25.5'],['41 1/3','7.5','8','26'],['42','8','8.5','26.5'],['42 2/3','8.5','9','27'],['43 1/3','9','9.5','27.5'],['44','9.5','10','28'],['44 2/3','10','10.5','28.5'],['45 1/3','10.5','11','29'],['46','11','11.5','29.5'],['46 2/3','11.5','12','30'],['48','12.5','13','31'],
  ]},
  { id: 'new-balance', brand: 'NEW BALANCE', cols: ['EU','UK','US','СМ'], rows: [
    ['36','3.5','4','23'],['37','4','4.5','23.5'],['37.5','5','5','24'],['38','5.5','5.5','24.5'],['39','6','6','25'],['39.5','6.5','6.5','25.5'],['40','7','7','26'],['40.5','7.5','7.5','26.5'],['41.5','8','8','27'],['42','8.5','8.5','27.5'],['42.5','9','9','28'],['43','9.5','9.5','28.5'],['44','10','10','29'],['44.5','10.5','10.5','29.5'],['45','11','11','30'],
  ]},
  { id: 'balenciaga', brand: 'BALENCIAGA', cols: ['EU','СМ'], rows: [
    ['36','23'],['37','24'],['38','24.5'],['39','25.5'],['40','26'],['41','26.5'],['42','27.5'],['43','28'],['44','29'],['45','29.5'],['46','30'],
  ]},
  { id: 'golden-goose', brand: 'GOLDEN GOOSE — ЖЕНСКИЕ', cols: ['Размер','Стелька'], rows: [
    ['35','22.5'],['36','23'],['37','24'],['38','24.5'],['39','25'],['40','26'],['41','26.5'],['42','27'],
  ]},
  { id: 'golden-goose-men', brand: 'GOLDEN GOOSE — МУЖСКИЕ', cols: ['Размер','Стелька'], rows: [
    ['40','26'],['41','26.5'],['42','27.5'],['43','28'],['44','29'],['45','29.5'],['46','30'],
  ]},
  { id: 'miu-miu', brand: 'MIU MIU', cols: ['EU','СМ'], rows: [
    ['36','23'],['37','24'],['38','24.5'],['39','25.5'],['40','26'],['41','26.5'],
  ]},
]

function SizeTable({ id, brand, cols, rows }: { id?: string; brand: string; cols: string[]; rows: string[][] }) {
  return (
    <div id={id} style={{ marginBottom: '2rem', scrollMarginTop: '6rem' }}>
      <h3 style={{ fontFamily: F, fontWeight: 600, fontSize: '1.125rem', color: '#0A0A0A', marginBottom: '0.75rem' }}>{brand}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FM, fontSize: '0.875rem' }}>
          <thead>
            <tr>{cols.map(c => <th key={c} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, color: '#0A0A0A', borderBottom: '0.125rem solid #D1D1D1', whiteSpace: 'nowrap' }}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#FFF' : '#F9F9F9' }}>
                {row.map((cell, j) => <td key={j} style={{ padding: '0.5rem 0.75rem', color: '#0A0A0A', borderBottom: '0.0625rem solid #F0F0F0', whiteSpace: 'nowrap' }}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function SizeGuidePage() {
  const isDesktop = useIsDesktop()
  const location = useLocation()
  const maxW = isDesktop ? 892 : undefined
  const px = isDesktop ? '0 2.5rem' : '0 1rem'

  // Handle brand anchor from URL hash (e.g. /size-guide#nike)
  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }, [location.hash])

  return (
    <>
      <Helmet><title>Как выбрать размер — SNEAKER MOSCOW</title></Helmet>
      <div style={{ width: isDesktop ? 1280 : undefined, maxWidth: '100%', margin: '0 auto', padding: px }}>
        <h1 style={{ fontFamily: F, fontWeight: 600, fontSize: isDesktop ? 32 : 24, color: '#0A0A0A', marginTop: isDesktop ? 24 : 16, marginBottom: '1rem' }}>
          Как выбрать размер
        </h1>

        <div style={{ maxWidth: maxW }}>
          {/* Как определить размер */}
          <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: isDesktop ? 20 : 16, color: '#0A0A0A', marginBottom: '0.5rem' }}>КАК ОПРЕДЕЛИТЬ МОЙ РАЗМЕР ОБУВИ?</h2>
          <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: '1.6', marginBottom: '1rem' }}>
            Для определения размера обуви нужно измерить длину стопы. Измерения проводят стоя, босиком, равномерно распределив массу тела на обе ноги, между перпендикулярами от конца наиболее выступающего пальца и наиболее выступающей части ПЯТКИ. Результат измерений нужно округлить в большую сторону до 0,5 см и найти полученное значение в таблице размеров.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <img src="/images/size_insole.png" alt="Как измерить стопу" style={{ maxWidth: isDesktop ? 400 : '100%', borderRadius: '0.875rem' }} />
            <img src="/images/size_measure.png" alt="Правильное измерение стопы" style={{ maxWidth: isDesktop ? 400 : '100%', borderRadius: '0.875rem' }} />
          </div>

          <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: isDesktop ? 20 : 16, color: '#0A0A0A', marginBottom: '0.5rem' }}>КАК ВЫБРАТЬ РАЗМЕР?</h2>
          <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: '1.6', marginBottom: '0.5rem' }}>
            Если у вас уже есть похожие товары такой же марки, которые хорошо подходят вам по размеру, то лучший способ правильно выбрать размер — посмотреть маркировку размера на прошлых покупках и заказать точно такой же.
          </p>
          <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: '1.6', marginBottom: '0.5rem' }}>
            Если вы делаете первую покупку в этой марке, то самым лучшим вариантом будет определить свой российский размер по таблицам соответствия, после чего выбрать товар по размеру.
          </p>
          <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Если вы сомневаетесь между двумя размерами — закажите оба для примерки.
          </p>

          <h2 style={{ fontFamily: F, fontWeight: 600, fontSize: isDesktop ? 20 : 16, color: '#0A0A0A', marginBottom: '0.5rem' }}>ЧЕМ ОТЛИЧАЮТСЯ ДЛИНА СТОПЫ И ДЛИНА СТЕЛЬКИ?</h2>
          <p style={{ fontFamily: FR, fontWeight: 400, fontSize: '0.875rem', color: '#0A0A0A', lineHeight: '1.6', marginBottom: '2rem' }}>
            Обувная колодка, по которой делают обувь, всегда чуть-чуть больше стопы, для которой она предназначена. Поэтому стелька всегда длиннее стопы на величину функционального припуска. Во всех размерных таблицах на нашем сайте указаны длины стелек.
          </p>

          {/* Size tables */}
          {sizeTablesData.map((t) => (
            <SizeTable key={t.brand} id={(t as any).id} brand={t.brand} cols={t.cols} rows={t.rows} />
          ))}
        </div>

        <div style={{ height: '2rem' }} />
      </div>
    </>
  )
}
