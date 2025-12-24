import LanguageSwitcher from '@/components/language_switcher/language_switcher'
import {
	getCompetitionsByType,
	getTopEuropeanLeagues,
} from '@/mocks/competitions.mock'
import { useAllCompetitions } from '@/services/football_data/football_data.hooks'
import type { FootballDataCompetition } from '@/services/football_data/football_data.types'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

/**
 * 🏆 Home Page mit Ligen-Übersicht
 * Zeigt alle verfügbaren Football Competitions
 */
export default function HomePage() {
	const { t } = useTranslation()
	const { data, isLoading, error } = useAllCompetitions()

	// Fallback zu Mock Daten wenn API nicht verfügbar
	const leagues = data?.competitions || getCompetitionsByType('LEAGUE')
	const cups = data?.competitions.filter(c => c.type === 'CUP') || []
	const topLeagues = getTopEuropeanLeagues()

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-zinc-950'>
				<div className='text-center'>
					<div className='mb-4 animate-pulse text-7xl'>⚽</div>
					<div className='text-xl text-zinc-300'>{t('leagues.loading')}</div>
				</div>
			</div>
		)
	}

	return (
		<div className='relative min-h-screen bg-zinc-950'>
			{/* Background Pattern */}
			<div className='absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]' />

			{/* Content */}
			<div className='relative z-10'>
				{/* Navigation */}
				<div className='border-b border-zinc-900 backdrop-blur-sm'>
					<div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4'>
						<div className='flex items-center gap-3'>
							<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 font-bold text-white shadow-lg shadow-blue-500/50'>
								⚽
							</div>
							<div>
								<div className='text-lg font-bold'>{t('leagues.title')}</div>
								<div className='text-xs text-zinc-500'>
									{t('leagues.competitions_count', {
										count: data?.count || 13,
									})}
								</div>
							</div>
						</div>
						<LanguageSwitcher />
					</div>
				</div>

				{/* Main Content */}
				<div className='mx-auto max-w-7xl px-4 py-12'>
					{/* Hero Section */}
					<div className='mb-12 text-center'>
						<h1 className='mb-4 text-5xl font-black uppercase tracking-tight sm:text-6xl'>
							<span className='bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
								{t('leagues.hero_title')}
							</span>
						</h1>
						<p className='mx-auto max-w-2xl text-lg text-zinc-400'>
							{t('leagues.hero_subtitle')}
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className='mb-8 rounded-2xl border border-yellow-800 bg-yellow-950/30 p-4 text-center'>
							<div className='text-yellow-400'>{t('leagues.api_error')}</div>
						</div>
					)}

					{/* Top 5 European Leagues - Featured */}
					<div className='mb-12'>
						<div className='mb-6 flex items-center gap-3'>
							<h2 className='text-2xl font-bold'>
								{t('leagues.section_top_leagues')}
							</h2>
							<div className='h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent' />
						</div>

						<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-5'>
							{topLeagues.map(league => (
								<LeagueCard key={league.id} competition={league} featured />
							))}
						</div>
					</div>

					{/* All Leagues */}
					<div className='mb-12'>
						<div className='mb-6 flex items-center gap-3'>
							<h2 className='text-2xl font-bold'>
								{t('leagues.section_all_leagues')}
							</h2>
							<div className='h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent' />
						</div>

						<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
							{leagues
								.filter(l => l.type === 'LEAGUE')
								.map(league => (
									<LeagueCard key={league.id} competition={league} />
								))}
						</div>
					</div>

					{/* Cups & Tournaments */}
					{cups.length > 0 && (
						<div className='mb-12'>
							<div className='mb-6 flex items-center gap-3'>
								<h2 className='text-2xl font-bold'>
									{t('leagues.section_cups')}
								</h2>
								<div className='h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent' />
							</div>

							<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
								{cups.map(cup => (
									<LeagueCard key={cup.id} competition={cup} isCup />
								))}
							</div>
						</div>
					)}

					{/* Quick Links */}
					<div className='mt-16 grid gap-4 sm:grid-cols-3'>
						<Link
							to='/players'
							className='group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-blue-600 hover:bg-zinc-900'
						>
							<div className='mb-2 text-4xl'>⚽</div>
							<div className='mb-1 font-bold'>
								{t('leagues.quick_links.players_title')}
							</div>
							<div className='text-sm text-zinc-500'>
								{t('leagues.quick_links.players_description')}
							</div>
						</Link>

						<Link
							to='/teams'
							className='group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-yellow-600 hover:bg-zinc-900'
						>
							<div className='mb-2 text-4xl'>🏆</div>
							<div className='mb-1 font-bold'>
								{t('leagues.quick_links.teams_title')}
							</div>
							<div className='text-sm text-zinc-500'>
								{t('leagues.quick_links.teams_description')}
							</div>
						</Link>

						<Link
							to='/api-test'
							className='group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-green-600 hover:bg-zinc-900'
						>
							<div className='mb-2 text-4xl'>🔌</div>
							<div className='mb-1 font-bold'>
								{t('leagues.quick_links.api_test_title')}
							</div>
							<div className='text-sm text-zinc-500'>
								{t('leagues.quick_links.api_test_description')}
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

