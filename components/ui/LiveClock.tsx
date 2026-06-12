'use client'

import { useEffect, useState } from 'react'
import { getCurrentWIBClock } from '@/lib/utils'

export default function LiveClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(getCurrentWIBClock().slice(0, 5))
    const t = setInterval(() => {
      setTime(getCurrentWIBClock().slice(0, 5))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="font-display text-lg font-black text-amber-400 tabular-nums tracking-tight min-w-[50px]">
      {time || '--:--'}
    </span>
  )
}
