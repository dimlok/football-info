/**
 * Football-Data.org API Types
 * Docs: https://www.football-data.org/documentation/quickstart
 */

// Spieler wie er von der API kommt (in squad)
export type FootballDataPerson = {
	id: number
	name: string
	position: string
	dateOfBirth: string
	nationality: string
}

export type FootballDataTeam = {
	area?: FootballDataArea
	id: number
	name: string
	shortName: string
	tla: string
	crest: string
	address: string
	website: string
	founded: number
	clubColors: string
	venue: string
	runningCompetitions?: Array<{
		id: number
		name: string
		code: string
		type: string
		emblem: string
	}>
	coach?: {
		id: number
		firstName?: string
		lastName?: string
		name: string
		dateOfBirth: string
		nationality: string
		contract?: {
			start: string
			until: string
		}
	}
	staff?: unknown[]
	lastUpdated?: string
}

export type FootballDataSquad = {
	squad: FootballDataPerson[]
}

export type FootballDataArea = {
	id: number
	name: string
	code: string
	flag: string | null
}

export type FootballDataWinner = {
	id: number
	name: string
	shortName: string
	tla: string
	crest: string
	address: string
	website: string
	founded: number
	clubColors: string
	venue: string
	lastUpdated: string
}

export type FootballDataCurrentSeason = {
	id: number
	startDate: string
	endDate: string
	currentMatchday: number
	winner: FootballDataWinner | null
}

export type FootballDataCompetition = {
	id: number
	area: FootballDataArea
	name: string
	code: string
	type: 'LEAGUE' | 'CUP' | string
	emblem: string
	plan: 'TIER_ONE' | 'TIER_TWO' | 'TIER_THREE' | 'TIER_FOUR' | string
	currentSeason: FootballDataCurrentSeason
	numberOfAvailableSeasons: number
	lastUpdated: string
}

export type FootballDataCompetitionsResponse = {
	count: number
	filters: {
		client?: string
		[key: string]: unknown
	}
	competitions: FootballDataCompetition[]
}

export type FootballDataTeamResponse = FootballDataTeam & FootballDataSquad

export type FootballDataCompetitionTeamsResponse = {
	count: number
	competition: FootballDataCompetition
	season: {
		id: number
		startDate: string
		endDate: string
		currentMatchday: number
	}
	teams: FootballDataTeam[]
}

// Extended Player Type mit Team-Informationen
export type FootballDataPlayerWithTeam = FootballDataPerson & {
	teamName: string
	teamCrest: string
	teamId: number
	competitionCode?: string
}

// Standings Types
export type FootballDataSeason = {
	id: number
	startDate: string
	endDate: string
	currentMatchday: number
	winner: FootballDataWinner | null
	stages: string[]
}

export type FootballDataTableEntry = {
	position: number
	team: {
		id: number
		name: string
		shortName: string
		tla: string
		crest: string
	}
	playedGames: number
	form: string
	won: number
	draw: number
	lost: number
	points: number
	goalsFor: number
	goalsAgainst: number
	goalDifference: number
}

export type FootballDataStanding = {
	stage: string
	type: 'TOTAL' | 'HOME' | 'AWAY'
	group: string | null
	table: FootballDataTableEntry[]
}

export type FootballDataStandingsResponse = {
	filters: {
		season: string
	}
	area: FootballDataArea
	competition: FootballDataCompetition
	season: FootballDataSeason
	standings: FootballDataStanding[]
}

// Matches Types
export type FootballDataCoach = {
	id: number | null
	name: string | null
	nationality: string | null
}

export type FootballDataPlayer = {
	id: number
	name: string
	position: string
	shirtNumber: number | null
}

export type FootballDataMatchTeam = {
	id: number | null
	name: string | null
	shortName: string | null
	tla: string | null
	crest: string | null
	coach?: FootballDataCoach
	leagueRank?: number | null
	formation?: string | null
	lineup?: FootballDataPlayer[]
	bench?: FootballDataPlayer[]
}

export type FootballDataScore = {
	winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null
	duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT'
	fullTime: {
		home: number | null
		away: number | null
	}
	halfTime: {
		home: number | null
		away: number | null
	}
	extraTime?: {
		home: number | null
		away: number | null
	}
	penalties?: {
		home: number | null
		away: number | null
	}
}

export type FootballDataGoal = {
	minute: number
	injuryTime: number | null
	type: 'REGULAR' | 'OWN_GOAL' | 'PENALTY'
	team: {
		id: number
		name: string
	}
	scorer: {
		id: number
		name: string
	}
	assist: {
		id: number | null
		name: string | null
	} | null
	score: {
		home: number
		away: number
	}
}

export type FootballDataBooking = {
	minute: number
	team: {
		id: number
		name: string
	}
	player: {
		id: number
		name: string
	}
	card: 'YELLOW_CARD' | 'RED_CARD'
}

export type FootballDataSubstitution = {
	minute: number
	team: {
		id: number
		name: string
	}
	playerOut: {
		id: number
		name: string
	}
	playerIn: {
		id: number
		name: string
	}
}

export type FootballDataReferee = {
	id: number
	name: string
	type:
		| 'REFEREE'
		| 'ASSISTANT_REFEREE_N1'
		| 'ASSISTANT_REFEREE_N2'
		| 'FOURTH_OFFICIAL'
	nationality: string
}

export type FootballDataMatch = {
	area: FootballDataArea
	competition: FootballDataCompetition
	season: FootballDataSeason
	id: number
	utcDate: string
	status:
		| 'SCHEDULED'
		| 'TIMED'
		| 'IN_PLAY'
		| 'PAUSED'
		| 'FINISHED'
		| 'SUSPENDED'
		| 'POSTPONED'
		| 'CANCELLED'
		| 'AWARDED'
	minute: number | null
	injuryTime: number | null
	attendance: number | null
	venue: string | null
	matchday: number | null
	stage: string
	group: string | null
	lastUpdated: string
	homeTeam: FootballDataMatchTeam
	awayTeam: FootballDataMatchTeam
	score: FootballDataScore
	goals: FootballDataGoal[]
	penalties: FootballDataGoal[]
	bookings: FootballDataBooking[]
	substitutions: FootballDataSubstitution[]
	odds: {
		homeWin: number | null
		draw: number | null
		awayWin: number | null
	}
	referees: FootballDataReferee[]
}

export type FootballDataMatchesResponse = {
	filters: {
		dateFrom?: string
		dateTo?: string
		status?: string
		matchday?: number
		competitions?: string
		permission?: string
		limit?: number
	}
	resultSet: {
		count: number
		competitions: string
		first: string
		last: string
		played: number
		wins?: number
		draws?: number
		losses?: number
	}
	competition?: FootballDataCompetition
	matches: FootballDataMatch[]
}

