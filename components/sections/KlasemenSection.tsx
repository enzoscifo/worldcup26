'use client'

import useSWR from 'swr'
import { Standing } from '@/types'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data)

function FormDot({ char }: { char: string }) {
  const colors: Record<string, string> = { W: 'bg-green-600', D: 'bg-slate-600', L: 'bg-red-600' }
  const labels: Record<string, string> = { W: 'M', D: 'S', L: 'K' }
  return (
    <span className={cn('inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black text-stone-900', colors[char] || 'bg-stone-200')}>
      {labels[char] || char}
    </span>
  )
}

function StandingTable({ standings, groupName }: { standings: Standing[]; groupName: string }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
        <div className="font-display font-bold text-stone-900">{groupName}</div>
        <div className="flex gap-3 text-[10px] text-stone-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-600 rounded-full inline-block" /> Lolos</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full inline-block" /> Playoff</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-stone-400 uppercase tracking-widest border-b border-stone-200">
              <th className="text-center py-2 px-2 w-6">#</th>
              <th className="text-left py-2 px-3">Tim</th>
              <th className="text-center py-2 px-2">M</th>
              <th className="text-center py-2 px-2">M</th>
              <th className="text-center py-2 px-2">S</th>
              <th className="text-center py-2 px-2">K</th>
              <th className="text-center py-2 px-2">GM</th>
              <th className="text-center py-2 px-2">GK</th>
              <th className="text-center py-2 px-2">SG</th>
              <th className="text-center py-2 px-2 font-black">Pts</th>
              <th className="text-center py-2 px-2">Form</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => {
              const isQ = s.rank <= 2
              const isBubble = s.rank === 3
              return (
                <tr key={s.team.id} className={cn(
                  'border-b border-stone-100 hover:bg-stone-50 transition-colors',
                  i === standings.length - 1 && 'border-0'
                )}>
                  <td className="text-center py-2.5 px-2">
                    <div className="flex items-center gap-0.5">
                      <div className={cn('w-1 h-6 rounded-full',
                        isQ ? 'bg-green-600' : isBubble ? 'bg-amber-500' : 'bg-transparent'
                      )} />
                      <span className="text-stone-400 font-bold w-4 text-center">{s.rank}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg leading-none">{s.team.logo || '🏳️'}</span>
                      <span className="font-semibold text-stone-900">{s.team.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-2.5 px-2 text-stone-600">{s.all.played}</td>
                  <td className="text-center py-2.5 px-2 text-stone-600">{s.all.win}</td>
                  <td className="text-center py-2.5 px-2 text-stone-600">{s.all.draw}</td>
                  <td className="text-center py-2.5 px-2 text-stone-600">{s.all.lose}</td>
                  <td className="text-center py-2.5 px-2 text-stone-600">{s.all.goals.for}</td>
                  <td className="text-center py-2.5 px-2 text-stone-600">{s.all.goals.against}</td>
                  <td className={cn('text-center py-2.5 px-2 font-semibold', s.goalsDiff > 0 ? 'text-green-600' : s.goalsDiff < 0 ? 'text-red-600' : 'text-stone-500')}>
                    {s.goalsDiff > 0 ? `+${s.goalsDiff}` : s.goalsDiff}
                  </td>
                  <td className="text-center py-2.5 px-2">
                    <span className="font-display font-black text-base text-stone-900">{s.points}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex gap-0.5">
                      {(s.form || '').split('').slice(-5).map((c, i) => <FormDot key={i} char={c} />)}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function KlasemenSection() {
  const { data: groups = [], isLoading } = useSWR<Standing[][]>(
    '/api/standings',
    fetcher,
    { refreshInterval: 60000 }
  )

  const groupNames = ['Grup A', 'Grup B', 'Grup C', 'Grup D', 'Grup E', 'Grup F', 'Grup G', 'Grup H',
    'Grup I', 'Grup J', 'Grup K', 'Grup L', 'Grup M', 'Grup N', 'Grup O', 'Grup P']

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border border-stone-200 rounded-xl overflow-hidden animate-pulse">
            <div className="h-10 bg-stone-100" />
            {[...Array(4)].map((_, j) => <div key={j} className="h-10 border-t border-stone-200 bg-white" />)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {groups.map((standings, i) => (
        <StandingTable
          key={i}
          standings={standings}
          groupName={standings[0]?.group || groupNames[i]}
        />
      ))}
    </div>
  )
}
