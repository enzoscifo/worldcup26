/**
 * lib/api-football.ts
 * Wrapper untuk API-Football (RapidAPI).
 * Jika RAPIDAPI_KEY belum di-set, otomatis pakai MOCK DATA
 * sehingga UI bisa langsung berjalan tanpa API key.
 */

import { Match, Standing, TopScorer, TeamStats, MatchEvent } from '@/types'

const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3'
const LEAGUE_ID = parseInt(process.env.NEXT_PUBLIC_WC_LEAGUE_ID || '1')
const SEASON = parseInt(process.env.NEXT_PUBLIC_WC_SEASON || '2026')
const API_KEY = process.env.RAPIDAPI_KEY || ''
const USE_MOCK = !API_KEY || API_KEY === 'your_rapidapi_key_here'

// ──────────────────────────────────────────────
// HTTP helper
// ──────────────────────────────────────────────
async function fetchAPI<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    },
    next: { revalidate: 30 },
  })

  if (!res.ok) throw new Error(`API error ${res.status}: ${endpoint}`)
  const data = await res.json()
  return data.response as T
}

// ──────────────────────────────────────────────
// MOCK DATA (used when no API key)
// ──────────────────────────────────────────────
function mockMatches(): Match[] {
  const base = Date.now()
  return [
    makeMock(1, 'Brasil', '🇧🇷', 'Meksiko', '🇲🇽', 3, 1, 'FT', null, base - 7200000, 'Fase Grup - Grup A', 'Rose Bowl, Los Angeles'),
    makeMock(2, 'Perancis', '🇫🇷', 'Maroko', '🇲🇦', 3, 1, 'FT', null, base - 14400000, 'Fase Grup - Grup C', 'SoFi Stadium, Inglewood'),
    makeMock(3, 'Spanyol', '🇪🇸', 'Jepang', '🇯🇵', 1, 1, '2H', 76, base - 3600000, 'Fase Grup - Grup D', 'AT&T Stadium, Dallas'),
    makeMock(4, 'Argentina', '🇦🇷', 'Australia', '🇦🇺', 2, 0, '2H', 68, base - 2400000, 'Fase Grup - Grup B', "Levi's Stadium, Santa Clara"),
    makeMock(5, 'Inggris', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Senegal', '🇸🇳', 0, 0, 'NS', null, base + 3600000, 'Fase Grup - Grup E', 'MetLife Stadium, New Jersey'),
    makeMock(6, 'Portugal', '🇵🇹', 'Jerman', '🇩🇪', 0, 0, 'NS', null, base + 10800000, 'Fase Grup - Grup F', 'Estadio Azteca, Meksiko'),
    makeMock(7, 'Italia', '🇮🇹', 'Uruguay', '🇺🇾', 0, 0, 'NS', null, base + 18000000, 'Fase Grup - Grup G', 'Gillette Stadium, Boston'),
    makeMock(8, 'Belanda', '🇳🇱', 'Kroasia', '🇭🇷', 0, 0, 'NS', null, base + 25200000, 'Fase Grup - Grup H', 'Arrowhead Stadium, Kansas City'),
  ]
}

function makeMock(
  id: number, homeName: string, homeFlag: string,
  awayName: string, awayFlag: string,
  homeGoals: number, awayGoals: number,
  statusShort: string, elapsed: number | null,
  timestamp: number, round: string, venue: string
): Match {
  const [venueName, venueCity] = venue.split(', ')
  return {
    fixture: {
      id,
      referee: 'Pierluigi Collina',
      timezone: 'Asia/Jakarta',
      date: new Date(timestamp).toISOString(),
      timestamp: Math.floor(timestamp / 1000),
      status: { long: statusShort === 'FT' ? 'Match Finished' : statusShort === 'NS' ? 'Not Started' : 'Second Half', short: statusShort, elapsed },
      venue: { id: id * 10, name: venueName, city: venueCity || 'USA' },
    },
    league: {
      id: LEAGUE_ID, name: 'FIFA World Cup', country: 'World',
      logo: '/wc-logo.png', flag: '/world-flag.png',
      season: SEASON, round,
    },
    teams: {
      home: { id: id * 100, name: homeName, logo: homeFlag, code: homeName.slice(0, 3).toUpperCase() },
      away: { id: id * 100 + 1, name: awayName, logo: awayFlag, code: awayName.slice(0, 3).toUpperCase() },
    },
    goals: {
      home: statusShort === 'NS' ? null : homeGoals,
      away: statusShort === 'NS' ? null : awayGoals,
    },
    score: {
      halftime: { home: statusShort === 'NS' ? null : Math.floor(homeGoals / 2), away: statusShort === 'NS' ? null : Math.floor(awayGoals / 2) },
      fulltime: { home: statusShort === 'FT' ? homeGoals : null, away: statusShort === 'FT' ? awayGoals : null },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null },
    },
  }
}

