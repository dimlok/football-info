import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { LeagueCardProps } from './league_card.types'

/**
 * League Card Component
 * Zeigt eine Liga/Cup Karte mit Logo, Name und aktueller Saison Info
 *
 * Memoized um unnötige Re-Renders zu vermeiden
 */
function LeagueCard({
	competition,
	featured,
	isCup,
	onClick,
}: LeagueCardProps) {
	const { t } = useTranslation()
	const currentYear = new Date().getFullYear()
	const nextYear = currentYear + 1

	return (
		<div
			onClick={onClick}
			className={`group relative w-full overflow-hidden rounded-xl border transition-all active:scale-95 sm:rounded-2xl ${
				onClick ? 'cursor-pointer' : ''
			} ${
				featured
					? 'border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-400 hover:shadow-xl dark:border-blue-800/50 dark:from-blue-950/80 dark:to-zinc-900 dark:hover:border-blue-600 dark:hover:shadow-2xl dark:hover:shadow-blue-500/30'
					: isCup
					? 'border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:border-purple-400 dark:border-purple-800/50 dark:from-purple-950/50 dark:to-zinc-900 dark:hover:border-purple-600'
					: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900'
			} p-4 sm:p-6`}
		>
			{/* Hover Glow Effect */}
			<div
				className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-all group-hover:opacity-100 ${
					featured
						? 'from-blue-100/50 to-transparent dark:from-blue-500/10'
						: isCup
						? 'from-purple-100/50 to-transparent dark:from-purple-500/10'
						: 'from-gray-100/50 to-transparent dark:from-zinc-700/10'
				}`}
			/>

			<div className='relative'>
				{/* League Logo */}
				<div className='mb-3 flex justify-center sm:mb-4'>
					<img
						src={competition.emblem}
						alt={competition.name}
						className='h-12 w-12 object-contain transition-transform group-hover:scale-110 sm:h-16 sm:w-16'
						onError={e => {
							e.currentTarget.style.display = 'none'
						}}
					/>
				</div>

				{/* League Name */}
				<h3
					className={`mb-2 break-words text-center font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-white ${
						featured ? 'text-sm sm:text-lg' : 'text-sm sm:text-base'
					}`}
				>
					{competition.name}
				</h3>

				{/* Country Flag */}
				<div className='mb-2 flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 sm:mb-3 sm:gap-2 sm:text-sm'>
					{competition.area.flag && (
						<img
							src={competition.area.flag}
							alt={competition.area.name}
							className='h-3 w-5 object-cover sm:h-4 sm:w-6'
							onError={e => {
								e.currentTarget.style.display = 'none'
							}}
						/>
					)}
					<span className='truncate'>{competition.area.name}</span>
				</div>

				{/* Info */}
				<div className='space-y-1.5 text-sm sm:space-y-2'>
					{/* Type Badge */}
					<div className='flex justify-center'>
						<span
							className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 ${
								competition.type === 'LEAGUE'
									? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
									: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
							}`}
						>
							{competition.type}
						</span>
					</div>

					{/* Current Season */}
					{competition.currentSeason && (
						<div className='text-center text-xs text-gray-500 dark:text-zinc-500'>
							{t('leagues.season', { year: currentYear, nextYear })}
							{competition.currentSeason.currentMatchday > 0 && (
								<>
									{' '}
									•{' '}
									{t('leagues.matchday', {
										matchday: competition.currentSeason.currentMatchday,
									})}
								</>
							)}
						</div>
					)}

					{/* Plan Badge (für Free/Paid Tier) */}
					{featured && (
						<div className='flex justify-center'>
							<span className='inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-500/20 dark:text-green-400'>
								{competition.plan.replace('TIER_', 'Tier ')}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

// Memoize to prevent unnecessary re-renders
export default memo(LeagueCard)

