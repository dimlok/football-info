import { getCompetitionTeams, getTeam } from './football_data.service'
import type {
	FootballDataPerson,
	FootballDataPlayerWithTeam,
	FootballDataTeam,
	FootballDataTeamResponse,
} from './football_data.types'

/**
 * Hole alle Spieler einer Competition/Liga
 * @param competitionCode - z.B. 'PL', 'BL1', 'PD'
 * @returns Array von Spielern mit Team-Info
 */
export const getCompetitionPlayers = async (
	competitionCode: string
): Promise<FootballDataPlayerWithTeam[]> => {
	try {
		// 1. Hole alle Teams der Liga
		const teamsResponse = await getCompetitionTeams(competitionCode)
		const teams = teamsResponse.teams || []

		if (teams.length === 0) {
			return []
		}

		// 2. Hole Squad für jedes Team (parallel für Performance)
		// Aber: API Rate Limit beachten! (10 requests/minute im Free Tier)
		// Deshalb: Nur erste 5 Teams als Demo
		const teamPromises = teams
			.slice(0, 5)
			.map((team: FootballDataTeam) => getTeam(team.id))

		const teamDetails = await Promise.all(teamPromises)

		// 3. Alle Spieler aus allen Teams sammeln
		const allPlayers: FootballDataPlayerWithTeam[] = teamDetails.flatMap(
			(team: FootballDataTeamResponse) => {
				return (
					team.squad?.map((player: FootballDataPerson) => ({
						...player,
						teamName: team.name,
						teamCrest: team.crest,
						teamId: team.id,
					})) || []
				)
			}
		)

		return allPlayers
	} catch (error) {
		console.error('Error fetching competition players:', error)
		throw error
	}
}

/**
 * Hole Top-Spieler von mehreren Top-Ligen
 * @param competitionCodes - Array von Liga-Codes
 * @param playersPerLeague - Anzahl Spieler pro Liga
 */
export const getTopPlayers = async (
	competitionCodes: string[],
	playersPerLeague = 10
): Promise<FootballDataPlayerWithTeam[]> => {
	try {
		const allPlayers: FootballDataPlayerWithTeam[] = []

		for (const code of competitionCodes) {
			try {
				const teamsResponse = await getCompetitionTeams(code)
				const teams = teamsResponse.teams?.slice(0, 2) || [] // Nur 2 Teams pro Liga

				for (const team of teams) {
					const teamDetails = await getTeam(team.id)
					const players: FootballDataPlayerWithTeam[] =
						teamDetails.squad
							?.slice(0, Math.ceil(playersPerLeague / 2))
							.map(player => ({
								...player,
								teamName: teamDetails.name,
								teamCrest: teamDetails.crest,
								teamId: teamDetails.id,
								competitionCode: code,
							})) || []

					allPlayers.push(...players)
				}
			} catch (error) {
				console.warn(`Failed to fetch players for ${code}:`, error)
			}
		}

		return allPlayers
	} catch (error) {
		console.error('Error fetching top players:', error)
		throw error
	}
}

/**
 * Hole Squad eines spezifischen Teams
 * @param teamId - Team ID
 */
export const getTeamSquad = async (teamId: number) => {
	try {
		const team = await getTeam(teamId)
		return {
			team: {
				id: team.id,
				name: team.name,
				crest: team.crest,
				founded: team.founded,
				venue: team.venue,
			},
			squad:
				team.squad?.map(
					(player): FootballDataPlayerWithTeam => ({
						...player,
						teamName: team.name,
						teamCrest: team.crest,
						teamId: team.id,
					})
				) || [],
		}
	} catch (error) {
		console.error('Error fetching team squad:', error)
		throw error
	}
}

