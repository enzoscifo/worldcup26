import { NobarVenue } from '@/types'

export interface CityInfo {
  slug: string
  name: string
  emoji: string
  province: string
  description: string
}

export const CITY_LIST: CityInfo[] = [
  { slug: 'yogyakarta', name: 'Yogyakarta', emoji: '🏛️', province: 'DI Yogyakarta', description: 'Tempat nobar Piala Dunia 2026 di Yogyakarta — dari Alun-alun Kidul sampai kafe Kaliurang.' },
  { slug: 'jakarta', name: 'Jakarta', emoji: '🏙️', province: 'DKI Jakarta', description: 'Venue nobar Piala Dunia 2026 di Jakarta — GBK fan zone, kafe SCBD, dan banyak lagi.' },
  { slug: 'surabaya', name: 'Surabaya', emoji: '🦈', province: 'Jawa Timur', description: 'Lokasi nonton bareng Piala Dunia 2026 di Surabaya dan sekitarnya.' },
  { slug: 'bandung', name: 'Bandung', emoji: '🌄', province: 'Jawa Barat', description: 'Tempat nobar Piala Dunia 2026 di Bandung — Braga, Dago, dan kafe-kafe kekinian.' },
  { slug: 'medan', name: 'Medan', emoji: '🌴', province: 'Sumatera Utara', description: 'Venue nonton bareng Piala Dunia 2026 di Medan.' },
  { slug: 'makassar', name: 'Makassar', emoji: '🌊', province: 'Sulawesi Selatan', description: 'Nobar Piala Dunia 2026 di Makassar — Pantai Losari dan lainnya.' },
  { slug: 'semarang', name: 'Semarang', emoji: '⛵', province: 'Jawa Tengah', description: 'Tempat nobar Piala Dunia 2026 di Semarang — Kota Lama dan sekitarnya.' },
  { slug: 'malang', name: 'Malang', emoji: '🍎', province: 'Jawa Timur', description: 'Lokasi nobar Piala Dunia 2026 di Malang.' },
  { slug: 'solo', name: 'Solo', emoji: '🎭', province: 'Jawa Tengah', description: 'Venue nonton bareng Piala Dunia 2026 di Solo / Surakarta.' },
  { slug: 'denpasar', name: 'Denpasar', emoji: '🏖️', province: 'Bali', description: 'Tempat nobar Piala Dunia 2026 di Denpasar dan Bali.' },
]

export function getCityBySlug(slug: string): CityInfo | undefined {
  return CITY_LIST.find(c => c.slug === slug)
}

