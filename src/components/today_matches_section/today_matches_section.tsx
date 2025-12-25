import { useCompetitionMatches } from '@/services/football_data/football_data.hooks'
import type { FootballDataCompetition } from '@/services/football_data/football_data.types'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Match, MatchesResponse } from './today_matches_section.types'

type TodayMatchesSectionProps = {
	leagues: FootballDataCompetition[]
}

/**
 * Today Matches Section Component
 * Zeigt alle Spiele von heute aus den Top Ligen
 *
 * Accordion-Style: Ligen sind collapsed, API-Call nur bei Klick!
 * Verhindert zu viele API-Calls (5x gleichzeitig → nur on-demand)
 */
function TodayMatchesSection({ leagues }: TodayMatchesSectionProps) {
	const { t } = useTranslation()
	const [expandedLeagues, setExpandedLeagues] = useState<Set<number>>(new Set())

	// Heutiges Datum im Format YYYY-MM-DD
	const today = new Date().toISOString().split('T')[0]

	const toggleLeague = (leagueId: number) => {
		setExpandedLeagues(prev => {
			const newSet = new Set(prev)
			if (newSet.has(leagueId)) {
				newSet.delete(leagueId)
			} else {
				newSet.add(leagueId)
			}
			return newSet
		})
	}

	return (
		<div className='mb-8 sm:mb-12'>
			<div className='mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3'>
				<h2 className='whitespace-nowrap text-base font-bold text-gray-900 dark:text-white sm:text-xl md:text-2xl'>
					🗓️ {t('matches.today_title')} ({today})
				</h2>
				<div className='h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-zinc-800' />
			</div>

			<div className='space-y-3 sm:space-y-4'>
				{leagues.map(league => (
					<LeagueMatchesAccordion
						key={league.id}
						league={league}
						dateFrom={today}
						dateTo={today}
						isExpanded={expandedLeagues.has(league.id)}
						onToggle={() => toggleLeague(league.id)}
					/>
				))}
			</div>
		</div>
	)
}

export default memo(TodayMatchesSection)

/**
 * League Matches Accordion Component
 * Collapsed by default - API Call nur wenn expanded!
 */
type LeagueMatchesAccordionProps = {
	league: FootballDataCompetition
	dateFrom: string
	dateTo: string
	isExpanded: boolean
	onToggle: () => void
}

