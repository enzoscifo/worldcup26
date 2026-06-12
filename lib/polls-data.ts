import { Poll } from '@/types'

export const POLLS: Poll[] = [
  {
    id: 'juara-2026',
    question: '🏆 Siapa juara Piala Dunia 2026?',
    options: [
      { id: 'brasil', label: 'Brasil', flag: '🇧🇷', votes: 4328 },
      { id: 'argentina', label: 'Argentina', flag: '🇦🇷', votes: 3541 },
      { id: 'perancis', label: 'Perancis', flag: '🇫🇷', votes: 2687 },
      { id: 'jerman', label: 'Jerman', flag: '🇩🇪', votes: 1243 },
      { id: 'spanyol', label: 'Spanyol', flag: '🇪🇸', votes: 1102 },
      { id: 'inggris', label: 'Inggris', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', votes: 987 },
    ],
    totalVotes: 13888,
    endsAt: '2026-07-20T00:00:00Z',
  },
  {
    id: 'esp-jpn',
    question: '⚽ Hasil Spanyol vs Jepang malam ini?',
    options: [
      { id: 'esp-win', label: 'Spanyol Menang', flag: '🇪🇸', votes: 2341 },
      { id: 'draw', label: 'Seri', flag: '🤝', votes: 1560 },
      { id: 'jpn-win', label: 'Jepang Menang (Upset!)', flag: '🇯🇵', votes: 1298 },
    ],
    totalVotes: 5199,
    endsAt: '2026-06-13T14:00:00Z',
  },
  {
    id: 'top-scorer',
    question: '🥅 Siapa top skor akhir turnamen?',
    options: [
      { id: 'ronaldo', label: 'C. Ronaldo', flag: '🇵🇹', votes: 3210 },
      { id: 'mbappe', label: 'K. Mbappé', flag: '🇫🇷', votes: 2988 },
      { id: 'messi', label: 'L. Messi', flag: '🇦🇷', votes: 2754 },
      { id: 'vinicius', label: 'Vinicius Jr.', flag: '🇧🇷', votes: 1432 },
    ],
    totalVotes: 10384,
    endsAt: '2026-07-20T00:00:00Z',
  },
]

export const LEADERBOARD = [
  { rank: 1, name: 'BolaSukaWC', avatar: '🧔', correct: 15, total: 16, points: 950, city: 'Surabaya' },
  { rank: 2, name: 'AnakJogja77', avatar: '👩', correct: 14, total: 16, points: 890, city: 'Yogyakarta' },
  { rank: 3, name: 'Prediksi_Pro', avatar: '🧑', correct: 13, total: 16, points: 850, city: 'Jakarta' },
  { rank: 4, name: 'SurabayaFC', avatar: '🎩', correct: 12, total: 16, points: 810, city: 'Surabaya' },
  { rank: 5, name: 'MbokDarmi88', avatar: '🧕', correct: 12, total: 16, points: 800, city: 'Semarang' },
  { rank: 6, name: 'PakSoino', avatar: '👴', correct: 11, total: 16, points: 765, city: 'Bandung' },
  { rank: 7, name: 'FutbolFanatic', avatar: '⚽', correct: 11, total: 16, points: 755, city: 'Medan' },
  { rank: 8, name: 'GarbaGila', avatar: '🦁', correct: 10, total: 16, points: 720, city: 'Makassar' },
]
