import type { FootballDataCompetitionsResponse } from '@/services/football_data/football_data.types'
import competitionsData from './competitions.json'

/**
 * Mock Competitions Daten von Football-Data.org API
 * Quelle: Echte API Response vom 23.12.2024
 *
 * Enthält 13 Top Competitions:
 * - Premier League (England)
 * - Bundesliga (Germany)
 * - La Liga (Spain)
 * - Serie A (Italy)
 * - Ligue 1 (France)
 * - Champions League
 * - und mehr...
 */
export const competitions = competitionsData as FootballDataCompetitionsResponse

/**
 * Hole Competition nach Code
 */
export const getCompetitionByCode = (code: string) => {
	return competitions.competitions.find(c => c.code === code)
}

/**
 * Hole Competition nach ID
 */
export const getCompetitionById = (id: number) => {
	return competitions.competitions.find(c => c.id === id)
}

/**
 * Filtere Competitions nach Type
 */
export const getCompetitionsByType = (type: 'LEAGUE' | 'CUP') => {
	return competitions.competitions.filter(c => c.type === type)
}

/**
 * Filtere Competitions nach Area/Land
 */
export const getCompetitionsByArea = (areaCode: string) => {
	return competitions.competitions.filter(c => c.area.code === areaCode)
}

/**
 * Top 5 Europäische Ligen
 */
export const getTopEuropeanLeagues = () => {
	const codes = ['PL', 'BL1', 'PD', 'SA', 'FL1']
	return competitions.competitions.filter(c => codes.includes(c.code))
}

