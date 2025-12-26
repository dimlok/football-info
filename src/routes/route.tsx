import CupsSection from '@/components/cups_section/cups_section'
import LeaguesSection from '@/components/leagues_section/leagues_section'
import Navigation from '@/components/navigation/navigation'
import QuickLinks from '@/components/quick_links/quick_links'
import SettingsModal from '@/components/settings_modal/settings_modal'
import TodayMatchesSection from '@/components/today_matches_section/today_matches_section'
import TopLeaguesSection from '@/components/top_leagues_section/top_leagues_section'
import {
	getCompetitionsByType,
	getTopEuropeanLeagues,
} from '@/mocks/competitions.mock'
import { useAllCompetitions } from '@/services/football_data/football_data.hooks'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

/**
 * 🏆 Home Page mit Ligen-Übersicht
 * Zeigt alle verfügbaren Football Competitions
 *
 * Refactored: Components sind in separate Dateien ausgelagert
 * Jede Section hat eigenen State = Keine unnötigen Re-Renders!
 */
export default function HomePage() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { data, isLoading, error } = useAllCompetitions()

	// Fallback zu Mock Daten wenn API nicht verfügbar
	const allCompetitions = data?.competitions || getCompetitionsByType('LEAGUE')
	const leagues = allCompetitions.filter(c => c.type === 'LEAGUE')
	const cups = allCompetitions.filter(c => c.type === 'CUP')
	const topLeagues = getTopEuropeanLeagues()

	// Handler für Liga-Klick - navigiert zur Liga-Seite
	const handleLeagueClick = (leagueCode: string) => {
		navigate(`/league/${leagueCode}`)
	}

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950'>
				<div className='text-center'>
					<div className='mb-4 animate-pulse text-7xl'>⚽</div>
					<div className='text-xl text-gray-600 dark:text-zinc-300'>
						{t('leagues.loading')}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='relative min-h-screen overflow-x-hidden bg-gray-50 dark:bg-zinc-950'>
			{/* Background Pattern */}
			<div className='absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-40 dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] dark:opacity-100 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]' />

			{/* Content */}
			<div className='relative z-10'>
				{/* Navigation */}
				<Navigation competitionsCount={data?.count || 13} />

				{/* Main Content */}
				<div className='mx-auto w-full max-w-7xl px-3 py-8 sm:px-4 sm:py-12'>
					{/* Hero Section */}
					<div className='mb-8 text-center sm:mb-12'>
						<h1 className='mb-3 text-2xl font-black uppercase tracking-tight sm:mb-4 sm:text-4xl md:text-5xl lg:text-6xl'>
							<span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400'>
								{t('leagues.hero_title')}
							</span>
						</h1>
						<p className='mx-auto max-w-2xl text-sm text-gray-600 dark:text-zinc-400 sm:text-base md:text-lg'>
							{t('leagues.hero_subtitle')}
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className='mb-8 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-center dark:border-yellow-800 dark:bg-yellow-950/30'>
							<div className='text-yellow-700 dark:text-yellow-400'>
								{t('leagues.api_error')}
							</div>
						</div>
					)}

					{/* Top 5 European Leagues - Featured */}
					<TopLeaguesSection
						leagues={topLeagues}
						onLeagueClick={handleLeagueClick}
					/>

					{/* Today's Matches */}
					<TodayMatchesSection leagues={topLeagues} />

					{/* All Leagues */}
					<LeaguesSection leagues={leagues} onLeagueClick={handleLeagueClick} />

					{/* Cups & Tournaments */}
					<CupsSection cups={cups} />

					{/* Quick Links */}
					<QuickLinks />
				</div>
			</div>

			{/* League Drawer
			<LeagueDrawer
				competition={selectedCompetition}
				isOpen={isDrawerOpen}
				onClose={closeDrawer}
			/> */}

			{/* Settings Modal */}
			<SettingsModal />
		</div>
	)
}

