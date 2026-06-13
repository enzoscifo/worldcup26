'use client'

import { useState, useEffect } from 'react'
import { Poll } from '@/types'
import { POLLS, LEADERBOARD } from '@/lib/polls-data'
import { cn } from '@/lib/utils'

function PollCard({ poll }: { poll: Poll }) {
  const [voted, setVoted] = useState<string | null>(null)
  const [localVotes, setLocalVotes] = useState<Record<string, number>>({})

  useEffect(() => {
    const saved = localStorage.getItem(`poll-${poll.id}`)
    if (saved) setVoted(saved)
  }, [poll.id])

  function vote(optId: string) {
    if (voted) return
    setVoted(optId)
    setLocalVotes(v => ({ ...v, [optId]: (v[optId] || 0) + 1 }))
    localStorage.setItem(`poll-${poll.id}`, optId)
  }

  const total = poll.totalVotes + Object.values(localVotes).reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-4">
      <div className="px-5 py-4 border-b border-stone-200">
        <div className="font-display font-bold text-stone-900 text-lg">{poll.question}</div>
        <div className="text-xs text-stone-400 mt-0.5">{total.toLocaleString('id-ID')} suara</div>
      </div>
      <div className="p-4 space-y-2">
        {poll.options.map(opt => {
          const votes = opt.votes + (localVotes[opt.id] || 0)
          const pct = Math.round((votes / total) * 100)
          const isVoted = voted === opt.id

          return (
            <button
              key={opt.id}
              onClick={() => vote(opt.id)}
              disabled={!!voted}
              className={cn(
                'relative w-full text-left rounded-lg border overflow-hidden transition-all',
                isVoted ? 'border-red-500' : voted ? 'border-stone-300 opacity-60' : 'border-stone-300 hover:border-green-600',
                voted ? 'cursor-default' : 'cursor-pointer'
              )}
            >
              {/* Bar */}
              {voted && (
                <div
                  className={cn('absolute inset-y-0 left-0 transition-all duration-700 rounded-l-lg', isVoted ? 'bg-red-100' : 'bg-stone-50')}
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-stone-900">
                  <span className="text-xl">{opt.flag}</span>
                  {opt.label}
                  {isVoted && <span className="text-xs text-red-600 font-normal">✓ Pilihanmu</span>}
                </div>
                {voted && (
                  <div className="font-display font-black text-lg text-green-700">{pct}%</div>
                )}
              </div>
            </button>
          )
        })}
      </div>
      {!voted && (
        <div className="px-5 pb-4 text-xs text-stone-400">Tap untuk memilih</div>
      )}
    </div>
  )
}

export default function PrediksiSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-0">
        {POLLS.map(poll => <PollCard key={poll.id} poll={poll} />)}
      </div>

      {/* Leaderboard */}
      <div>
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden sticky top-32">
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="font-display font-bold text-stone-900 text-lg">🏅 Top Prediksi</div>
            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded font-semibold">Mingguan</span>
          </div>
          <div className="divide-y divide-stone-100">
            {LEADERBOARD.slice(0, 8).map(lb => {
              const medal = lb.rank === 1 ? 'text-green-700' : lb.rank === 2 ? 'text-stone-500' : lb.rank === 3 ? 'text-orange-500' : 'text-stone-300'
              return (
                <div key={lb.rank} className="flex items-center gap-3 px-5 py-3">
                  <div className={cn('font-display font-black text-xl w-6 text-center shrink-0', medal)}>
                    {lb.rank <= 3 ? ['🥇','🥈','🥉'][lb.rank - 1] : lb.rank}
                  </div>
                  <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-lg shrink-0">
                    {lb.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-stone-900 truncate">{lb.name}</div>
                    <div className="text-xs text-stone-400">{lb.correct}/{lb.total} benar · {lb.city}</div>
                  </div>
                  <div className="font-display font-black text-lg text-green-700 shrink-0">{lb.points}</div>
                </div>
              )
            })}
          </div>
          <div className="px-5 py-4 border-t border-stone-200">
            <button
              className="w-full bg-red-600 hover:bg-red-600 text-stone-900 font-bold text-sm py-2.5 rounded-lg transition-colors"
              onClick={() => alert('Fitur login prediksi segera hadir!')}
            >
              🎯 Ikut Prediksi & Menangkan Hadiah
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
