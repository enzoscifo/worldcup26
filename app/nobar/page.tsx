import type { Metadata } from 'next'
import Link from 'next/link'
import { CITY_LIST, NOBAR_VENUES } from '@/lib/nobar-data'

export const metadata: Metadata = {
  title: 'Tempat Nobar Piala Dunia 2026 di Indonesia — WorldCup26.my.id',
  description: 'Direktori lengkap tempat nonton bareng (nobar) Piala Dunia 2026 di seluruh Indonesia. Yogyakarta, Jakarta, Surabaya, Bandung, dan kota lainnya. Gratis & berbayar.',
  keywords: ['nobar piala dunia 2026', 'tempat nobar', 'nonton bareng world cup', 'nobar gratis'],
  openGraph: {
    title: 'Nobar Finder — Piala Dunia 2026',
    description: 'Temukan tempat nonton bareng Piala Dunia 2026 di kotamu 🇮🇩⚽',
  },
}

export default function NobarIndexPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center text-base">🏆</div>
            <div className="leading-none">
              <div className="font-display font-black text-stone-900 text-base tracking-tight">
                WORLDCUP<span className="text-green-700">26</span>
              </div>
              <div className="text-[8px] text-green-700 font-bold tracking-[2px] uppercase">Nobar Finder</div>
            </div>
          </Link>
          <Link
            href="/nobar/tambah"
            className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
          >
            + Daftarkan Venue
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 text-xs font-semibold text-green-800 mb-5">
            ⚽ Piala Dunia 2026 · 11 Juni – 19 Juli
          </div>
          <h1 className="font-display font-black text-stone-900 leading-tight mb-3" style={{ fontSize: 'clamp(32px, 6vw, 52px)' }}>
            Mau Nobar di Mana<br />Malam Ini?
          </h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            Direktori tempat nonton bareng Piala Dunia 2026 terlengkap di Indonesia.
            Gratis maupun berbayar, outdoor sampai kafe ber-AC.
          </p>
        </div>
      </section>

      {/* City grid */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-stone-900">Pilih Kotamu</h2>
          <span className="text-xs text-stone-400">{NOBAR_VENUES.length} venue terdaftar</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CITY_LIST.map(city => {
            const count = NOBAR_VENUES.filter(v => v.city === city.slug).length
            return (
              <Link
                key={city.slug}
                href={`/nobar/${city.slug}`}
                className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-green-600 hover:shadow-sm transition-all group"
              >
                <div className="text-3xl mb-3">{city.emoji}</div>
                <div className="font-display font-bold text-stone-900 group-hover:text-green-700 transition-colors">
                  {city.name}
                </div>
                <div className="text-xs text-stone-400 mt-0.5">{city.province}</div>
                <div className="mt-3 text-xs font-semibold">
                  {count > 0 ? (
                    <span className="text-green-700">{count} venue →</span>
                  ) : (
                    <span className="text-stone-300">Segera hadir</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA submit */}
        <div className="mt-10 bg-green-700 rounded-2xl px-6 py-8 text-center">
          <div className="text-3xl mb-2">📍</div>
          <h3 className="font-display font-bold text-white text-xl mb-1">Punya Tempat Nobar?</h3>
          <p className="text-green-100 text-sm mb-5 max-w-sm mx-auto">
            Kafe, resto, atau komunitas — daftarkan gratis dan jangkau ribuan penggemar bola di kotamu.
          </p>
          <Link
            href="/nobar/tambah"
            className="inline-block bg-white text-green-800 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-green-50 transition-colors"
          >
            Daftarkan Venue Gratis →
          </Link>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-8 text-center text-xs text-stone-400">
        © 2026 WorldCup26.my.id · <Link href="/" className="hover:text-green-700">Kembali ke Beranda</Link>
      </footer>
    </div>
  )
}
