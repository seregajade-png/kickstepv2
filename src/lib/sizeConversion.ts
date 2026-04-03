/**
 * Shoe size conversion table: EU → US / RU
 * Source: standard sneaker sizing charts
 */
const CONVERSION_TABLE: { eu: number; us_m: string; us_w: string; ru: string }[] = [
  { eu: 35,   us_m: '3.5',  us_w: '5',    ru: '34' },
  { eu: 35.5, us_m: '4',    us_w: '5.5',  ru: '34.5' },
  { eu: 36,   us_m: '4',    us_w: '5.5',  ru: '35' },
  { eu: 36.5, us_m: '4.5',  us_w: '6',    ru: '35.5' },
  { eu: 37,   us_m: '5',    us_w: '6.5',  ru: '36' },
  { eu: 37.5, us_m: '5.5',  us_w: '7',    ru: '36.5' },
  { eu: 38,   us_m: '5.5',  us_w: '7',    ru: '37' },
  { eu: 38.5, us_m: '6',    us_w: '7.5',  ru: '37.5' },
  { eu: 39,   us_m: '6.5',  us_w: '8',    ru: '38' },
  { eu: 40,   us_m: '7',    us_w: '8.5',  ru: '39' },
  { eu: 40.5, us_m: '7.5',  us_w: '9',    ru: '39.5' },
  { eu: 41,   us_m: '8',    us_w: '9.5',  ru: '40' },
  { eu: 42,   us_m: '8.5',  us_w: '10',   ru: '41' },
  { eu: 42.5, us_m: '9',    us_w: '10.5', ru: '41.5' },
  { eu: 43,   us_m: '9.5',  us_w: '11',   ru: '42' },
  { eu: 44,   us_m: '10',   us_w: '11.5', ru: '43' },
  { eu: 44.5, us_m: '10.5', us_w: '12',   ru: '43.5' },
  { eu: 45,   us_m: '11',   us_w: '12.5', ru: '44' },
  { eu: 45.5, us_m: '11.5', us_w: '13',   ru: '44.5' },
  { eu: 46,   us_m: '12',   us_w: '13.5', ru: '45' },
  { eu: 47,   us_m: '12.5', us_w: '14',   ru: '46' },
  { eu: 47.5, us_m: '13',   us_w: '14.5', ru: '46.5' },
  { eu: 48,   us_m: '13.5', us_w: '15',   ru: '47' },
  { eu: 48.5, us_m: '14',   us_w: '15.5', ru: '47.5' },
]

export type SizeSystem = 'eu' | 'us' | 'ru'

export function convertSize(euSize: number, system: SizeSystem): string {
  const row = CONVERSION_TABLE.find((r) => r.eu === euSize)
  if (!row) return String(euSize)
  switch (system) {
    case 'eu': return String(row.eu)
    case 'us': return row.us_m
    case 'ru': return row.ru
  }
}

export function euToRu(euSize: number): string {
  return convertSize(euSize, 'ru')
}

export function euToUs(euSize: number): string {
  return convertSize(euSize, 'us')
}
