import { players as mockPlayers } from '@/mocks/players.mock'
import type { Player } from '@/types/player.types'

/**
 * Player Service
 *
 * Zentrale Stelle für alle Player-Daten.
 * Aktuell: Mock-Daten
 * Später: Einfach auf externe API umstellen!
 */

// TODO: Später hier die API Config hinzufügen
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// const API_KEY = import.meta.env.VITE_API_KEY

/**
 * Hole alle Spieler
 * Später: GET /api/players
 */
export const getAllPlayers = async (): Promise<Player[]> => {
	// Simuliere API delay
	await new Promise(resolve => setTimeout(resolve, 100))

	// TODO: Später ersetzen mit:
	// const response = await fetch(`${API_BASE_URL}/players`, {
	//   headers: { 'Authorization': `Bearer ${API_KEY}` }
	// })
	// return response.json()

	return mockPlayers
}

/**
 * Hole einen Spieler nach ID
 * Später: GET /api/players/:id
 */
export const getPlayerById = async (
	id: string
): Promise<Player | undefined> => {
	await new Promise(resolve => setTimeout(resolve, 50))

	// TODO: Später ersetzen mit:
	// const response = await fetch(`${API_BASE_URL}/players/${id}`)
	// return response.json()

	return mockPlayers.find(player => player.id === id)
}

/**
 * Suche Spieler nach Name
 * Später: GET /api/players/search?q=name
 */
export const searchPlayers = async (query: string): Promise<Player[]> => {
	await new Promise(resolve => setTimeout(resolve, 100))

	// TODO: Später ersetzen mit:
	// const response = await fetch(`${API_BASE_URL}/players/search?q=${query}`)
	// return response.json()

	return mockPlayers.filter(player =>
		player.name.toLowerCase().includes(query.toLowerCase())
	)
}

/**
 * Hole Spieler nach Team
 * Später: GET /api/players?teamId=:id
 */
export const getPlayersByTeam = async (teamId: string): Promise<Player[]> => {
	await new Promise(resolve => setTimeout(resolve, 100))

	// TODO: Später ersetzen mit:
	// const response = await fetch(`${API_BASE_URL}/players?teamId=${teamId}`)
	// return response.json()

	return mockPlayers.filter(player => player.teamId === teamId)
}

/**
 * Hole Top-Spieler nach Rating
 */
export const getTopPlayers = async (limit = 10): Promise<Player[]> => {
	await new Promise(resolve => setTimeout(resolve, 100))

	return [...mockPlayers].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

