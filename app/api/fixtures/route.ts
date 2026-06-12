import { NextResponse } from 'next/server'
import { getAllFixtures, getLiveFixtures } from '@/lib/api-football'

export const revalidate = 30

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const liveOnly = searchParams.get('live') === 'true'

  try {
    const data = liveOnly ? await getLiveFixtures() : await getAllFixtures()
    return NextResponse.json({ data, updatedAt: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch fixtures', data: [] }, { status: 500 })
  }
}