/**
 * Season Info Component
 */
type SeasonInfoProps = {
	currentYear: number
	nextYear: number
	currentMatchday: number
}

function SeasonInfo({
	currentYear,
	nextYear,
	currentMatchday,
}: SeasonInfoProps) {
	const { t } = useTranslation()

	return (
		<div className='text-center text-xs text-zinc-500'>
			{t('leagues.season', { year: currentYear, nextYear })}
			{currentMatchday > 0 && (
				<> • {t('leagues.matchday', { matchday: currentMatchday })}</>
			)}
		</div>
	)
}

/**
 * League Card Component
 */
type LeagueCardProps = {
	competition: FootballDataCompetition
	featured?: boolean
	isCup?: boolean
}

function LeagueCard({ competition, featured, isCup }: LeagueCardProps) {
	const currentYear = new Date().getFullYear()
	const nextYear = currentYear + 1

	return (
		<div
			className={`group relative overflow-hidden rounded-2xl border transition-all ${
				featured
					? 'border-2 border-blue-800/50 bg-gradient-to-br from-blue-950/80 to-zinc-900 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-500/30'
					: isCup
					? 'border-purple-800/50 bg-gradient-to-br from-purple-950/50 to-zinc-900 hover:border-purple-600'
					: 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
			} p-6`}
		>
			{/* Hover Glow Effect */}
			<div
				className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-all group-hover:opacity-100 ${
					featured
						? 'from-blue-500/10 to-transparent'
						: isCup
						? 'from-purple-500/10 to-transparent'
						: 'from-zinc-700/10 to-transparent'
				}`}
			/>

			<div className='relative'>
				{/* League Logo */}
				<div className='mb-4 flex justify-center'>
					<img
						src={competition.emblem}
						alt={competition.name}
						className='h-16 w-16 object-contain transition-transform group-hover:scale-110'
						onError={e => {
							e.currentTarget.style.display = 'none'
						}}
					/>
				</div>

				{/* League Name */}
				<h3
					className={`mb-2 text-center font-bold transition-colors group-hover:text-white ${
						featured ? 'text-lg' : 'text-base'
					}`}
				>
					{competition.name}
				</h3>

				{/* Country Flag */}
				<div className='mb-3 flex items-center justify-center gap-2 text-sm text-zinc-400'>
					{competition.area.flag && (
						<img
							src={competition.area.flag}
							alt={competition.area.name}
							className='h-4 w-6 object-cover'
							onError={e => {
								e.currentTarget.style.display = 'none'
							}}
						/>
					)}
					<span>{competition.area.name}</span>
				</div>

				{/* Info */}
				<div className='space-y-2 text-sm'>
					{/* Type Badge */}
					<div className='flex justify-center'>
						<span
							className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
								competition.type === 'LEAGUE'
									? 'bg-blue-500/20 text-blue-400'
									: 'bg-purple-500/20 text-purple-400'
							}`}
						>
							{competition.type}
						</span>
					</div>

					{/* Current Season */}
					{competition.currentSeason && (
						<SeasonInfo
							currentYear={currentYear}
							nextYear={nextYear}
							currentMatchday={competition.currentSeason.currentMatchday}
						/>
					)}

					{/* Plan Badge (für Free/Paid Tier) */}
					{featured && (
						<div className='flex justify-center'>
							<span className='inline-block rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400'>
								{competition.plan.replace('TIER_', 'Tier ')}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

