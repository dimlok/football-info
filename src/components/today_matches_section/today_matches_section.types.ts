export type Match = {
	id: number
	utcDate: string
	status: string
	matchday: number
	homeTeam: {
		id: number
		name: string
		shortName: string
		crest: string
	}
	awayTeam: {
		id: number
		name: string
		shortName: string
		crest: string
	}
	score: {
		fullTime: {
			home: number | null
			away: number | null
		}
		halfTime: {
			home: number | null
			away: number | null
		}
	}
}

export type MatchesResponse = {
	matches: Match[]
}

