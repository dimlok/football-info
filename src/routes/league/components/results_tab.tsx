import MatchesShimmer from '@/routes/league/components/matches_shimmer'
import type { FootballDataMatch } from '@/services/football_data/football_data.types'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type ResultsTabProps = {
	matches: FootballDataMatch[]
	isLoading: boolean
}

const ResultsTab = ({ matches, isLoading }: ResultsTabProps) => {
	const { t, i18n } = useTranslation()

	// Group and sort matches by matchday (descending: 16, 15, 14...)
	const matchesByMatchday = useMemo(() => {
		const finishedMatches = matches.filter(m => m.status === 'FINISHED')
		const grouped = finishedMatches.reduce((acc, match) => {
			const matchday = match.matchday || 0
			if (!acc[matchday]) {
				acc[matchday] = []
			}
			acc[matchday].push(match)
			return acc
		}, {} as Record<number, FootballDataMatch[]>)

		// Sort matchday in descending order (16, 15, 14...)
		// Also sort matches within each matchday by date (newest first: 12/21 => 12/20)
		return Object.entries(grouped)
			.sort(([a], [b]) => Number(b) - Number(a))
			.map(([matchday, dayMatches]) => {
				const sortedMatches = [...dayMatches].sort(
					(a, b) =>
						new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
				)
				return [matchday, sortedMatches] as [string, FootballDataMatch[]]
			})
	}, [matches])

	// Format date based on current locale
	const formatDate = (utcDate: string) => {
		const date = new Date(utcDate)
		return date.toLocaleDateString(i18n.language, {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
	}

	// Get cards count for a team
	const getTeamCards = (match: FootballDataMatch, teamId: number | null) => {
		if (!match.bookings || match.bookings.length === 0) {
			return { yellowCards: 0, redCards: 0 }
		}

		const yellowCards = match.bookings.filter(
			b => b.team.id === teamId && b.card === 'YELLOW_CARD'
		).length
		const redCards = match.bookings.filter(
			b => b.team.id === teamId && b.card === 'RED_CARD'
		).length
		return { yellowCards, redCards }
	}

	return (
		<div>
			<h2 className='mb-6 text-xl font-bold text-gray-900 dark:text-white'>
				{t('matches.results_title')}
			</h2>
			{isLoading && <MatchesShimmer />}
			{matchesByMatchday.length > 0 && (
				<div className='space-y-8'>
					{matchesByMatchday.map(([matchday, dayMatches]) => (
						<div key={matchday}>
							{/* Matchday header */}
							<h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-zinc-300'>
								{t('matches.matchday', { number: matchday })}
							</h3>
							<div className='space-y-4'>
								{dayMatches.map(match => (
									<div
										key={match.id}
										className='flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900'
									>
										<div className='flex flex-1 items-center gap-2 text-left'>
											<div className='text-sm font-medium text-gray-900 dark:text-white'>
												{match.homeTeam.name}
											</div>
											<TeamCards
												cards={getTeamCards(match, match.homeTeam.id)}
											/>
										</div>
										<div className='flex flex-col items-center px-4'>
											<div className='text-lg font-bold text-gray-900 dark:text-white'>
												{match.score.fullTime.home} :{' '}
												{match.score.fullTime.away}
											</div>
											{/* Match date */}
											<div className='mt-1 text-xs text-gray-500 dark:text-zinc-500'>
												{formatDate(match.utcDate)}
											</div>
										</div>
										<div className='flex flex-1 items-center justify-end gap-2 text-right'>
											<TeamCards
												cards={getTeamCards(match, match.awayTeam.id)}
											/>
											<div className='text-sm font-medium text-gray-900 dark:text-white'>
												{match.awayTeam.name}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}

			{!isLoading && matchesByMatchday.length === 0 && (
				<p className='text-center text-gray-600 dark:text-zinc-400'>
					{t('matches.no_finished_matches')}
				</p>
			)}
		</div>
	)
}

// Component to display team cards (yellow/red)
const TeamCards = ({
	cards,
}: {
	cards: { yellowCards: number; redCards: number }
}) => {
	if (cards.yellowCards === 0 && cards.redCards === 0) {
		return null
	}

	return (
		<div className='flex items-center gap-1 text-xs'>
			{cards.yellowCards > 0 && (
				<span className='flex items-center gap-0.5'>
					<span>🟨</span>
					{cards.yellowCards > 1 && <span>{cards.yellowCards}</span>}
				</span>
			)}
			{cards.redCards > 0 && (
				<span className='flex items-center gap-0.5'>
					<span>🟥</span>
					{cards.redCards > 1 && <span>{cards.redCards}</span>}
				</span>
			)}
		</div>
	)
}

export default memo(ResultsTab)
ResultsTab.displayName = 'ResultsTab' as const

