import type { Team } from '@/types/team.types'
import teamsData from './teams.json'

export const teams: Team[] = teamsData as Team[]

export const getTeamById = (id: string): Team | undefined => {
	return teams.find(team => team.id === id)
}

export const getTeamsByCountry = (country: string): Team[] => {
	return teams.filter(team => team.country === country)
}

