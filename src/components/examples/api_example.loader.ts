import { loadTeam } from '@/services/football_data/football_data.loader.server'

/**
 * Loader für API Example Page
 * Nutzt .loader.server.ts für "server-seitige" Daten-Logik
 */
export const apiExampleLoader = async () => {
	try {
		// Bayern München über .loader.server laden
		// Daten werden automatisch in TanStack Query gecached!
		await loadTeam(5)

		// Optional: Mehrere Teams parallel laden
		// await loadMultipleTeams([5, 86, 81])

		return { success: true }
	} catch (error) {
		console.error('Loader Error:', error)
		return { success: false, error }
	}
}

