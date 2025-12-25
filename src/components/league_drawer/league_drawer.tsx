import { useCompetitionStandings } from '@/services/football_data/football_data.hooks'
import type { FootballDataCompetition } from '@/services/football_data/football_data.types'
import { useEffect } from 'react'

type LeagueDrawerProps = {
	competition: FootballDataCompetition | null
	isOpen: boolean
	onClose: () => void
}

type StandingEntry = {
	position: number
	team: {
		id: number
		name: string
		shortName: string
		crest: string
	}
	playedGames: number
	won: number
	draw: number
	lost: number
	points: number
	goalsFor: number
	goalsAgainst: number
	goalDifference: number
}

type StandingsResponse = {
	standings: Array<{
		stage: string
		type: string
		table: StandingEntry[]
	}>
}

/**
 * League Drawer Component
 * Zeigt die aktuelle Tabelle einer Liga in einem zentrierten Modal
 *
 * Nutzt TanStack Query für Caching - Tabelle wird nur einmal geholt!
 */
export default function LeagueDrawer({
	competition,
	isOpen,
	onClose,
}: LeagueDrawerProps) {
	// TanStack Query Hook - automatisches Caching!
	const {
		data: standingsData,
		isLoading,
		error,
	} = useCompetitionStandings(competition?.code || '')

	// Extrahiere Tabelle aus Response
	const standings =
		(standingsData as StandingsResponse | undefined)?.standings?.[0]?.table ||
		[]

	// Close on ESC key
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEsc)
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleEsc)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, onClose])

	if (!isOpen || !competition) {
		return null
	}

	return (
		<>
			{/* Overlay */}
			<div className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm dark:bg-black/60' />

			{/* Modal Container - Clickable to close */}
			<div
				className='fixed inset-0 z-50 flex items-center justify-center p-4'
				onClick={onClose}
			>
				{/* Modal Content - Prevents close when clicking inside */}
				<div
					className='relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950'
					onClick={e => e.stopPropagation()}
				>
					{/* Header */}
					<div className='sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950/95'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								{competition.emblem && (
									<img
										src={competition.emblem}
										alt={competition.name}
										className='h-10 w-10 object-contain'
										onError={e => {
											e.currentTarget.style.display = 'none'
										}}
									/>
								)}
								<div>
									<h2 className='text-xl font-bold text-gray-900 dark:text-white'>
										{competition.name}
									</h2>
									<p className='text-sm text-gray-600 dark:text-zinc-400'>
										Saison {new Date().getFullYear()}/
										{new Date().getFullYear() + 1}
									</p>
								</div>
							</div>

							{/* Close Button */}
							<button
								onClick={onClose}
								className='rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
								aria-label='Schließen'
							>
								<svg
									className='h-6 w-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Content */}
					<div className='overflow-y-auto max-h-[calc(90vh-80px)] p-6'>
						{isLoading && (
							<div className='flex items-center justify-center py-12'>
								<div className='text-center'>
									<div className='mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
									<p className='text-gray-600 dark:text-zinc-400'>
										Lade Tabelle...
									</p>
								</div>
							</div>
						)}

						{error && (
							<div className='rounded-xl border border-red-300 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/30'>
								<p className='text-red-700 dark:text-red-400'>
									{error instanceof Error
										? error.message
										: 'Tabelle konnte nicht geladen werden'}
								</p>
							</div>
						)}

						{!isLoading && !error && standings.length > 0 && (
							<div className='overflow-x-auto'>
								<table className='w-full text-sm'>
									<thead>
										<tr className='border-b border-gray-200 text-left dark:border-zinc-800'>
											<th className='pb-3 pr-4 font-semibold text-gray-600 dark:text-zinc-400'>
												#
											</th>
											<th className='pb-3 pr-4 font-semibold text-gray-600 dark:text-zinc-400'>
												Team
											</th>
											<th className='pb-3 px-2 text-center font-semibold text-gray-600 dark:text-zinc-400'>
												SP
											</th>
											<th className='pb-3 px-2 text-center font-semibold text-gray-600 dark:text-zinc-400'>
												S
											</th>
											<th className='pb-3 px-2 text-center font-semibold text-gray-600 dark:text-zinc-400'>
												U
											</th>
											<th className='pb-3 px-2 text-center font-semibold text-gray-600 dark:text-zinc-400'>
												N
											</th>
											<th className='pb-3 px-2 text-center font-semibold text-gray-600 dark:text-zinc-400'>
												Tore
											</th>
											<th className='pb-3 px-2 text-center font-semibold text-gray-600 dark:text-zinc-400'>
												Diff
											</th>
											<th className='pb-3 pl-2 text-center font-semibold text-gray-600 dark:text-zinc-400'>
												Pkt
											</th>
										</tr>
									</thead>
									<tbody>
										{standings.map((entry, index) => (
											<tr
												key={entry.team.id}
												className={`border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/50 ${
													index < 4
														? 'bg-blue-50 dark:bg-blue-950/20'
														: index >= standings.length - 3
														? 'bg-red-50 dark:bg-red-950/20'
														: ''
												}`}
											>
												<td className='py-3 pr-4 font-semibold text-gray-700 dark:text-zinc-300'>
													{entry.position}
												</td>
												<td className='py-3 pr-4'>
													<div className='flex items-center gap-2'>
														<img
															src={entry.team.crest}
															alt={entry.team.name}
															className='h-6 w-6 object-contain'
															onError={e => {
																e.currentTarget.style.display = 'none'
															}}
														/>
														<span className='font-medium text-gray-900 dark:text-white'>
															{entry.team.shortName || entry.team.name}
														</span>
													</div>
												</td>
												<td className='py-3 px-2 text-center text-gray-700 dark:text-zinc-300'>
													{entry.playedGames}
												</td>
												<td className='py-3 px-2 text-center text-green-600 dark:text-green-400'>
													{entry.won}
												</td>
												<td className='py-3 px-2 text-center text-yellow-600 dark:text-yellow-400'>
													{entry.draw}
												</td>
												<td className='py-3 px-2 text-center text-red-600 dark:text-red-400'>
													{entry.lost}
												</td>
												<td className='py-3 px-2 text-center text-gray-700 dark:text-zinc-300'>
													{entry.goalsFor}:{entry.goalsAgainst}
												</td>
												<td
													className={`py-3 px-2 text-center font-semibold ${
														entry.goalDifference > 0
															? 'text-green-600 dark:text-green-400'
															: entry.goalDifference < 0
															? 'text-red-600 dark:text-red-400'
															: 'text-gray-500 dark:text-zinc-400'
													}`}
												>
													{entry.goalDifference > 0 ? '+' : ''}
													{entry.goalDifference}
												</td>
												<td className='py-3 pl-2 text-center font-bold text-gray-900 dark:text-white'>
													{entry.points}
												</td>
											</tr>
										))}
									</tbody>
								</table>

								{/* Legend */}
								<div className='mt-6 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-zinc-500'>
									<div className='flex items-center gap-2'>
										<div className='h-3 w-3 rounded bg-blue-200 dark:bg-blue-950/50' />
										<span>Champions League</span>
									</div>
									<div className='flex items-center gap-2'>
										<div className='h-3 w-3 rounded bg-red-200 dark:bg-red-950/50' />
										<span>Abstieg</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

