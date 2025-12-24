export type Position = 'goalkeeper' | 'defender' | 'midfielder' | 'forward'

export type CardType = 'gold' | 'silver' | 'bronze' | 'special'

export type PlayerStats = {
	goals: number
	assists: number
	matches: number
	yellowCards: number
	redCards: number
}

export type FifaAttributes = {
	pace: number
	shooting: number
	passing: number
	dribbling: number
	defending: number
	physical: number
}

export type Player = {
	id: string
	name: string
	position: Position
	nationality: string
	age: number
	teamId: string
	photo: string
	number: number
	stats: PlayerStats
	// FIFA Card specific
	rating: number
	cardType: CardType
	attributes: FifaAttributes
	weakFoot: number
	skillMoves: number
}

