'use client'

import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { Match } from '@/types'
import MatchCard from '@/components/ui/MatchCard'
import MatchModal from '@/components/ui/MatchModal'
import { formatWIB, getMatchStatusLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data)

type Filter = 'semua' | 'live' | 'selesai' | 'segera'

function groupByDate(matches: Match[]) {
  const groups = new Map<string, Match[]>()
  for (const m of matches) {
    const wibDate = formatWIB(m.fixture.date, 'EEE, dd MMM')
    if (!groups.has(wibDate)) groups.set(wibDate, [])
    groups.get(wibDate)!.push(m)
  }
  return groups
}

export default function JadwalSection() {
  const [filter, setFilter] = useState<Filter>('semua')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  // Fetch all fixtures (30s revalidate) — live matches have faster refresh
  const { data: matches = [], isLoading, mutate } = useSWR<Match[]>(
    '/api/fixtures',
    fetcher,
    { refreshInterval: 30000 }
  )

  const { data: liveMatches = [] } = useSWR<Match[]>(
    '/api/live',
    fetcher,
    { refreshInterval: 15000 }
  )

  // Merge live scores into all matches
  const mergedMatches = useMemo(() => {
    const liveMap = new Map(liveMatches.map(m => [m.fixture.id, m]))
    return matches.map(m => liveMap.get(m.fixture.id) || m)
  }, [matches, liveMatches])

  const filtered = useMemo(() => {
    return mergedMatches.filter(m => {
      const { isLive, isFinished, isPending } = getMatchStatusLabel(m.fixture.status.short, m.fixture.status.elapsed)
      if (filter === 'live') return isLive
      if (filter === 'selesai') return isFinished
      if (filter === 'segera') return isPending
      return true
    })
  }, [mergedMatches, filter])

  const grouped = groupByDate(filtered)
  const liveCount = mergedMatches.filter(m => ['1H','2H','HT','ET','P'].includes(m.fixture.status.short)).length

  const filters: { key: Filter; label: string }[] = [
    { key: 'semua', label: 'Semua' },
    { key: 'live', label: `🔴 Live${liveCount > 0 ? ` (${liveCount})` : ''}` },
    { key: 'selesai', label: 'Selesai' },
    { key: 'segera', label: 'Segera' },
  ]

  return (
    <div>
      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap mb-4">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all',
              filter === f.key
                ? 'bg-red-600 border-red-600 text-stone-900'
                : 'bg-stone-100 border-stone-300 text-stone-500 hover:text-green-800'
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-[10px] text-stone-400">
          <button onClick={() => mutate()} className="hover:text-stone-600 transition-colors">↻ Refresh</button>
          <span>· Semua waktu WIB (UTC+7)</span>
        </div>
      </div>

      {/* Match list */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-stone-100">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="px-4 py-3 flex gap-3 animate-pulse">
                <div className="w-8 h-8 bg-stone-100 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-stone-100 rounded w-1/3" />
                  <div className="h-2 bg-stone-100 rounded w-1/4" />
                </div>
                <div className="w-16 h-6 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <div className="text-3xl mb-2">📭</div>
            <div>Tidak ada pertandingan untuk filter ini</div>
          </div>
        ) : (
          Array.from(grouped.entries()).map(([date, dayMatches]) => (
            <div key={date}>
              <div className="px-4 py-2 bg-stone-50 text-xs font-bold text-stone-500 uppercase tracking-widest border-b border-stone-200">
                {date}
              </div>
              {dayMatches.map(m => (
                <MatchCard key={m.fixture.id} match={m} onClick={setSelectedMatch} />
              ))}
            </div>
          ))
        )}
      </div>

      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  )
}
