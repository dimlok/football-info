import LeagueCard from '@/components/league_card/league_card'
import type { FootballDataCompetition } from '@/services/football_data/football_data.types'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type LeaguesSectionProps = {
	leagues: FootballDataCompetition[]
	onLeagueClick?: (competition: FootballDataCompetition) => void
}

/**
 * Leagues Section Component
 * Zeigt alle Ligen mit "Show More" Funktionalität
 *
 * Eigener State für show more/less = Kein Re-Render der Parent Component!
 */
function LeaguesSection({ leagues, onLeagueClick }: LeaguesSectionProps) {
	const { t } = useTranslation()
	const [showAll, setShowAll] = useState(false)

	const INITIAL_COUNT = 4
	const displayedLeagues = showAll ? leagues : leagues.slice(0, INITIAL_COUNT)

	return (
		<div className='mb-8 sm:mb-12'>
			<div className='mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3'>
				<h2 className='whitespace-nowrap text-base font-bold text-gray-900 dark:text-white sm:text-xl md:text-2xl'>
					{t('leagues.section_all_leagues')}
				</h2>
				<div className='h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-zinc-800' />
			</div>

			<div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'>
				{displayedLeagues.map(league => (
					<LeagueCard
						key={league.id}
						competition={league}
						onClick={onLeagueClick ? () => onLeagueClick(league) : undefined}
					/>
				))}
			</div>

			{/* Show More Button */}
			{leagues.length > INITIAL_COUNT && (
				<div className='mt-6 flex justify-center'>
					<button
						onClick={() => setShowAll(!showAll)}
						className='group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-blue-600 dark:hover:bg-zinc-900 dark:hover:text-white'
					>
						<span>
							{showAll ? t('leagues.show_less') : t('leagues.show_more')}
						</span>
						<span
							className={`transition-transform ${showAll ? 'rotate-180' : ''}`}
						>
							↓
						</span>
					</button>
				</div>
			)}
		</div>
	)
}

export default memo(LeaguesSection)

