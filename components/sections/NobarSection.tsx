'use client'

import { useState } from 'react'
import { NOBAR_VENUES, CITIES } from '@/lib/nobar-data'
import { NobarVenue } from '@/types'
import { cn } from '@/lib/utils'

const TYPE_ICON: Record<NobarVenue['type'], string> = {
  outdoor: '🏟️', cafe: '☕', resto: '🍽️', mall: '🛍️', komunitas: '⚽'
}
const TYPE_LABEL: Record<NobarVenue['type'], string> = {
  outdoor: 'Outdoor', cafe: 'Kafe', resto: 'Resto', mall: 'Mall', komunitas: 'Komunitas'
}

export default function NobarSection() {
  const [city, setCity] = useState('Yogyakarta')
  const [typeFilter, setTypeFilter] = useState<NobarVenue['type'] | 'semua'>('semua')

  const filtered = NOBAR_VENUES.filter(v =>
    v.city === city &&
    (typeFilter === 'semua' || v.type === typeFilter)
  )

  const types: Array<NobarVenue['type'] | 'semua'> = ['semua', 'outdoor', 'cafe', 'resto', 'mall', 'komunitas']

  return (
    <div>
      {/* City tabs */}
      <div className="flex gap-2 flex-wrap mb-4 overflow-x-auto pb-2">
        {CITIES.map(c => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-bold border whitespace-nowrap transition-all',
              city === c
                ? 'bg-red-600 border-red-600 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            )}
          >
            📍 {c}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        {types.map(t => {
          const label = t === 'semua' ? 'Semua' : `${TYPE_ICON[t as NobarVenue['type']]} ${TYPE_LABEL[t as NobarVenue['type']]}`
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                typeFilter === t
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-500">
            <div className="text-3xl mb-2">🔍</div>
            Tidak ada venue untuk filter ini
          </div>
        ) : filtered.map(venue => (
          <div key={venue.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
            <div className="px-5 py-4 flex gap-4 items-start">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {venue.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-white text-sm leading-tight">{venue.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">📍 {venue.address}</div>
                  </div>
                  <div className={cn('shrink-0 px-2 py-0.5 rounded text-xs font-bold',
                    venue.isFree ? 'bg-green-900/30 text-green-400 border border-green-700/30' : 'bg-amber-900/20 text-amber-400 border border-amber-700/20'
                  )}>
                    {venue.isFree ? 'GRATIS' : 'BAYAR'}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {venue.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 pb-4 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                🕐 Buka jam {venue.openTime} WIB
                {venue.phone && <span className="ml-3">📱 {venue.phone}</span>}
              </div>
              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                Maps →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Submit venue */}
      <div className="mt-6 bg-slate-900 border border-dashed border-slate-700 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">📍</div>
        <div className="font-semibold text-white mb-1">Punya venue nobar?</div>
        <div className="text-sm text-slate-400 mb-4">Daftarkan lokasi nobarmu dan jangkau ribuan penggemar bola</div>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
          onClick={() => alert('Fitur submit venue segera hadir!')}
        >
          + Daftarkan Venue Gratis
        </button>
      </div>
    </div>
  )
}
