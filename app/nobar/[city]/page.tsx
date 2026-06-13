import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CITY_LIST, getCityBySlug, getVenuesByCity } from '@/lib/nobar-data'

interface Props {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return CITY_LIST.map(c => ({ city: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) return { title: 'Kota Tidak Ditemukan' }

  return {
    title: `Tempat Nobar Piala Dunia 2026 di ${city.name} — WorldCup26.my.id`,
    description: city.description,
    keywords: [`nobar ${city.name.toLowerCase()}`, `nobar piala dunia ${city.name.toLowerCase()}`, `nonton bareng world cup 2026 ${city.name.toLowerCase()}`],
    openGraph: {
      title: `Nobar Piala Dunia 2026 di ${city.name}`,
      description: city.description,
    },
  }
}

const TYPE_LABEL: Record<string, string> = {
  outdoor: '🏟️ Outdoor', cafe: '☕ Kafe', resto: '🍽️ Resto',
  mall: '🛍️ Mall', komunitas: '⚽ Komunitas',
}

export default async function CityNobarPage({ params }: Props) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const venues = getVenuesByCity(slug)
  const freeCount = venues.filter(v => v.isFree).length

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

      {/* Breadcrumb + Hero */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="text-xs text-stone-400 mb-4">
            <Link href="/" className="hover:text-green-700">Beranda</Link>
            {' / '}
            <Link href="/nobar" className="hover:text-green-700">Nobar</Link>
            {' / '}
            <span className="text-stone-600">{city.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{city.emoji}</div>
            <div>
              <h1 className="font-display font-black text-stone-900 leading-tight" style={{ fontSize: 'clamp(28px, 5vw, 42px)' }}>
                Nobar di {city.name}
              </h1>
              <p className="text-stone-500 text-sm mt-1">
                {venues.length} venue · {freeCount} gratis · {city.province}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Venue list */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {venues.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-display font-bold text-stone-900 text-lg mb-1">Belum Ada Venue di {city.name}</div>
            <p className="text-sm text-stone-500 mb-6">Jadilah yang pertama mendaftarkan tempat nobar di kotamu!</p>
            <Link
              href="/nobar/tambah"
              className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors"
            >
              + Daftarkan Venue Pertama
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venues.map(venue => (
              <div
                key={venue.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-green-600 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    {venue.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-stone-900 text-sm leading-snug">{venue.name}</h2>
                      <span className={
                        venue.isFree
                          ? 'shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800'
                          : 'shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800'
                      }>
                        {venue.isFree ? 'GRATIS' : 'BAYAR'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">📍 {venue.address}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                        {TYPE_LABEL[venue.type]}
                      </span>
                      {venue.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                  <span className="text-xs text-stone-400">🕐 Buka {venue.openTime} WIB</span>
                  <a
                    href={venue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-green-700 hover:text-green-900 transition-colors"
                  >
                    Buka Maps →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other cities */}
        <div className="mt-10">
          <h3 className="font-display font-bold text-stone-900 mb-4">Kota Lainnya</h3>
          <div className="flex flex-wrap gap-2">
            {CITY_LIST.filter(c => c.slug !== slug).map(c => (
              <Link
                key={c.slug}
                href={`/nobar/${c.slug}`}
                className="bg-white border border-stone-200 hover:border-green-600 text-stone-700 text-xs font-semibold px-4 py-2 rounded-full transition-all"
              >
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-green-700 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-display font-bold text-white">Punya venue di {city.name}?</div>
            <div className="text-green-100 text-xs mt-0.5">Daftarkan gratis, review max 1×24 jam</div>
          </div>
          <Link
            href="/nobar/tambah"
            className="bg-white text-green-800 font-bold text-sm px-5 py-2.5 rounded-full hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            + Daftarkan Sekarang
          </Link>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-8 text-center text-xs text-stone-400">
        © 2026 WorldCup26.my.id · <Link href="/nobar" className="hover:text-green-700">Semua Kota</Link>
      </footer>
    </div>
  )
}
