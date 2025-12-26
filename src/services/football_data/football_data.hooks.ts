import {
	getCompetitionPlayers,
	getTeamSquad,
	getTopPlayers,
} from '@/services/football_data/football_data_players.service'
import { useQuery } from '@tanstack/react-query'
import {
	getAllCompetitions,
	getCompetitionMatches,
	getCompetitionStandings,
	getCompetitionTeams,
	getPerson,
	getTeam,
	testConnection,
} from './football_data.service'

/**
 * Custom Hooks für Football-Data.org mit TanStack Query Caching
 *
 * Vorteile:
 * - Automatisches Caching (bis Browser-Close, Infinity staleTime/gcTime)
 * - Keine doppelten API-Anfragen
 * - Loading & Error States
 * - Daten werden nur EINMAL geholt, dann immer aus dem Cache
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
		// staleTime: Infinity (from global config)
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
		// staleTime: Infinity (from global config)
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
		// staleTime: Infinity (from global config)
	})
}

/**
 * Hook: Hole Tabelle/Standings einer Competition
 *
 * @example
 * const { data: standings } = useCompetitionStandings('PL')
 */
export const useCompetitionStandings = (competitionCode: string) => {
	return useQuery({
		queryKey: ['competition', competitionCode, 'standings'],
		queryFn: () => getCompetitionStandings(competitionCode),
		enabled: !!competitionCode,
		// staleTime: Infinity (from global config)
	})
}

/**
 * Hook: Hole Matches/Spiele einer Competition
 *
 * @example
 * const { data: matches } = useCompetitionMatches('PL', '2024-12-25', '2024-12-25')
 * const { data: matches } = useCompetitionMatches('PL', '2024-12-25', '2024-12-25', { enabled: false })
 */
export const useCompetitionMatches = (
	competitionCode: string,
	dateFrom?: string,
	dateTo?: string,
	options?: { enabled?: boolean }
) => {
	return useQuery({
		queryKey: ['competition', competitionCode, 'matches', dateFrom, dateTo],
		queryFn: () => getCompetitionMatches(competitionCode, dateFrom, dateTo),
		enabled:
			options?.enabled !== undefined ? options.enabled : !!competitionCode,
		// staleTime: Infinity (from global config)
	})
}

/**
 * Hook: Hole alle Spieler einer Liga
 *
 * @example
 * const { data: players } = useCompetitionPlayers('PL') // Premier League Players
 */
export const useCompetitionPlayers = (competitionCode: string) => {
	return useQuery({
		queryKey: ['competition', competitionCode, 'players'],
		queryFn: () => getCompetitionPlayers(competitionCode),
		enabled: !!competitionCode,
		// staleTime: Infinity (from global config)
	})
}

/**
 * Hook: Hole Top-Spieler von mehreren Ligen
 *
 * @example
 * const { data: players } = useTopPlayers(['PL', 'BL1', 'PD'], 20)
 */
export const useTopPlayers = (
	competitionCodes: string[],
	playersPerLeague = 10
) => {
	return useQuery({
		queryKey: ['top-players', competitionCodes, playersPerLeague],
		queryFn: () => getTopPlayers(competitionCodes, playersPerLeague),
		enabled: competitionCodes.length > 0,
		// staleTime: Infinity (from global config)
	})
}

/**
 * Hook: Hole Squad eines Teams
 *
 * @example
 * const { data: squad } = useTeamSquad(5) // Bayern München Squad
 */
export const useTeamSquad = (teamId: number) => {
	return useQuery({
		queryKey: ['team', teamId, 'squad'],
		queryFn: () => getTeamSquad(teamId),
		enabled: !!teamId,
		// staleTime: Infinity (from global config)
	})
}

