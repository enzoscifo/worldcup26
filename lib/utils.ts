// WIB = UTC+7

export function toWIB(date: string | Date): Date {
  const d = new Date(date)
  // Shift to WIB (UTC+7)
  return new Date(d.getTime() + 7 * 60 * 60 * 1000)
}

export function formatWIB(date: string | Date, fmt = 'HH:mm'): string {
  const d = new Date(date)
  const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000)
  const h = String(wib.getUTCHours()).padStart(2, '0')
  const m = String(wib.getUTCMinutes()).padStart(2, '0')
  const dd = String(wib.getUTCDate()).padStart(2, '0')
  const mo = wib.getUTCMonth()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const day = days[wib.getUTCDay()]
  if (fmt === 'HH:mm') return `${h}:${m}`
  if (fmt === 'dd MMM') return `${dd} ${months[mo]}`
  if (fmt === 'EEE, dd MMM') return `${day}, ${dd} ${months[mo]}`
  return `${h}:${m}`
}

export function getTodayWIB(): string {
  const now = new Date()
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000)
  return wib.toISOString().slice(0, 10)
}

export function getCurrentWIBClock(): string {
  const now = new Date()
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000)
  return `${String(wib.getUTCHours()).padStart(2,'0')}:${String(wib.getUTCMinutes()).padStart(2,'0')}:${String(wib.getUTCSeconds()).padStart(2,'0')}`
}

export function getMatchStatusLabel(short: string, elapsed: number | null): {
  label: string; color: string; isLive: boolean; isPending: boolean; isFinished: boolean
} {
  const liveStatuses = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT', 'LIVE']
  const finishedStatuses = ['FT', 'AET', 'PEN']
  const isLive = liveStatuses.includes(short)
  const isFinished = finishedStatuses.includes(short)

  let label = ''
  let color = ''
  if (isLive) {
    label = elapsed ? `${elapsed}'` : short === 'HT' ? 'HT' : 'LIVE'
    color = 'text-red-400'
  } else if (isFinished) {
    label = short === 'AET' ? 'Selesai (ET)' : short === 'PEN' ? 'Selesai (Pen)' : 'Selesai'
    color = 'text-slate-400'
  } else {
    label = 'Segera'
    color = 'text-amber-400'
  }
  return { label, color, isLive, isPending: !isLive && !isFinished, isFinished }
}

export function getStatusDot(short: string): string {
  const live = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE']
  if (live.includes(short)) return '🔴'
  if (['FT', 'AET', 'PEN'].includes(short)) return '⚽'
  return '🔜'
}

// Map country name → flag emoji (common WC nations)
const FLAG_MAP: Record<string, string> = {
  'Brasil': '🇧🇷', 'Brazil': '🇧🇷',
  'Argentina': '🇦🇷',
  'Perancis': '🇫🇷', 'France': '🇫🇷',
  'Jerman': '🇩🇪', 'Germany': '🇩🇪',
  'Spanyol': '🇪🇸', 'Spain': '🇪🇸',
  'Portugal': '🇵🇹',
  'Inggris': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Belanda': '🇳🇱', 'Netherlands': '🇳🇱',
  'Belgia': '🇧🇪', 'Belgium': '🇧🇪',
  'Italia': '🇮🇹', 'Italy': '🇮🇹',
  'Jepang': '🇯🇵', 'Japan': '🇯🇵',
  'Korea Selatan': '🇰🇷', 'South Korea': '🇰🇷',
  'Australia': '🇦🇺',
  'Meksiko': '🇲🇽', 'Mexico': '🇲🇽',
  'Amerika Serikat': '🇺🇸', 'USA': '🇺🇸', 'United States': '🇺🇸',
  'Kanada': '🇨🇦', 'Canada': '🇨🇦',
  'Maroko': '🇲🇦', 'Morocco': '🇲🇦',
  'Senegal': '🇸🇳',
  'Nigeria': '🇳🇬',
  'Ghana': '🇬🇭',
  'Kamerun': '🇨🇲', 'Cameroon': '🇨🇲',
  'Tunisia': '🇹🇳',
  'Kroasia': '🇭🇷', 'Croatia': '🇭🇷',
  'Polandia': '🇵🇱', 'Poland': '🇵🇱',
  'Swiss': '🇨🇭', 'Switzerland': '🇨🇭',
  'Denmark': '🇩🇰',
  'Swedia': '🇸🇪', 'Sweden': '🇸🇪',
  'Uruguay': '🇺🇾',
  'Ekuador': '🇪🇨', 'Ecuador': '🇪🇨',
  'Kolombia': '🇨🇴', 'Colombia': '🇨🇴',
  'Qatar': '🇶🇦',
  'Arab Saudi': '🇸🇦', 'Saudi Arabia': '🇸🇦',
  'Iran': '🇮🇷',
  'Ukraina': '🇺🇦', 'Ukraine': '🇺🇦',
  'Kosta Rika': '🇨🇷', 'Costa Rica': '🇨🇷',
  'Panama': '🇵🇦',
  'Bolivia': '🇧🇴',
  'Peru': '🇵🇪',
  'Chile': '🇨🇱',
  'Paraguay': '🇵🇾',
  'Venezuela': '🇻🇪',
}

export function getFlag(teamName: string, logoUrl?: string): string {
  // If logo is emoji (mock mode), return it directly
  if (logoUrl && logoUrl.length <= 4 && !logoUrl.startsWith('http')) return logoUrl
  return FLAG_MAP[teamName] || '🏳️'
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
