import { queryClient } from '@/main'
import { getTeam } from './football_data.service'

/**
 * 🔒 Loader-spezifische API Calls
 * Diese Funktionen laufen im React Router Loader Context
 * (ähnlich wie Server-Side, aber client-side)
 *
 * ✅ Direkter API Call (kein Hook!)
 * ✅ Daten werden in TanStack Query Cache gespeichert
 * ✅ Component kann dann sofort aus Cache lesen
 */

/**
 * Lädt ein Team und cached es für die Component
 */
export const loadTeam = async (teamId: number) => {
	try {
		const data = await getTeam(teamId)
		queryClient.setQueryData(['team', teamId], data)
		return data
	} catch (error) {
		console.error(`Failed to load team ${teamId}:`, error)
		throw error
	}
}

/**
 * Lädt mehrere Teams parallel und cached sie
 */
export const loadMultipleTeams = async (teamIds: number[]) => {
	try {
		const teams = await Promise.all(teamIds.map(id => getTeam(id)))

		// Jeden Team separat cachen
		teams.forEach((team, index) => {
			queryClient.setQueryData(['team', teamIds[index]], team)
		})

		return teams
	} catch (error) {
		console.error('Failed to load multiple teams:', error)
		throw error
	}
}

/**
 * Beispiel für komplexere Loader-Logik
 */
export const loadTeamWithValidation = async (teamId: number) => {
	// Validation
	if (!teamId || teamId < 0) {
		throw new Error('Invalid team ID')
	}

	// Check Cache erst
	const cachedData = queryClient.getQueryData(['team', teamId])
	if (cachedData) {
		console.log(`✅ Team ${teamId} aus Cache geladen`)
		return cachedData
	}

	// Sonst laden
	console.log(`📡 Team ${teamId} von API laden...`)
	return loadTeam(teamId)
}

