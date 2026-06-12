import { NextResponse } from 'next/server'
import { getFixtureStats, getFixtureEvents } from '@/lib/api-football'

export const revalidate = 30

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid fixture ID' }, { status: 400 })

  try {
    const [stats, events] = await Promise.all([
      getFixtureStats(id),
      getFixtureEvents(id),
    ])
    return NextResponse.json({ stats, events, updatedAt: new Date().toISOString() })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch fixture detail', stats: [], events: [] }, { status: 500 })
  }
}