export const NOBAR_VENUES: NobarVenue[] = [
  // YOGYAKARTA
  {
    id: 'yk-1', name: 'Nobar WC 2026 — Alun-alun Kidul', city: 'yogyakarta',
    address: 'Alun-alun Kidul, Kraton, Yogyakarta', type: 'outdoor', icon: '🏟️',
    tags: ['LED Screen Besar', 'Food Court', 'Parkir Luas', 'Kapasitas 500+'],
    isFree: true, openTime: '20:00',
    mapsUrl: 'https://maps.google.com/?q=Alun-alun+Kidul+Yogyakarta',
  },
  {
    id: 'yk-2', name: 'Filosofi Kopi Yogyakarta', city: 'yogyakarta',
    address: 'Jl. Ndalem Mangkubumen KT III/578', type: 'cafe', icon: '☕',
    tags: ['AC', 'Proyektor 150"', 'Reservasi Wajib', 'Menu Spesial WC'],
    isFree: false, openTime: '21:00',
    mapsUrl: 'https://maps.google.com/?q=Filosofi+Kopi+Yogyakarta',
    phone: '+62 274 123456',
  },
  {
    id: 'yk-3', name: 'Angkringan Pak Budi — WC Special', city: 'yogyakarta',
    address: 'Jl. Malioboro No. 45', type: 'outdoor', icon: '🍗',
    tags: ['Outdoor', 'Nasi Kucing', 'Vibe Tradisional'],
    isFree: true, openTime: '19:00',
    mapsUrl: 'https://maps.google.com/?q=Malioboro+Yogyakarta',
  },
  {
    id: 'yk-4', name: 'Warung Kopi Klotok', city: 'yogyakarta',
    address: 'Jl. Kaliurang KM 16, Sleman', type: 'cafe', icon: '🌄',
    tags: ['View Merapi', 'Outdoor', 'WiFi Gratis', 'Semua Match'],
    isFree: true, openTime: '20:00',
    mapsUrl: 'https://maps.google.com/?q=Warung+Kopi+Klotok+Yogyakarta',
  },
  {
    id: 'yk-5', name: 'Timezone Ambarukmo Plaza', city: 'yogyakarta',
    address: 'Ambarukmo Plaza Lt.3, Jl. Laksda Adisucipto', type: 'mall', icon: '🎮',
    tags: ['AC Dingin', 'Indoor', 'Gaming Area', 'Free Snack'],
    isFree: false, openTime: '20:30',
    mapsUrl: 'https://maps.google.com/?q=Ambarukmo+Plaza+Yogyakarta',
  },
  {
    id: 'yk-6', name: 'Komunitas Bola Jogja (KBJ)', city: 'yogyakarta',
    address: 'Jl. Colombo No.1, Yogyakarta', type: 'komunitas', icon: '⚽',
    tags: ['Komunitas', 'Gratis Member', 'Analisis Live', 'Discord Aktif'],
    isFree: true, openTime: '19:30',
    mapsUrl: 'https://maps.google.com/?q=Colombo+Yogyakarta',
  },

  // JAKARTA
  {
    id: 'jkt-1', name: 'GBK Fan Zone Senayan', city: 'jakarta',
    address: 'Komplek GBK, Senayan, Jakarta Pusat', type: 'outdoor', icon: '🏟️',
    tags: ['LED Raksasa', 'Food Festival', 'Kapasitas 5000+'],
    isFree: true, openTime: '19:00',
    mapsUrl: 'https://maps.google.com/?q=GBK+Senayan+Jakarta',
  },
  {
    id: 'jkt-2', name: 'Kopi Kenangan WC Corner — SCBD', city: 'jakarta',
    address: 'Pacific Place, SCBD, Jakarta Selatan', type: 'cafe', icon: '☕',
    tags: ['AC', 'Indoor', 'Screen 4K', 'Menu Edisi WC'],
    isFree: false, openTime: '21:00',
    mapsUrl: 'https://maps.google.com/?q=Pacific+Place+Jakarta',
  },
  {
    id: 'jkt-3', name: 'M Bloc Space — Layar Tancep WC', city: 'jakarta',
    address: 'Jl. Panglima Polim, Jakarta Selatan', type: 'outdoor', icon: '📽️',
    tags: ['Outdoor', 'Hip & Cozy', 'Food Stalls', 'Anak Muda'],
    isFree: true, openTime: '20:00',
    mapsUrl: 'https://maps.google.com/?q=M+Bloc+Space+Jakarta',
  },

  // SURABAYA
  {
    id: 'sby-1', name: 'Nobar WC — Taman Bungkul', city: 'surabaya',
    address: 'Taman Bungkul, Jl. Raya Darmo', type: 'outdoor', icon: '🌳',
    tags: ['Gratis', 'Outdoor', 'LED Screen', 'Kuliner Sekitar'],
    isFree: true, openTime: '20:00',
    mapsUrl: 'https://maps.google.com/?q=Taman+Bungkul+Surabaya',
  },
  {
    id: 'sby-2', name: 'G-Walk Citraland Nobar Fest', city: 'surabaya',
    address: 'G-Walk, Citraland, Surabaya Barat', type: 'resto', icon: '🍽️',
    tags: ['Kuliner Lengkap', 'Outdoor', 'Big Screen', 'Keluarga'],
    isFree: true, openTime: '19:30',
    mapsUrl: 'https://maps.google.com/?q=G-Walk+Citraland+Surabaya',
  },

  // BANDUNG
  {
    id: 'bdg-1', name: 'Bandung Super Soccer Hub', city: 'bandung',
    address: 'Jl. Braga No.99', type: 'cafe', icon: '⚽',
    tags: ['Multi Screen', 'Kapasitas 200', 'Live DJ'],
    isFree: false, openTime: '20:00',
    mapsUrl: 'https://maps.google.com/?q=Braga+Bandung',
  },
  {
    id: 'bdg-2', name: 'Alun-alun Bandung WC Zone', city: 'bandung',
    address: 'Alun-alun Kota Bandung, Jl. Asia Afrika', type: 'outdoor', icon: '🏟️',
    tags: ['Gratis', 'Rumput Sintetis', 'LED Besar', 'Pusat Kota'],
    isFree: true, openTime: '19:00',
    mapsUrl: 'https://maps.google.com/?q=Alun-alun+Bandung',
  },

  // MEDAN
  {
    id: 'mdn-1', name: 'Lapangan Merdeka WC Zone', city: 'medan',
    address: 'Lapangan Merdeka, Jl. Balai Kota', type: 'outdoor', icon: '🏟️',
    tags: ['Gratis', 'LED Outdoor', 'Food Stalls', 'Keluarga'],
    isFree: true, openTime: '19:30',
    mapsUrl: 'https://maps.google.com/?q=Lapangan+Merdeka+Medan',
  },

  // MAKASSAR
  {
    id: 'mks-1', name: 'Pantai Losari WC Fiesta', city: 'makassar',
    address: 'Anjungan Pantai Losari', type: 'outdoor', icon: '🌊',
    tags: ['View Pantai', 'Gratis', 'Sunset + Bola'],
    isFree: true, openTime: '18:00',
    mapsUrl: 'https://maps.google.com/?q=Pantai+Losari+Makassar',
  },

  // SEMARANG
  {
    id: 'smg-1', name: 'Kota Lama Nonton Bareng', city: 'semarang',
    address: 'Kawasan Kota Lama, Semarang', type: 'outdoor', icon: '🏛️',
    tags: ['Heritage Area', 'Gratis', 'Food Stalls'],
    isFree: true, openTime: '20:00',
    mapsUrl: 'https://maps.google.com/?q=Kota+Lama+Semarang',
  },
]

export function getVenuesByCity(citySlug: string): NobarVenue[] {
  return NOBAR_VENUES.filter(v => v.city === citySlug)
}

export const CITIES = CITY_LIST.map(c => c.name)
