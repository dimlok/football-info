import type { Player, Position } from '@/types/player.types'
import playersData from './players.json'

export const players: Player[] = playersData as Player[]

export const getPlayerById = (id: string): Player | undefined => {
	return players.find(player => player.id === id)
}

export const getPlayersByTeam = (teamId: string): Player[] => {
	return players.filter(player => player.teamId === teamId)
}

export const getPlayersByPosition = (position: Position): Player[] => {
	return players.filter(player => player.position === position)
}

export const getPlayersByNationality = (nationality: string): Player[] => {
	return players.filter(player => player.nationality === nationality)
}

export const getTopScorers = (limit = 10): Player[] => {
	return [...players]
		.sort((a, b) => b.stats.goals - a.stats.goals)
		.slice(0, limit)
}

export const getTopAssisters = (limit = 10): Player[] => {
	return [...players]
		.sort((a, b) => b.stats.assists - a.stats.assists)
		.slice(0, limit)
}

