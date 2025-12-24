import { useQuery } from '@tanstack/react-query'
import {
	getAllCompetitions,
	getCompetitionTeams,
	getPerson,
	getTeam,
	testConnection,
} from './football_data.service'

/**
 * Custom Hooks für Football-Data.org mit TanStack Query Caching
 *
 * Vorteile:
 * - Automatisches Caching (5 Minuten)
 * - Keine doppelten API-Anfragen
 * - Loading & Error States
 * - Automatisches Re-fetching
 */

/**
 * Hook: Hole Team mit Squad
 *
 * @example
 * const { data, isLoading, error } = useTeam(5) // Bayern München
 */
export const useTeam = (teamId: number) => {
	return useQuery({
		queryKey: ['team', teamId],
		queryFn: () => getTeam(teamId),
		enabled: !!teamId, // Nur fetchen wenn teamId vorhanden
	})
}

/**
 * Hook: Hole Person/Spieler Details
 *
 * @example
 * const { data: player } = usePerson(123456)
 */
export const usePerson = (personId: number) => {
	return useQuery({
		queryKey: ['person', personId],
		queryFn: () => getPerson(personId),
		enabled: !!personId,
	})
}

/**
 * Hook: Hole alle Teams einer Liga/Competition
 *
 * @example
 * const { data } = useCompetitionTeams('BL1') // Bundesliga
 * const { data } = useCompetitionTeams('PL')  // Premier League
 */
export const useCompetitionTeams = (competitionCode: string) => {
	return useQuery({
		queryKey: ['competition', competitionCode, 'teams'],
		queryFn: () => getCompetitionTeams(competitionCode),
		enabled: !!competitionCode,
		staleTime: 30 * 60 * 1000, // 30 Minuten - Teams ändern sich selten
	})
}

/**
 * Hook: Teste API Verbindung
 *
 * @example
 * const { data: isConnected } = useApiConnection()
 */
export const useApiConnection = () => {
	return useQuery({
		queryKey: ['api', 'connection'],
		queryFn: testConnection,
		staleTime: 60 * 1000, // 1 Minute
	})
}

/**
 * Hook: Hole mehrere Teams gleichzeitig
 *
 * @example
 * const teams = useMultipleTeams([5, 86, 81]) // Bayern, Real, Barca
 */
export const useMultipleTeams = (teamIds: number[]) => {
	return useQuery({
		queryKey: ['teams', 'multiple', teamIds.sort().join(',')],
		queryFn: async () => {
			// Fetche alle Teams parallel
			const results = await Promise.all(teamIds.map(id => getTeam(id)))
			return results
		},
		enabled: teamIds.length > 0,
	})
}

/**
 * Hook: Hole alle verfügbaren Competitions/Ligen
 *
 * @example
 * const { data: competitions } = useAllCompetitions()
 */
export const useAllCompetitions = () => {
	return useQuery({
		queryKey: ['competitions', 'all'],
		queryFn: getAllCompetitions,
		staleTime: 60 * 60 * 1000, // 1 Stunde - Competitions ändern sich selten
	})
}

