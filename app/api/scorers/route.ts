import { NextResponse } from 'next/server'
import { getTopScorers } from '@/lib/api-football'

export const revalidate = 300

export async function GET() {
  try {
    const data = await getTopScorers()
    return NextResponse.json({ data, updatedAt: new Date().toISOString() })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch scorers', data: [] }, { status: 500 })
  }
}