function mockStandings(): Standing[][] {
  const makeRow = (rank: number, name: string, pts: number, played: number, win: number, draw: number, lose: number, gf: number, ga: number, form: string, group: string): Standing => ({
    rank, team: { id: rank * 10, name, logo: '' }, points: pts, goalsDiff: gf - ga,
    group, form, status: rank <= 2 ? 'Qualified' : 'Eliminated', description: rank <= 2 ? 'Lolos ke 32 Besar' : '',
    all: { played, win, draw, lose, goals: { for: gf, against: ga } },
    home: { played: Math.ceil(played / 2), win: Math.ceil(win / 2), draw: Math.ceil(draw / 2), lose: Math.ceil(lose / 2), goals: { for: Math.ceil(gf / 2), against: Math.ceil(ga / 2) } },
    away: { played: Math.floor(played / 2), win: Math.floor(win / 2), draw: Math.floor(draw / 2), lose: Math.floor(lose / 2), goals: { for: Math.floor(gf / 2), against: Math.floor(ga / 2) } },
  })

  return [
    [makeRow(1, 'Brasil', 9, 3, 3, 0, 0, 7, 2, 'WWW', 'Grup A'), makeRow(2, 'Meksiko', 4, 3, 1, 1, 1, 4, 4, 'WDL', 'Grup A'), makeRow(3, 'Kanada', 3, 3, 1, 0, 2, 3, 5, 'WLL', 'Grup A'), makeRow(4, 'Kosta Rika', 1, 3, 0, 1, 2, 2, 5, 'LDL', 'Grup A')],
    [makeRow(1, 'Argentina', 7, 3, 2, 1, 0, 5, 1, 'WWD', 'Grup B'), makeRow(2, 'Australia', 4, 3, 1, 1, 1, 3, 4, 'LWD', 'Grup B'), makeRow(3, 'Nigeria', 3, 3, 1, 0, 2, 3, 4, 'WLL', 'Grup B'), makeRow(4, 'Ekuador', 1, 3, 0, 1, 2, 2, 4, 'DLL', 'Grup B')],
    [makeRow(1, 'Perancis', 7, 3, 2, 1, 0, 6, 2, 'DWW', 'Grup C'), makeRow(2, 'Maroko', 4, 3, 1, 1, 1, 4, 5, 'WDL', 'Grup C'), makeRow(3, 'Denmark', 3, 3, 1, 0, 2, 3, 5, 'LWL', 'Grup C'), makeRow(4, 'Tunisia', 1, 3, 0, 1, 2, 1, 2, 'DLL', 'Grup C')],
    [makeRow(1, 'Spanyol', 4, 2, 1, 1, 0, 4, 1, 'WD', 'Grup D'), makeRow(2, 'Jepang', 4, 2, 1, 1, 0, 3, 2, 'WD', 'Grup D'), makeRow(3, 'Tunisia', 1, 2, 0, 1, 1, 2, 4, 'DL', 'Grup D'), makeRow(4, 'Ukraina', 1, 2, 0, 1, 1, 1, 3, 'LD', 'Grup D')],
  ]
}