function LeagueMatchesAccordion({
	league,
	dateFrom,
	dateTo,
	isExpanded,
	onToggle,
}: LeagueMatchesAccordionProps) {
	const { t } = useTranslation()

	// API Call nur wenn expanded! Spart API Limit
	const { data, isLoading, error } = useCompetitionMatches(
		league.code,
		dateFrom,
		dateTo,
		{ enabled: isExpanded }
	)

	const matches = (data as MatchesResponse | undefined)?.matches || []
	const hasMatches = matches.length > 0

	return (
		<div className='rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/50'>
			{/* League Header - Clickable */}
			<button
				onClick={onToggle}
				className='w-full flex items-center justify-between gap-3 p-4 sm:p-6 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/30 text-left'
			>
				<div className='flex items-center gap-3'>
					{league.emblem && (
						<img
							src={league.emblem}
							alt={league.name}
							className='h-8 w-8 object-contain sm:h-10 sm:w-10'
							onError={e => {
								e.currentTarget.style.display = 'none'
							}}
						/>
					)}
					<div>
						<h3 className='text-sm font-bold text-gray-900 dark:text-white sm:text-lg'>
							{league.name}
						</h3>
						<p className='text-xs text-gray-600 dark:text-zinc-500 sm:text-sm'>
							{league.area.name}
						</p>
					</div>
				</div>

				{/* Arrow Icon */}
				<div
					className={`text-gray-500 dark:text-zinc-400 transition-transform ${
						isExpanded ? 'rotate-180' : ''
					}`}
				>
					<svg
						className='h-5 w-5 sm:h-6 sm:w-6'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M19 9l-7 7-7-7'
						/>
					</svg>
				</div>
			</button>

			{/* Expanded Content */}
			{isExpanded && (
				<div className='border-t border-gray-200 p-4 sm:p-6 dark:border-zinc-800'>
					{/* Loading */}
					{isLoading && (
						<div className='py-8 text-center text-sm text-gray-600 dark:text-zinc-400'>
							{t('matches.loading')}
						</div>
					)}

					{/* Error */}
					{error && (
						<div className='rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-center text-sm text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400'>
							{t('matches.error')}
						</div>
					)}

					{/* No Matches */}
					{!isLoading && !error && !hasMatches && (
						<div className='py-6 text-center text-sm text-gray-500 dark:text-zinc-500'>
							⚽ {t('matches.no_matches')}
						</div>
					)}

					{/* Matches Table */}
					{!isLoading && !error && hasMatches && (
						<div className='overflow-x-auto'>
							<table className='w-full text-sm'>
								<thead>
									<tr className='border-b border-gray-200 text-left text-xs text-gray-600 dark:border-zinc-800 dark:text-zinc-500'>
										<th className='pb-2 pr-2 font-semibold sm:pr-4'>
											{t('matches.table.time')}
										</th>
										<th className='pb-2 pr-2 font-semibold sm:pr-4'>
											{t('matches.table.home_team')}
										</th>
										<th className='pb-2 px-2 text-center font-semibold'>
											{t('matches.table.result')}
										</th>
										<th className='pb-2 pl-2 font-semibold sm:pl-4'>
											{t('matches.table.away_team')}
										</th>
										<th className='pb-2 pl-2 text-center font-semibold sm:pl-4'>
											{t('matches.table.status')}
										</th>
									</tr>
								</thead>
								<tbody>
									{matches.map(match => (
										<MatchRow key={match.id} match={match} />
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

/**
 * Match Row Component
 * Zeigt eine einzelne Match-Zeile
 */
type MatchRowProps = {
	match: Match
}

function MatchRow({ match }: MatchRowProps) {
	const { t } = useTranslation()

	// Zeit formatieren (z.B. "15:30")
	const matchTime = new Date(match.utcDate).toLocaleTimeString('de-DE', {
		hour: '2-digit',
		minute: '2-digit',
	})

	// Status Text
	const getStatusText = (status: string) => {
		switch (status) {
			case 'SCHEDULED':
			case 'TIMED':
				return t('matches.status.scheduled')
			case 'IN_PLAY':
				return `⚽ ${t('matches.status.live')}`
			case 'PAUSED':
				return t('matches.status.paused')
			case 'FINISHED':
				return t('matches.status.finished')
			case 'POSTPONED':
				return t('matches.status.postponed')
			case 'CANCELLED':
				return t('matches.status.cancelled')
			default:
				return status
		}
	}

	// Status Farbe
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'IN_PLAY':
				return 'text-green-600 dark:text-green-400 font-semibold'
			case 'PAUSED':
				return 'text-yellow-600 dark:text-yellow-400'
			case 'FINISHED':
				return 'text-gray-500 dark:text-zinc-500'
			case 'POSTPONED':
			case 'CANCELLED':
				return 'text-red-600 dark:text-red-400'
			default:
				return 'text-gray-500 dark:text-zinc-400'
		}
	}

	const homeScore = match.score.fullTime.home
	const awayScore = match.score.fullTime.away

	return (
		<tr className='border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30'>
			{/* Zeit */}
			<td className='py-3 pr-2 text-xs text-gray-500 dark:text-zinc-400 sm:pr-4 sm:text-sm'>
				{matchTime}
			</td>

			{/* Heimteam */}
			<td className='py-3 pr-2 sm:pr-4'>
				<div className='flex items-center gap-2'>
					<img
						src={match.homeTeam.crest}
						alt={match.homeTeam.name}
						className='h-5 w-5 object-contain sm:h-6 sm:w-6'
						onError={e => {
							e.currentTarget.style.display = 'none'
						}}
					/>
					<span className='truncate text-xs font-medium text-gray-900 dark:text-white sm:text-sm'>
						{match.homeTeam.shortName || match.homeTeam.name}
					</span>
				</div>
			</td>

			{/* Ergebnis */}
			<td className='py-3 px-2 text-center'>
				{homeScore !== null && awayScore !== null ? (
					<span className='text-sm font-bold text-gray-900 dark:text-white sm:text-base'>
						{homeScore} : {awayScore}
					</span>
				) : (
					<span className='text-xs text-gray-400 dark:text-zinc-600 sm:text-sm'>
						-:-
					</span>
				)}
			</td>

			{/* Auswärtsteam */}
			<td className='py-3 pl-2 sm:pl-4'>
				<div className='flex items-center gap-2'>
					<img
						src={match.awayTeam.crest}
						alt={match.awayTeam.name}
						className='h-5 w-5 object-contain sm:h-6 sm:w-6'
						onError={e => {
							e.currentTarget.style.display = 'none'
						}}
					/>
					<span className='truncate text-xs font-medium text-gray-900 dark:text-white sm:text-sm'>
						{match.awayTeam.shortName || match.awayTeam.name}
					</span>
				</div>
			</td>

			{/* Status */}
			<td
				className={`py-3 pl-2 text-center text-xs sm:pl-4 sm:text-sm ${getStatusColor(
					match.status
				)}`}
			>
				{getStatusText(match.status)}
			</td>
		</tr>
	)
}

