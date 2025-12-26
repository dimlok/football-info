import LeagueCard from '@/components/league_card/league_card'
import type { FootballDataCompetition } from '@/services/football_data/football_data.types'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

type TopLeaguesSectionProps = {
	leagues: FootballDataCompetition[]
	onLeagueClick: (leagueCode: string) => void
}

/**
 * Top Leagues Section Component
 * Zeigt die Top 5 Europäischen Ligen featured
 *
 * Memoized da diese Component sich selten ändert
 */
function TopLeaguesSection({ leagues, onLeagueClick }: TopLeaguesSectionProps) {
	const { t } = useTranslation()

	return (
		<div className='mb-8 sm:mb-12'>
			<div className='mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3'>
				<h2 className='whitespace-nowrap text-base font-bold text-gray-900 dark:text-white sm:text-xl md:text-2xl'>
					{t('leagues.section_top_leagues')}
				</h2>
				<div className='h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-zinc-800' />
			</div>

			<div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-6'>
				{leagues.map(league => (
					<LeagueCard
						key={league.id}
						competition={league}
						featured
						onClick={() => onLeagueClick(league.code)}
					/>
				))}
			</div>
		</div>
	)
}

export default memo(TopLeaguesSection)

