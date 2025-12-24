/**
 * Football-Data.org API Types
 * Docs: https://www.football-data.org/documentation/quickstart
 */

export type FootballDataPerson = {
	id: number
	name: string
	firstName: string
	lastName: string
	dateOfBirth: string
	nationality: string
	position: string
	shirtNumber: number | null
	lastUpdated: string
}

export type FootballDataTeam = {
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