function mockScorers(): TopScorer[] {
  return [
    { player: { id: 1, name: 'C. Ronaldo', photo: '', nationality: 'Portugal' }, statistics: [{ goals: { total: 5, assists: 2 }, games: { appearences: 3 } }], team: { id: 1, name: 'Portugal', logo: '🇵🇹' } },
    { player: { id: 2, name: 'K. Mbappé', photo: '', nationality: 'Perancis' }, statistics: [{ goals: { total: 4, assists: 3 }, games: { appearences: 3 } }], team: { id: 2, name: 'Perancis', logo: '🇫🇷' } },
    { player: { id: 3, name: 'L. Messi', photo: '', nationality: 'Argentina' }, statistics: [{ goals: { total: 4, assists: 2 }, games: { appearences: 3 } }], team: { id: 3, name: 'Argentina', logo: '🇦🇷' } },
    { player: { id: 4, name: 'Vinicius Jr.', photo: '', nationality: 'Brasil' }, statistics: [{ goals: { total: 3, assists: 4 }, games: { appearences: 3 } }], team: { id: 4, name: 'Brasil', logo: '🇧🇷' } },
    { player: { id: 5, name: 'H. Kane', photo: '', nationality: 'Inggris' }, statistics: [{ goals: { total: 3, assists: 1 }, games: { appearences: 3 } }], team: { id: 5, name: 'Inggris', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' } },
    { player: { id: 6, name: 'Pedri', photo: '', nationality: 'Spanyol' }, statistics: [{ goals: { total: 2, assists: 3 }, games: { appearences: 2 } }], team: { id: 6, name: 'Spanyol', logo: '🇪🇸' } },
  ]
}

function mockEvents(fixtureId: number): MatchEvent[] {
  if (fixtureId === 3) return [
    { time: { elapsed: 23, extra: null }, team: { id: 300, name: 'Spanyol', logo: '🇪🇸' }, player: { id: 1, name: 'Morata' }, assist: { id: null, name: null }, type: 'Goal', detail: 'Normal Goal', comments: null },
    { time: { elapsed: 58, extra: null }, team: { id: 301, name: 'Jepang', logo: '🇯🇵' }, player: { id: 2, name: 'Minamino' }, assist: { id: null, name: null }, type: 'Goal', detail: 'Normal Goal', comments: null },
    { time: { elapsed: 67, extra: null }, team: { id: 300, name: 'Spanyol', logo: '🇪🇸' }, player: { id: 3, name: 'Carvajal' }, assist: { id: null, name: null }, type: 'Card', detail: 'Yellow Card', comments: null },
  ]
  return []
}

function mockTeamStats(fixtureId: number): TeamStats[] {
  if (fixtureId === 3) return [
    { team: { id: 300, name: 'Spanyol', logo: '🇪🇸' }, statistics: [{ type: 'Ball Possession', value: '65%' }, { type: 'Total Shots', value: 12 }, { type: 'Shots on Goal', value: 5 }, { type: 'Fouls', value: 8 }, { type: 'Corner Kicks', value: 6 }, { type: 'Offsides', value: 2 }, { type: 'Yellow Cards', value: 1 }, { type: 'Red Cards', value: 0 }, { type: 'Passes', value: 542 }, { type: 'Pass Accuracy', value: '89%' }] },
    { team: { id: 301, name: 'Jepang', logo: '🇯🇵' }, statistics: [{ type: 'Ball Possession', value: '35%' }, { type: 'Total Shots', value: 8 }, { type: 'Shots on Goal', value: 5 }, { type: 'Fouls', value: 12 }, { type: 'Corner Kicks', value: 3 }, { type: 'Offsides', value: 4 }, { type: 'Yellow Cards', value: 2 }, { type: 'Red Cards', value: 0 }, { type: 'Passes', value: 287 }, { type: 'Pass Accuracy', value: '76%' }] },
  ]
  return []
}

// ──────────────────────────────────────────────
// PUBLIC API FUNCTIONS
// ──────────────────────────────────────────────

export async function getFixturesByDate(date: string): Promise<Match[]> {
  if (USE_MOCK) return mockMatches().filter(m => {
    const d = new Date(m.fixture.date)
    return d.toISOString().slice(0, 10) === date
  })
  try {
    const data = await fetchAPI<Match[]>('fixtures', { league: String(LEAGUE_ID), season: String(SEASON), date })
    return data?.length ? data : mockMatches()
  } catch { return mockMatches() }
}

export async function getLiveFixtures(): Promise<Match[]> {
  if (USE_MOCK) return mockMatches().filter(m => ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(m.fixture.status.short))
  try {
    const data = await fetchAPI<Match[]>('fixtures', { league: String(LEAGUE_ID), season: String(SEASON), live: 'all' })
    return data ?? []
  } catch { return [] }
}

export async function getAllFixtures(): Promise<Match[]> {
  if (USE_MOCK) return mockMatches()
  try {
    const data = await fetchAPI<Match[]>('fixtures', { league: String(LEAGUE_ID), season: String(SEASON) })
    return data?.length ? data : mockMatches()
  } catch { return mockMatches() }
}

export async function getStandings(): Promise<Standing[][]> {
  if (USE_MOCK) return mockStandings()
  try {
    const raw = await fetchAPI<Array<{ league: { standings: Standing[][] } }>>('standings', {
      league: String(LEAGUE_ID), season: String(SEASON),
    })
    const data = raw[0]?.league?.standings
    return data?.length ? data : mockStandings()
  } catch { return mockStandings() }
}

export async function getTopScorers(): Promise<TopScorer[]> {
  if (USE_MOCK) return mockScorers()
  try {
    const data = await fetchAPI<TopScorer[]>('players/topscorers', { league: String(LEAGUE_ID), season: String(SEASON) })
    return data?.length ? data : mockScorers()
  } catch { return mockScorers() }
}

export async function getFixtureStats(fixtureId: number): Promise<TeamStats[]> {
  if (USE_MOCK) return mockTeamStats(fixtureId)
  try {
    const data = await fetchAPI<TeamStats[]>('fixtures/statistics', { fixture: String(fixtureId) })
    return data ?? []
  } catch { return [] }
}

export async function getFixtureEvents(fixtureId: number): Promise<MatchEvent[]> {
  if (USE_MOCK) return mockEvents(fixtureId)
  try {
    const data = await fetchAPI<MatchEvent[]>('fixtures/events', { fixture: String(fixtureId) })
    return data ?? []
  } catch { return [] }
}

export { USE_MOCK }
