'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Match } from '@/types'
import LiveClock from '@/components/ui/LiveClock'
import Countdown from '@/components/ui/Countdown'
import Ticker from '@/components/ui/Ticker'
import JadwalSection from '@/components/sections/JadwalSection'
import KlasemenSection from '@/components/sections/KlasemenSection'
import PrediksiSection from '@/components/sections/PrediksiSection'
import KontenSection from '@/components/sections/KontenSection'
import TopScorers from '@/components/ui/TopScorers'
import { CITY_LIST, NOBAR_VENUES } from '@/lib/nobar-data'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data)

type Tab = 'jadwal' | 'klasemen' | 'prediksi' | 'konten' | 'nobar'

const TABS = [
  { key: 'jadwal' as Tab, icon: '📅', label: 'Jadwal & Skor' },
  { key: 'klasemen' as Tab, icon: '📊', label: 'Klasemen' },
  { key: 'prediksi' as Tab, icon: '🎯', label: 'Prediksi' },
  { key: 'konten' as Tab, icon: '📰', label: 'Konten' },
  { key: 'nobar' as Tab, icon: '📍', label: 'Nobar Finder' },
]

export default function Home() {
  const [tab, setTab] = useState<Tab>('jadwal')
  const { data: allMatches = [] } = useSWR<Match[]>('/api/fixtures', fetcher, { refreshInterval: 30000 })
  const { data: liveMatches = [] } = useSWR<Match[]>('/api/live', fetcher, { refreshInterval: 15000 })
  const tickerMatches = liveMatches.length > 0 ? liveMatches : allMatches.slice(0, 8)
  const liveCount = liveMatches.length

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Ticker matches={tickerMatches} />

      {/* Header */}
      <header className="sticky top-[33px] z-40 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-green-700 rounded-lg flex items-center justify-center text-xl">🏆</div>
            <div className="leading-none">
              <div className="font-display font-black text-stone-900 text-lg tracking-tight">
                WORLDCUP<span className="text-green-700">26</span>
              </div>
              <div className="text-[9px] text-green-700 font-bold tracking-[2px] uppercase">Hub Indonesia</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  tab === t.key ? 'bg-green-50 text-green-800' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50')}>
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            {liveCount > 0 && (
              <button onClick={() => setTab('jadwal')}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{liveCount} LIVE
              </button>
            )}
            <LiveClock />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 text-xs font-semibold text-green-800 tracking-wide mb-6">
            🇮🇩 Edisi Indonesia · Waktu WIB · Real-time
          </div>
          <h1 className="font-display font-black leading-none mb-4">
            <span className="block text-stone-900" style={{ fontSize: 'clamp(44px,9vw,84px)' }}>PIALA DUNIA</span>
            <span className="block text-green-700" style={{ fontSize: 'clamp(52px,11vw,100px)', marginTop: '-0.08em' }}>2026</span>
            <span className="block text-stone-400 tracking-[6px]" style={{ fontSize: 'clamp(13px,2.5vw,20px)', marginTop: '6px' }}>USA · CANADA · MEXICO</span>
          </h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto mb-8">
            Jadwal live, skor real-time, klasemen, prediksi & tempat nobar — semua dalam Bahasa Indonesia
          </p>
          <Countdown />
          <div className="flex justify-center gap-8 md:gap-12 flex-wrap mt-4">
            {[{n:'48',l:'Tim Nasional'},{n:'104',l:'Pertandingan'},{n:'16',l:'Stadion'},{n:'3',l:'Tuan Rumah'}].map(s=>(
              <div key={s.l} className="text-center">
                <div className="font-display font-black text-3xl text-green-700">{s.n}</div>
                <div className="text-xs text-stone-400 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nobar highlight strip */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link href="/nobar"
          className="flex items-center gap-4 bg-green-700 hover:bg-green-800 rounded-2xl px-5 py-4 transition-colors group">
          <span className="text-3xl">📍</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white">Cari Tempat Nobar di Kotamu</div>
            <div className="text-xs text-green-100">{NOBAR_VENUES.length}+ venue di {CITY_LIST.length} kota — gratis & berbayar</div>
          </div>
          <span className="text-white font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Tab bar */}
      <div className="sticky top-14 z-30 bg-white border-b border-stone-200 overflow-x-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto px-4 flex">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn('flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all shrink-0',
                tab === t.key ? 'border-green-700 text-green-800' : 'border-transparent text-stone-500 hover:text-stone-900')}>
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'jadwal' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="font-display font-black text-xl text-stone-900">📅 Jadwal & Skor Live</div>
                <div className="text-xs text-stone-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full inline-block animate-pulse" />Update tiap 30 detik
                </div>
              </div>
              <JadwalSection />
            </div>
            <div className="space-y-4">
              <TopScorers />
              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <div className="font-display font-bold text-stone-900 mb-2">🔔 Notifikasi WIB</div>
                <p className="text-xs text-stone-500 mb-3">Jangan ketinggalan kick-off favoritmu</p>
                <button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold text-sm py-2 rounded-lg transition-colors"
                  onClick={() => alert('Notifikasi diaktifkan! ✅')}>Aktifkan Notifikasi</button>
              </div>
            </div>
          </div>
        )}
        {tab === 'klasemen' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
            <div>
              <div className="font-display font-black text-xl text-stone-900 mb-4">📊 Klasemen Grup</div>
              <KlasemenSection />
            </div>
            <div className="space-y-4">
              <TopScorers />
            </div>
          </div>
        )}
        {tab === 'prediksi' && (
          <div>
            <div className="font-display font-black text-xl text-stone-900 mb-4">🎯 Prediksi & Poll</div>
            <PrediksiSection />
          </div>
        )}
        {tab === 'konten' && (
          <div>
            <div className="font-display font-black text-xl text-stone-900 mb-4">📰 Konten</div>
            <KontenSection />
          </div>
        )}
        {tab === 'nobar' && (
          <div>
            <div className="font-display font-black text-xl text-stone-900 mb-4">📍 Nobar Finder</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {CITY_LIST.map(city => {
                const count = NOBAR_VENUES.filter(v => v.city === city.slug).length
                return (
                  <Link key={city.slug} href={`/nobar/${city.slug}`}
                    className="bg-white border border-stone-200 rounded-2xl p-4 hover:border-green-600 hover:shadow-sm transition-all group">
                    <div className="text-2xl mb-2">{city.emoji}</div>
                    <div className="font-display font-bold text-stone-900 group-hover:text-green-700 text-sm">{city.name}</div>
                    <div className="text-[11px] mt-1 font-semibold">
                      {count > 0 ? <span className="text-green-700">{count} venue →</span> : <span className="text-stone-300">Segera</span>}
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="bg-green-700 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-display font-bold text-white">Punya tempat nobar?</div>
                <div className="text-green-100 text-xs mt-0.5">Daftarkan gratis — moderasi max 1×24 jam</div>
              </div>
              <Link href="/nobar/tambah"
                className="bg-white text-green-800 font-bold text-sm px-5 py-2.5 rounded-full hover:bg-green-50 transition-colors whitespace-nowrap">
                + Daftarkan Venue
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="font-display font-black text-xl text-stone-900 mb-2">WORLDCUP<span className="text-green-700">26</span></div>
              <p className="text-xs text-stone-400 leading-relaxed">Pusat informasi Piala Dunia 2026 dalam Bahasa Indonesia.</p>
            </div>
            <div>
              <div className="font-bold text-xs text-stone-600 uppercase tracking-widest mb-3">Fitur</div>
              <div className="space-y-2 text-xs text-stone-400">
                {TABS.map(t => <div key={t.key} className="hover:text-green-700 cursor-pointer" onClick={() => setTab(t.key)}>{t.label}</div>)}
              </div>
            </div>
            <div>
              <div className="font-bold text-xs text-stone-600 uppercase tracking-widest mb-3">Nobar</div>
              <div className="space-y-2 text-xs text-stone-400">
                {CITY_LIST.slice(0, 4).map(c => (
                  <Link key={c.slug} href={`/nobar/${c.slug}`} className="block hover:text-green-700">Nobar {c.name}</Link>
                ))}
                <Link href="/nobar" className="block hover:text-green-700 font-semibold">Semua Kota →</Link>
              </div>
            </div>
            <div>
              <div className="font-bold text-xs text-stone-600 uppercase tracking-widest mb-3">Partner</div>
              <div className="space-y-2 text-xs text-stone-400">
                <Link href="/nobar/tambah" className="block hover:text-green-700">Daftarkan Venue</Link>
                <div>Pasang Iklan</div>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-xs text-stone-400">© 2026 WorldCup26.my.id · Dibuat dengan ❤️ untuk penggemar bola Indonesia<br />Data: API-Football · WIB (UTC+7) · Bukan afiliasi resmi FIFA</p>
            <div className="text-xl">🇮🇩🇺🇸🇨🇦🇲🇽</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
