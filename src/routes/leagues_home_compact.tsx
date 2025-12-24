import LanguageSwitcher from '@/components/language_switcher/language_switcher'
import { useAllCompetitions } from '@/services/football_data/football_data.hooks'
import type { FootballDataCompetition } from '@/services/football_data/football_data.types'
import { Link } from 'react-router-dom'

/**
 * 🏆 Kompakte Ligen-Übersicht als Home Page
 * Gruppiert nach Ländern für bessere Übersicht
 */
export default function LeaguesHomeCompact() {
	const { data, isLoading } = useAllCompetitions()

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-zinc-950'>
				<div className='text-center'>
					<div className='mb-4 animate-pulse text-7xl'>⚽</div>
					<div className='text-xl text-zinc-300'>Loading...</div>
				</div>
			</div>
		)
	}

	// Gruppiere nach Area (Land)
	const grouped = data?.competitions.reduce((acc, comp) => {
		const area = comp.area.name
		if (!acc[area]) {
			acc[area] = []
		}
		acc[area].push(comp)
		return acc
	}, {} as Record<string, FootballDataCompetition[]>)

	return (
		<div className='min-h-screen bg-zinc-950'>
			{/* Compact Header */}
			<div className='border-b border-zinc-900 bg-zinc-900/50 backdrop-blur-sm'>
				<div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3'>
					<div className='flex items-center gap-3'>
						<span className='text-2xl'>⚽</span>
						<div>
							<div className='font-bold'>Football Leagues</div>
							<div className='text-xs text-zinc-500'>
								{data?.count} Competitions
							</div>
						</div>
					</div>
					<LanguageSwitcher />
				</div>
			</div>

			{/* Content */}
			<div className='mx-auto max-w-7xl px-4 py-8'>
				{/* Quick Navigation */}
				<div className='mb-8 flex flex-wrap gap-2'>
					<Link
						to='/players'
						className='rounded-lg bg-zinc-800 px-4 py-2 text-sm transition-colors hover:bg-zinc-700'
					>
						⚽ Players
					</Link>
					<Link
						to='/teams'
						className='rounded-lg bg-zinc-800 px-4 py-2 text-sm transition-colors hover:bg-zinc-700'
					>
						🏆 Teams
					</Link>
					<Link
						to='/api-test'
						className='rounded-lg bg-zinc-800 px-4 py-2 text-sm transition-colors hover:bg-zinc-700'
					>
						🔌 API
					</Link>
				</div>

				{/* Leagues by Country */}
				<div className='space-y-8'>
					{Object.entries(grouped || {}).map(([area, competitions]) => (
						<div key={area}>
							{/* Country Header */}
							<div className='mb-4 flex items-center gap-3'>
								{competitions[0].area.flag && (
									<img
										src={competitions[0].area.flag}
										alt={area}
										className='h-6 w-8 object-cover'
										onError={e => {
											e.currentTarget.style.display = 'none'
										}}
									/>
								)}
								<h2 className='text-xl font-bold'>{area}</h2>
								<div className='h-px flex-1 bg-zinc-800' />
								<span className='text-sm text-zinc-500'>
									{competitions.length}
								</span>
							</div>

							{/* Competitions List */}
							<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
								{competitions.map(comp => (
									<CompactLeagueCard key={comp.id} competition={comp} />
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

/**
 * Compact League Card
 */
function CompactLeagueCard({
	competition,
}: {
	competition: FootballDataCompetition
}) {
	return (
		<div className='group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900'>
			{/* Logo */}
			<img
				src={competition.emblem}
				alt={competition.name}
				className='h-12 w-12 flex-shrink-0 object-contain'
				onError={e => {
					e.currentTarget.style.display = 'none'
				}}
			/>

			{/* Info */}
			<div className='min-w-0 flex-1'>
				<h3 className='truncate font-semibold group-hover:text-white'>
					{competition.name}
				</h3>
				<div className='flex items-center gap-2 text-sm text-zinc-500'>
					<span
						className={`inline-block rounded px-2 py-0.5 text-xs ${
							competition.type === 'LEAGUE'
								? 'bg-blue-500/20 text-blue-400'
								: 'bg-purple-500/20 text-purple-400'
						}`}
					>
						{competition.type}
					</span>
					{competition.currentSeason.currentMatchday > 0 && (
						<span>MD {competition.currentSeason.currentMatchday}</span>
					)}
				</div>
			</div>

			{/* Arrow */}
			<div className='text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-400'>
				→
			</div>
		</div>
	)
}

