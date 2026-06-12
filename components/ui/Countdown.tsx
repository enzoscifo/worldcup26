'use client'

import { useEffect, useState } from 'react'

const KICKOFF = new Date('2026-06-11T00:00:00+07:00')

function getTimeLeft() {
  const diff = Math.max(0, KICKOFF.getTime() - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
    done: diff === 0,
  }
}

export default function Countdown() {
  const [t, setT] = useState(getTimeLeft())

  useEffect(() => {
    const iv = setInterval(() => setT(getTimeLeft()), 1000)
    return () => clearInterval(iv)
  }, [])

  if (t.done) {
    return (
      <div className="inline-flex items-center gap-3 bg-red-600 rounded-2xl px-8 py-5">
        <span className="font-display text-3xl font-black text-white tracking-tight">🔴 PIALA DUNIA SEDANG BERLANGSUNG!</span>
      </div>
    )
  }

  const units = [
    { val: t.days, label: 'Hari' },
    { val: t.hours, label: 'Jam' },
    { val: t.mins, label: 'Menit' },
    { val: t.secs, label: 'Detik' },
  ]

  return (
    <div className="inline-flex gap-3 bg-slate-900 border border-slate-700 rounded-2xl px-8 py-5 mb-10">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-start gap-3">
          <div className="text-center min-w-[56px]">
            <div className="font-display text-5xl font-black text-white leading-none tabular-nums">
              {String(u.val).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-1">{u.label}</div>
          </div>
          {i < 3 && (
            <div className="font-display text-3xl font-black text-red-500 pt-1 animate-pulse">:</div>
          )}
        </div>
      ))}
    </div>
  )
}
