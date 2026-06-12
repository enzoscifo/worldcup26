'use client'

import useSWR from 'swr'
import { TopScorer } from '@/types'
import { getFlag } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data)

export default function TopScorers() {
  const { data: scorers = [], isLoading } = useSWR<TopScorer[]>(
    '/api/scorers',
    fetcher,
    { refreshInterval: 300000 }
  )

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="font-display font-bold text-white">⚽ Top Skor</div>
        <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-semibold">Live</span>
      </div>
      {isLoading ? (
        <div className="divide-y divide-slate-800/50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-3 animate-pulse">
              <div className="w-5 h-5 bg-slate-800 rounded" />
              <div className="w-6 h-6 bg-slate-800 rounded" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-800 rounded w-2/3" />
                <div className="h-2 bg-slate-800 rounded w-1/3" />
              </div>
              <div className="w-8 h-6 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-slate-800/50">
          {scorers.slice(0, 8).map((s, i) => {
            const goals = s.statistics[0]?.goals.total ?? 0
            const flag = getFlag(s.player.nationality, undefined)
            return (
              <div key={s.player.id} className="flex items-center gap-3 px-4 py-3">
                <div className="font-display font-bold text-slate-500 w-5 text-center text-sm">{i + 1}</div>
                <div className="text-lg shrink-0">{getFlag(s.team?.name || '', s.team?.logo)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm truncate">{s.player.name}</div>
                  <div className="text-xs text-slate-500 truncate">{s.team?.name || s.player.nationality}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-display font-black text-xl text-amber-400 leading-none">{goals}</div>
                  <div className="text-[10px] text-slate-500">gol</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
