// ============================================================
// API-Football Types
// ============================================================

export interface Team {
  id: number
  name: string
  logo: string
  code?: string
}

export interface Goals {
  home: number | null
  away: number | null
}

export interface Score {
  halftime: Goals
  fulltime: Goals
  extratime: Goals
  penalty: Goals
}

export interface FixtureStatus {
  long: string
  short: string
  elapsed: number | null
}

export interface Fixture {
  id: number
  referee: string | null
  timezone: string
  date: string
  timestamp: number
  status: FixtureStatus
  venue: {
    id: number | null
    name: string
    city: string
  }
}

export interface League {
  id: number
  name: string
  country: string
  logo: string
  flag: string
  season: number
  round: string
}

export interface MatchTeams {
  home: Team
  away: Team
}

export interface Match {
  fixture: Fixture
  league: League
  teams: MatchTeams
  goals: Goals
  score: Score
}

// Standing types
export interface StandingTeamInfo {
  id: number
  name: string
  logo: string
}

export interface StandingStats {
  played: number
  win: number
  draw: number
  lose: number
  goals: {
    for: number
    against: number
  }
}

export interface Standing {
  rank: number
  team: StandingTeamInfo
  points: number
  goalsDiff: number
  group: string
  form: string
  status: string
  description: string
  all: StandingStats
  home: StandingStats
  away: StandingStats
}

export interface StandingGroup {
  group: string
  standings: Standing[]
}

// Fixture Statistics
export interface FixtureStat {
  type: string
  value: string | number | null
}

export interface TeamStats {
  team: Team
  statistics: FixtureStat[]
}

// Events
export interface MatchEvent {
  time: { elapsed: number; extra: number | null }
  team: Team
  player: { id: number; name: string }
  assist: { id: number | null; name: string | null }
  type: string
  detail: string
  comments: string | null
}

// Top Scorers
export interface PlayerStats {
  goals: { total: number | null; assists: number | null }
  games: { appearences: number | null }
}

export interface TopScorer {
  player: {
    id: number
    name: string
    photo: string
    nationality: string
  }
  statistics: PlayerStats[]
  team: Team
}

// Poll types (local state)
export interface PollOption {
  id: string
  label: string
  flag: string
  votes: number
}

export interface Poll {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
  endsAt: string
}

// Nobar venue
export interface NobarVenue {
  id: string
  name: string
  city: string // city slug e.g. 'yogyakarta'
  address: string
  type: 'outdoor' | 'cafe' | 'resto' | 'mall' | 'komunitas'
  icon: string
  tags: string[]
  isFree: boolean
  openTime: string
  mapsUrl: string
  phone?: string
}

// Venue submission (pending moderation)
export interface VenueSubmission {
  venueName: string
  city: string
  address: string
  type: string
  isFree: string
  openTime: string
  description: string
  submitterName: string
  submitterContact: string
}
