import { queryClient } from '@/main'
import { getPlayerById, getPlayers } from './player.service'

/**
 * 🔒 Player Loader Functions
 * Diese Funktionen laufen im React Router Loader Context
 *
 * ✅ Direkter Service Call (kein Hook!)
 * ✅ Daten werden in TanStack Query Cache gespeichert
 * ✅ Component kann dann sofort aus Cache lesen
 */

/**
 * Lädt alle Players und cached sie
 */
export const loadPlayers = async () => {
	try {
		const data = await getPlayers()
		queryClient.setQueryData(['players'], data)
		return data
	} catch (error) {
		console.error('Failed to load players:', error)
		throw error
	}
}

/**
 * Lädt einen einzelnen Player und cached ihn
 */
export const loadPlayer = async (playerId: string) => {
	try {
		const data = await getPlayerById(playerId)
		queryClient.setQueryData(['player', playerId], data)
		return data
	} catch (error) {
		console.error(`Failed to load player ${playerId}:`, error)
		throw error
	}
}

/**
 * Lädt Player mit Validation
 */
export const loadPlayerWithValidation = async (playerId: string) => {
	if (!playerId) {
		throw new Error('Player ID required')
	}

	// Check Cache
	const cachedData = queryClient.getQueryData(['player', playerId])
	if (cachedData) {
		console.log(`✅ Player ${playerId} aus Cache`)
		return cachedData
	}

	// Sonst laden
	console.log(`📡 Player ${playerId} laden...`)
	return loadPlayer(playerId)
}

