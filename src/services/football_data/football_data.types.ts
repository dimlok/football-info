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

