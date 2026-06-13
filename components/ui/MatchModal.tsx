'use client'

import { useEffect, useState } from 'react'
import { Match, TeamStats, MatchEvent } from '@/types'
import { getFlag, getMatchStatusLabel, formatWIB } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  match: Match | null
  onClose: () => void
}

function StatBar({ label, home, away }: { label: string; home: string | number | null; away: string | number | null }) {
  const parse = (v: string | number | null) => {
    if (v === null) return 0
    if (typeof v === 'number') return v
    return parseInt(v.replace('%', '')) || 0
  }
  const h = parse(home)
  const a = parse(away)
  const total = h + a || 1
  const hPct = Math.round((h / total) * 100)

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-stone-500 mb-1">
        <span className="font-semibold text-stone-900">{home ?? '-'}</span>
        <span className="text-stone-400">{label}</span>
        <span className="font-semibold text-stone-900">{away ?? '-'}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-stone-200">
        <div className="bg-red-500 transition-all duration-700" style={{ width: `${hPct}%` }} />
        <div className="bg-blue-500 transition-all duration-700" style={{ width: `${100 - hPct}%` }} />
      </div>
    </div>
  )
}

export default function MatchModal({ match, onClose }: Props) {
  const [detail, setDetail] = useState<{ stats: TeamStats[]; events: MatchEvent[]; loading: boolean }>({
    stats: [], events: [], loading: true,
  })

  useEffect(() => {
    if (!match) return
    setDetail(d => ({ ...d, loading: true }))
    fetch(`/api/fixture/${match.fixture.id}`)
      .then(r => r.json())
      .then(data => setDetail({ stats: data.stats || [], events: data.events || [], loading: false }))
      .catch(() => setDetail(d => ({ ...d, loading: false })))
  }, [match?.fixture.id])

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  if (!match) return null

  const hFlag = getFlag(match.teams.home.name, match.teams.home.logo)
  const aFlag = getFlag(match.teams.away.name, match.teams.away.logo)
  const { label, isLive } = getMatchStatusLabel(match.fixture.status.short, match.fixture.status.elapsed)
  const hStats = detail.stats[0]?.statistics || []
  const aStats = detail.stats[1]?.statistics || []

  const getVal = (stats: typeof hStats, type: string) =>
    stats.find(s => s.type === type)?.value ?? null

  const statKeys = [
    'Ball Possession', 'Total Shots', 'Shots on Goal',
    'Fouls', 'Corner Kicks', 'Offsides', 'Yellow Cards', 'Passes',
  ]

  const eventIcons: Record<string, string> = {
    'Normal Goal': '⚽', 'Penalty': '⚽🎯', 'Own Goal': '⚽❌',
    'Yellow Card': '🟨', 'Red Card': '🟥', 'Substitution 1': '🔄', 'Substitution 2': '🔄',
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white border border-stone-300 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="font-display font-bold text-stone-900 text-lg leading-tight">
              {match.teams.home.name} vs {match.teams.away.name}
            </div>
            <div className="text-xs text-stone-500">{match.league.round} · {match.fixture.venue.name}</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-100 text-stone-500 hover:text-green-800 flex items-center justify-center text-sm transition-colors"
          >✕</button>
        </div>

        {/* Score */}
        <div className="px-5 py-6 text-center bg-stone-50">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-4xl mb-1">{hFlag}</div>
              <div className="font-display font-bold text-stone-900 text-sm">{match.teams.home.name}</div>
            </div>
            <div className="text-center">
              <div className={cn(
                'font-display font-black text-5xl leading-none tracking-widest',
                isLive ? 'text-red-600' : 'text-stone-900'
              )}>
                {match.goals.home ?? 0} – {match.goals.away ?? 0}
              </div>
              <div className="text-xs font-bold text-stone-500 mt-1 uppercase tracking-widest">
                {isLive && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse" />}
                {label}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-1">{aFlag}</div>
              <div className="font-display font-bold text-stone-900 text-sm">{match.teams.away.name}</div>
            </div>
          </div>
          <div className="text-xs text-stone-400 mt-3">
            {formatWIB(match.fixture.date, 'EEE, dd MMM')} · {formatWIB(match.fixture.date, 'HH:mm')} WIB
          </div>
        </div>

        {detail.loading ? (
          <div className="px-5 py-8 text-center text-stone-500 text-sm">Memuat statistik...</div>
        ) : (
          <>
            {/* Events */}
            {detail.events.length > 0 && (
              <div className="px-5 py-4">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Jalannya Pertandingan</div>
                <div className="space-y-2">
                  {detail.events.map((ev, i) => {
                    const isHome = ev.team.name === match.teams.home.name
                    const icon = eventIcons[ev.detail] || (ev.type === 'Goal' ? '⚽' : ev.type === 'Card' ? '🟨' : '🔄')
                    return (
                      <div key={i} className={cn('flex items-center gap-2 text-sm', !isHome && 'flex-row-reverse')}>
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0', isHome ? 'bg-red-100' : 'bg-blue-100')}>
                          {icon}
                        </div>
                        <div className={cn('flex-1', !isHome && 'text-right')}>
                          <span className="font-semibold text-stone-900">{ev.player.name}</span>
                          {ev.assist.name && <span className="text-stone-500"> (assist: {ev.assist.name})</span>}
                        </div>
                        <div className="font-display font-bold text-green-700 w-8 text-center shrink-0">
                          {ev.time.elapsed}'
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Stats */}
            {hStats.length > 0 && (
              <div className="px-5 pb-5">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Statistik</div>
                {statKeys.map(key => (
                  <StatBar key={key} label={key} home={getVal(hStats, key)} away={getVal(aStats, key)} />
                ))}
                <div className="flex justify-between text-xs text-stone-400 mt-3">
                  <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 bg-red-500 rounded-full" />{match.teams.home.name}</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />{match.teams.away.name}</span>
                </div>
              </div>
            )}

            {hStats.length === 0 && detail.events.length === 0 && (
              <div className="px-5 py-8 text-center text-stone-400 text-sm">
                {match.fixture.status.short === 'NS'
                  ? `Statistik tersedia saat pertandingan dimulai · ${formatWIB(match.fixture.date, 'HH:mm')} WIB`
                  : 'Statistik belum tersedia'
                }
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
