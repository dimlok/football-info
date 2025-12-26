import type { Team } from '@/types/team.types'
import teamsData from './teams.json'

export const teams = teamsData as Team[]

export const getTeamById = (id: string): Team | undefined => {
	return teams.find(team => team.id === id)
}

export const getAllTeams = (): Team[] => {
	return teams
}

