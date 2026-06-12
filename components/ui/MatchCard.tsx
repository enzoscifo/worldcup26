'use client'

import { Match } from '@/types'
import { getFlag, getMatchStatusLabel, formatWIB } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  match: Match
  onClick?: (match: Match) => void
}

export default function MatchCard({ match, onClick }: Props) {
  const { isLive, isFinished, isPending, label, color } = getMatchStatusLabel(
    match.fixture.status.short,
    match.fixture.status.elapsed
  )
  const hFlag = getFlag(match.teams.home.name, match.teams.home.logo)
  const aFlag = getFlag(match.teams.away.name, match.teams.away.logo)
  const hasScore = match.goals.home !== null

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-3 border-b border-slate-800 last:border-0',
        'hover:bg-slate-800/40 transition-colors cursor-pointer group',
        isLive && 'bg-red-950/20'
      )}
      onClick={() => onClick?.(match)}
    >
      {/* Home team */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-2xl leading-none">{hFlag}</span>
        <div className="min-w-0">
          <div className="font-display font-bold text-white text-sm leading-tight truncate">
            {match.teams.home.name}
          </div>
          <div className="text-xs text-slate-500 leading-tight truncate hidden sm:block">
            {match.fixture.venue.name}
          </div>
        </div>
      </div>

      {/* Score / Time */}
      <div className="text-center shrink-0 w-24">
        {hasScore ? (
          <div className={cn(
            'font-display font-black text-xl leading-none tracking-widest',
            isLive ? 'text-red-400' : 'text-white'
          )}>
            {match.goals.home} – {match.goals.away}
          </div>
        ) : (
          <div className="font-display font-bold text-amber-400 text-sm">
            {formatWIB(match.fixture.date, 'HH:mm')}
            <div className="text-xs font-normal text-slate-500">WIB</div>
          </div>
        )}
        <div className={cn('text-[10px] font-bold tracking-widest uppercase mt-0.5', color)}>
          {isLive && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse" />}
          {label}
        </div>
      </div>

      {/* Away team */}
      <div className="flex items-center gap-2 flex-1 min-w-0 flex-row-reverse">
        <span className="text-2xl leading-none">{aFlag}</span>
        <div className="min-w-0 text-right">
          <div className="font-display font-bold text-white text-sm leading-tight truncate">
            {match.teams.away.name}
          </div>
          <div className="text-xs text-slate-500 leading-tight truncate hidden sm:block">
            {match.league.round}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="text-slate-600 group-hover:text-slate-400 transition-colors ml-1 shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}
