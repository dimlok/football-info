import type { FootballDataMatch } from '@/services/football_data/football_data.types'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

type FixturesTabProps = {
	matches: FootballDataMatch[]
	isLoading: boolean
}

function FixturesTab({ matches, isLoading }: FixturesTabProps) {
	const { t, i18n } = useTranslation()
	const upcomingMatches = matches.filter(m => m.status !== 'FINISHED')

	return (
		<div>
			<h2 className='mb-6 text-xl font-bold text-gray-900 dark:text-white'>
				{t('matches.fixtures_title')}
			</h2>
			{isLoading && (
				<div className='text-center text-gray-600 dark:text-zinc-400'>
					{t('matches.loading')}
				</div>
			)}
			{upcomingMatches.length > 0 && (
				<div className='space-y-4'>
					{upcomingMatches.map(match => (
						<div
							key={match.id}
							className='flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900'
						>
							<div className='flex-1 text-left'>
								<div className='text-sm font-medium text-gray-900 dark:text-white'>
									{match.homeTeam.name}
								</div>
							</div>
							<div className='px-4 text-sm text-gray-600 dark:text-zinc-400'>
								{new Date(match.utcDate).toLocaleDateString(i18n.language, {
									day: '2-digit',
									month: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
								})}
							</div>
							<div className='flex-1 text-right'>
								<div className='text-sm font-medium text-gray-900 dark:text-white'>
									{match.awayTeam.name}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
			{!isLoading && upcomingMatches.length === 0 && (
				<p className='text-center text-gray-600 dark:text-zinc-400'>
					{t('matches.no_upcoming_matches')}
				</p>
			)}
		</div>
	)
}

export default memo(FixturesTab)

