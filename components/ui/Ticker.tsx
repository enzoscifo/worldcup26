'use client'

import { Match } from '@/types'
import { getFlag, getStatusDot, formatWIB } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface Props { matches: Match[] }

export default function Ticker({ matches }: Props) {
  const items = matches.map(m => {
    const dot = getStatusDot(m.fixture.status.short)
    const hFlag = getFlag(m.teams.home.name, m.teams.home.logo)
    const aFlag = getFlag(m.teams.away.name, m.teams.away.logo)
    const isLive = ['1H','2H','HT','ET','P'].includes(m.fixture.status.short)
    const isNS = m.fixture.status.short === 'NS'
    const score = isNS
      ? formatWIB(m.fixture.date, 'HH:mm') + ' WIB'
      : `${m.goals.home ?? 0} - ${m.goals.away ?? 0}${isLive ? ` (${m.fixture.status.elapsed}')` : ''}`
    return `${dot} ${hFlag} ${m.teams.home.name.split(' ')[0]} ${score} ${m.teams.away.name.split(' ')[0]} ${aFlag}`
  })

  if (items.length === 0) return null

  const doubled = [...items, ...items]

  return (
    <div className="bg-red-700 overflow-hidden border-b-2 border-amber-500 sticky top-0 z-50">
      <div className="flex">
        <div className="flex animate-ticker whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex items-center px-8 py-1.5 text-sm font-semibold text-white tracking-wide shrink-0">
              {item}
              <span className="mx-6 text-amber-400 opacity-60">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
