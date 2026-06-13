import { NextResponse } from 'next/server'

/**
 * GET /api/debug
 * Diagnostik koneksi API-Football. Buka di browser:
 * https://worldcup26.my.id/api/debug
 *
 * HAPUS file ini setelah selesai debugging.
 */

export const revalidate = 0

export async function GET() {
  const API_KEY = process.env.RAPIDAPI_KEY || ''
  const LEAGUE_ID = process.env.NEXT_PUBLIC_WC_LEAGUE_ID || '1'
  const SEASON = process.env.NEXT_PUBLIC_WC_SEASON || '2026'

  const diagnosis: Record<string, unknown> = {
    env: {
      RAPIDAPI_KEY_present: !!API_KEY,
      RAPIDAPI_KEY_preview: API_KEY ? `${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)}` : 'KOSONG',
      RAPIDAPI_KEY_is_placeholder: API_KEY === 'your_rapidapi_key_here',
      LEAGUE_ID,
      SEASON,
    },
  }

  if (!API_KEY || API_KEY === 'your_rapidapi_key_here') {
    diagnosis.verdict = '❌ RAPIDAPI_KEY belum di-set atau masih placeholder. Inilah penyebab data dummy.'
    return NextResponse.json(diagnosis, { status: 200 })
  }

  // Test 1: Apakah key valid? (cek status akun)
  try {
    const statusRes = await fetch('https://api-football-v1.p.rapidapi.com/v3/status', {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    })
    const statusData = await statusRes.json()
    diagnosis.account_status = {
      http: statusRes.status,
      response: statusData.response || statusData.errors || statusData,
    }
  } catch (e) {
    diagnosis.account_status = { error: String(e) }
  }

  // Test 2: Cari League World Cup — list semua season yang tersedia
  try {
    const lgRes = await fetch(`https://api-football-v1.p.rapidapi.com/v3/leagues?id=${LEAGUE_ID}`, {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    })
    const lgData = await lgRes.json()
    const league = lgData.response?.[0]
    diagnosis.league_check = {
      http: lgRes.status,
      league_name: league?.league?.name || 'TIDAK DITEMUKAN',
      available_seasons: league?.seasons?.map((s: { year: number }) => s.year) || [],
      errors: lgData.errors,
    }
  } catch (e) {
    diagnosis.league_check = { error: String(e) }
  }

  // Test 3: Fixtures untuk season yang di-set
  try {
    const fxRes = await fetch(
      `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${LEAGUE_ID}&season=${SEASON}`,
      {
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        },
      }
    )
    const fxData = await fxRes.json()
    diagnosis.fixtures_check = {
      http: fxRes.status,
      results_count: fxData.results ?? 0,
      errors: fxData.errors,
      sample: fxData.response?.[0]
        ? {
            home: fxData.response[0].teams?.home?.name,
            away: fxData.response[0].teams?.away?.name,
            date: fxData.response[0].fixture?.date,
          }
        : 'KOSONG — inilah kenapa jatuh ke mock data',
    }
  } catch (e) {
    diagnosis.fixtures_check = { error: String(e) }
  }

  // Verdict
  const fixCount = (diagnosis.fixtures_check as { results_count?: number })?.results_count ?? 0
  const seasons = (diagnosis.league_check as { available_seasons?: number[] })?.available_seasons ?? []
  if (fixCount > 0) {
    diagnosis.verdict = '✅ API mengembalikan data! Kalau masih dummy, kemungkinan cache — tunggu/redeploy.'
  } else if (seasons.length > 0) {
    diagnosis.verdict = `⚠️ Season ${SEASON} kosong. Season yang TERSEDIA: ${seasons.join(', ')}. Ganti NEXT_PUBLIC_WC_SEASON ke salah satunya.`
  } else {
    diagnosis.verdict = '⚠️ Tidak ada data. Cek apakah akun RapidAPI sudah subscribe API-Football, atau quota habis.'
  }

  return NextResponse.json(diagnosis, { status: 200 })
}
