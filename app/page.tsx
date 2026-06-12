'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Match } from '@/types'
import LiveClock from '@/components/ui/LiveClock'
import Countdown from '@/components/ui/Countdown'
import Ticker from '@/components/ui/Ticker'
import JadwalSection from '@/components/sections/JadwalSection'
import KlasemenSection from '@/components/sections/KlasemenSection'
import PrediksiSection from '@/components/sections/PrediksiSection'
import KontenSection from '@/components/sections/KontenSection'
import NobarSection from '@/components/sections/NobarSection'
import TopScorers from '@/components/ui/TopScorers'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data)

type Tab = 'jadwal' | 'klasemen' | 'prediksi' | 'konten' | 'nobar'

const TABS = [
  { key: 'jadwal' as Tab, icon: '📅', label: 'Jadwal & Skor' },
  { key: 'klasemen' as Tab, icon: '📊', label: 'Klasemen' },
  { key: 'prediksi' as Tab, icon: '🎯', label: 'Prediksi & Poll' },
  { key: 'konten' as Tab, icon: '📰', label: 'Konten' },
  { key: 'nobar' as Tab, icon: '🍺', label: 'Nobar Finder' },
]

export default function Home() {
  const [tab, setTab] = useState<Tab>('jadwal')
  const { data: allMatches = [] } = useSWR<Match[]>('/api/fixtures', fetcher, { refreshInterval: 30000 })
  const { data: liveMatches = [] } = useSWR<Match[]>('/api/live', fetcher, { refreshInterval: 15000 })
  const tickerMatches = liveMatches.length > 0 ? liveMatches : allMatches.slice(0, 8)
  const liveCount = liveMatches.length

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Ticker matches={tickerMatches} />

      <header className="sticky top-[33px] z-40 bg-[#161b22] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-red-700 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-red-900/40">🏆</div>
            <div className="leading-none">
              <div className="font-display font-black text-white text-lg tracking-tight">WORLDCUP<span className="text-red-500">26</span></div>
              <div className="text-[9px] text-amber-400 font-bold tracking-[2px] uppercase">Hub Indonesia</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  tab === t.key ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50')}>
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            {liveCount > 0 && (
              <button onClick={() => setTab('jadwal')}
                className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{liveCount} LIVE
              </button>
            )}
            <LiveClock />
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-b from-slate-900 to-[#0d1117] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-amber-400 tracking-widest uppercase mb-6">
            🇮🇩 Edisi Indonesia · Waktu WIB · Real-time
          </div>
          <h1 className="font-display font-black leading-none mb-4">
            <span className="block text-white" style={{ fontSize: 'clamp(48px,10vw,96px)' }}>PIALA DUNIA</span>
            <span className="block text-red-500" style={{ fontSize: 'clamp(56px,12vw,112px)', marginTop: '-0.1em' }}>2026</span>
            <span className="block text-slate-600 tracking-[6px]" style={{ fontSize: 'clamp(14px,3vw,24px)', marginTop: '4px' }}>USA · CANADA · MEXICO</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">Jadwal live, skor real-time, klasemen, prediksi & info nobar — semua dalam Bahasa Indonesia</p>
          <Countdown />
          <div className="flex justify-center gap-8 md:gap-12 flex-wrap mt-4">
            {[{n:'48',l:'Tim Nasional'},{n:'104',l:'Pertandingan'},{n:'16',l:'Stadion'},{n:'3',l:'Negara Tuan Rumah'}].map(s=>(
              <div key={s.l} className="text-center">
                <div className="font-display font-black text-3xl text-amber-400">{s.n}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4 bg-slate-900 border border-amber-500/20 rounded-xl px-5 py-3 flex-wrap gap-y-2">
          <span className="text-2xl">👕</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-amber-400">Jersey Resmi Piala Dunia 2026 Tersedia!</div>
            <div className="text-xs text-slate-500">Dapatkan jersey tim favoritmu — gratis ongkir via Shopee</div>
          </div>
          <a href="https://shopee.co.id" target="_blank" rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0">
            Beli Sekarang →
          </a>
        </div>
      </div>

      <div className="sticky top-14 z-30 bg-[#161b22] border-b border-slate-800 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 flex">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn('flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all shrink-0',
                tab === t.key ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white')}>
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {tab === 'jadwal' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="font-display font-black text-xl text-white">📅 Jadwal & Skor Live</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />Update otomatis 30 detik
                </div>
              </div>
              <JadwalSection />
            </div>
            <div className="space-y-4">
              <TopScorers />
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="font-display font-bold text-white mb-2">🔔 Notifikasi WIB</div>
                <p className="text-xs text-slate-400 mb-3">Aktifkan agar tidak ketinggalan kick-off favoritmu (waktu WIB)</p>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2 rounded-lg transition-colors"
                  onClick={() => alert('Notifikasi diaktifkan! ✅')}>🔔 Aktifkan Notifikasi</button>
              </div>
              <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-600 text-xs">
                📢 300×250<br />Google AdSense
              </div>
            </div>
          </div>
        )}
        {tab === 'klasemen' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
            <div>
              <div className="font-display font-black text-xl text-white mb-4">📊 Klasemen Grup</div>
              <KlasemenSection />
            </div>
            <div className="space-y-4">
              <TopScorers />
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🗓️</div>
                <div className="font-display font-bold text-white mb-1">Bracket Knockout</div>
                <div className="text-xs text-slate-400">Tersedia setelah fase grup selesai<br />Perkiraan: 27 Juni 2026</div>
              </div>
            </div>
          </div>
        )}
        {tab === 'prediksi' && (
          <div>
            <div className="font-display font-black text-xl text-white mb-4">🎯 Prediksi & Poll</div>
            <PrediksiSection />
          </div>
        )}
        {tab === 'konten' && (
          <div>
            <div className="font-display font-black text-xl text-white mb-4">📰 Konten Bahasa Indonesia</div>
            <KontenSection />
          </div>
        )}
        {tab === 'nobar' && (
          <div>
            <div className="font-display font-black text-xl text-white mb-4">🍺 Nonton Bareng Finder</div>
            <NobarSection />
          </div>
        )}
      </main>

      <footer className="bg-[#161b22] border-t border-slate-800 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="font-display font-black text-xl text-white mb-2">WORLDCUP<span className="text-red-500">26</span></div>
              <p className="text-xs text-slate-500 leading-relaxed">Pusat informasi Piala Dunia 2026 dalam Bahasa Indonesia.</p>
            </div>
            <div>
              <div className="font-bold text-xs text-slate-300 uppercase tracking-widest mb-3">Fitur</div>
              <div className="space-y-2 text-xs text-slate-500">
                {TABS.map(t => <div key={t.key} className="hover:text-slate-300 cursor-pointer" onClick={() => setTab(t.key)}>{t.label}</div>)}
              </div>
            </div>
            <div>
              <div className="font-bold text-xs text-slate-300 uppercase tracking-widest mb-3">Konten</div>
              <div className="space-y-2 text-xs text-slate-500">
                <div>Highlight Pertandingan</div><div>Fun Facts WC</div><div>Rekap Harian</div><div>Profil Tim</div>
              </div>
            </div>
            <div>
              <div className="font-bold text-xs text-slate-300 uppercase tracking-widest mb-3">Partner</div>
              <div className="space-y-2 text-xs text-slate-500">
                <div>Shopee Jersey WC</div><div>Vidio Sport</div><div>Daftar Venue Nobar</div><div>Pasang Iklan</div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-xs text-slate-600">© 2026 WorldCup26.my.id · Dibuat dengan ❤️ untuk penggemar bola Indonesia<br />Data: API-Football · WIB (UTC+7) · Bukan afiliasi resmi FIFA</p>
            <div className="text-xl">🇮🇩🇺🇸🇨🇦🇲🇽</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
