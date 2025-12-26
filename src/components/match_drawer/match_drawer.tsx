import type { FootballDataMatch } from '@/services/football_data/football_data.types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type MatchDrawerProps = {
	match: FootballDataMatch | null
	isOpen: boolean
	onClose: () => void
}

/**
 * Match Drawer Component
 * Показывает детальную информацию о матче в центральном модальном окне
 *
 * Может использоваться в разных табах (Results, Fixtures, etc.)
 */
export default function MatchDrawer({
	match,
	isOpen,
	onClose,
}: MatchDrawerProps) {
	const { t, i18n } = useTranslation()

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

	// Format date based on current locale
	const formatDate = (utcDate: string) => {
		const date = new Date(utcDate)
		return date.toLocaleDateString(i18n.language, {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
	}

	// Format time
	const formatTime = (utcDate: string) => {
		const date = new Date(utcDate)
		return date.toLocaleTimeString(i18n.language, {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	// Get cards count for a team
	const getTeamCards = (teamId: number | null) => {
		if (!match || !match.bookings || match.bookings.length === 0) {
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

	if (!isOpen || !match) {
		return null
	}

	const homeCards = getTeamCards(match.homeTeam.id)
	const awayCards = getTeamCards(match.awayTeam.id)

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
							<div className='flex-1'>
								<div className='flex items-center justify-between gap-4'>
									<p className='text-sm text-gray-600 dark:text-zinc-400'>
										{t('matches.matchday', { number: match.matchday || '-' })}
									</p>
									<div className='text-center'>
										<p className='text-sm text-gray-600 dark:text-zinc-400'>
											{formatDate(match.utcDate)}
										</p>
										<p className='text-xs text-gray-500 dark:text-zinc-500'>
											{formatTime(match.utcDate)}
										</p>
									</div>
								</div>
							</div>

							{/* Close Button */}
							<button
								onClick={onClose}
								className='ml-4 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
								aria-label='Закрыть'
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
					<div className='overflow-y-auto max-h-[calc(90vh-100px)] p-6'>
						{/* Main Score Section */}
						<div className='mb-8'>
							<div className='flex items-center justify-between gap-8'>
								{/* Home Team */}
								<div className='flex flex-1 flex-col items-center text-center'>
									{match.homeTeam.crest && (
										<img
											src={match.homeTeam.crest || ''}
											alt={match.homeTeam.name || ''}
											className='mb-3 h-20 w-20 object-contain'
											onError={e => {
												e.currentTarget.style.display = 'none'
											}}
										/>
									)}
									<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
										{match.homeTeam.name}
									</h3>
									{homeCards.yellowCards > 0 || homeCards.redCards > 0 ? (
										<div className='mt-2 flex items-center gap-2'>
											{homeCards.yellowCards > 0 && (
												<span className='flex items-center gap-1 text-sm'>
													<span>🟨</span>
													<span>{homeCards.yellowCards}</span>
												</span>
											)}
											{homeCards.redCards > 0 && (
												<span className='flex items-center gap-1 text-sm'>
													<span>🟥</span>
													<span>{homeCards.redCards}</span>
												</span>
											)}
										</div>
									) : null}
								</div>

								{/* Score */}
								<div className='flex flex-col items-center'>
									<div className='text-5xl font-bold text-gray-900 dark:text-white'>
										{match.score.fullTime.home !== null
											? match.score.fullTime.home
											: '-'}{' '}
										:{' '}
										{match.score.fullTime.away !== null
											? match.score.fullTime.away
											: '-'}
									</div>
									{match.score.halfTime.home !== null &&
										match.score.halfTime.away !== null && (
											<p className='mt-2 text-sm text-gray-600 dark:text-zinc-400'>
												({match.score.halfTime.home}:{match.score.halfTime.away}
												)
											</p>
										)}
									<div className='mt-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'>
										{match.status === 'FINISHED'
											? t('matches.finished')
											: match.status === 'IN_PLAY'
											? t('matches.live')
											: match.status === 'PAUSED'
											? t('matches.halftime')
											: match.status === 'TIMED'
											? t('matches.scheduled')
											: match.status}
									</div>
								</div>

								{/* Away Team */}
								<div className='flex flex-1 flex-col items-center text-center'>
									{match.awayTeam.crest && (
										<img
											src={match.awayTeam.crest || ''}
											alt={match.awayTeam.name || ''}
											className='mb-3 h-20 w-20 object-contain'
											onError={e => {
												e.currentTarget.style.display = 'none'
											}}
										/>
									)}
									<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
										{match.awayTeam.name}
									</h3>
									{awayCards.yellowCards > 0 || awayCards.redCards > 0 ? (
										<div className='mt-2 flex items-center gap-2'>
											{awayCards.yellowCards > 0 && (
												<span className='flex items-center gap-1 text-sm'>
													<span>🟨</span>
													<span>{awayCards.yellowCards}</span>
												</span>
											)}
											{awayCards.redCards > 0 && (
												<span className='flex items-center gap-1 text-sm'>
													<span>🟥</span>
													<span>{awayCards.redCards}</span>
												</span>
											)}
										</div>
									) : null}
								</div>
							</div>
						</div>

						{/* Match Events Section */}
						{match.goals && match.goals.length > 0 && (
							<div className='mb-6'>
								<h4 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
									{t('matches.goals')}
								</h4>
								<div className='space-y-2'>
									{match.goals.map((goal, index) => (
										<div
											key={index}
											className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-900 ${
												goal.team.id === match.homeTeam.id
													? 'flex-row'
													: 'flex-row-reverse'
											}`}
										>
											<span className='text-2xl'>⚽</span>
											<div
												className={
													goal.team.id === match.homeTeam.id
														? 'text-left'
														: 'text-right'
												}
											>
												<p className='font-semibold text-gray-900 dark:text-white'>
													{goal.scorer.name}
												</p>
												{goal.assist && (
													<p className='text-sm text-gray-600 dark:text-zinc-400'>
														{t('matches.assist')}: {goal.assist.name}
													</p>
												)}
											</div>
											<span className='ml-auto rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300'>
												{goal.minute}'
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Cards Section */}
						{match.bookings && match.bookings.length > 0 && (
							<div className='mb-6'>
								<h4 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
									{t('matches.cards')}
								</h4>
								<div className='space-y-2'>
									{match.bookings.map((booking, index) => (
										<div
											key={index}
											className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-900 ${
												booking.team.id === match.homeTeam.id
													? 'flex-row'
													: 'flex-row-reverse'
											}`}
										>
											<span className='text-2xl'>
												{booking.card === 'YELLOW_CARD' ? '🟨' : '🟥'}
											</span>
											<div
												className={
													booking.team.id === match.homeTeam.id
														? 'text-left'
														: 'text-right'
												}
											>
												<p className='font-semibold text-gray-900 dark:text-white'>
													{booking.player.name}
												</p>
											</div>
											<span
												className={`ml-auto rounded px-2 py-1 text-xs font-semibold ${
													booking.card === 'YELLOW_CARD'
														? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
														: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
												}`}
											>
												{booking.minute}'
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Referee Info */}
						{match.referees && match.referees.length > 0 && (
							<div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900'>
								<h4 className='mb-2 text-sm font-semibold text-gray-900 dark:text-white'>
									{t('matches.referee')}
								</h4>
								<p className='text-sm text-gray-700 dark:text-zinc-300'>
									{match.referees[0].name}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

