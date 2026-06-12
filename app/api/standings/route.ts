import { NextResponse } from 'next/server'
import { getStandings } from '@/lib/api-football'

export const revalidate = 60

export async function GET() {
  try {
    const data = await getStandings()
    return NextResponse.json({ data, updatedAt: new Date().toISOString() })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch standings', data: [] }, { status: 500 })
  }
}
