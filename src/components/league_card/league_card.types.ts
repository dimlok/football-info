import type { FootballDataCompetition } from '@/services/football_data/football_data.types'

export type LeagueCardProps = {
	competition: FootballDataCompetition
	featured?: boolean
	isCup?: boolean
	onClick?: () => void
}

