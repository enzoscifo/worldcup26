import { NextResponse } from 'next/server'
import { getLiveFixtures } from '@/lib/api-football'

export const revalidate = 0 // no cache for live

export async function GET() {
  try {
    const data = await getLiveFixtures()
    return NextResponse.json({ data, updatedAt: new Date().toISOString() })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch live data', data: [] }, { status: 500 })
  }
}
