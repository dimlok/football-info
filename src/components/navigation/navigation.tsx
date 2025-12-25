import { useSettings } from '@/contexts/settings_context'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

type NavigationProps = {
	competitionsCount: number
}

/**
 * Navigation Component
 * Zeigt Header mit Logo, Titel und Settings Button
 *
 * Memoized da diese Component sich selten ändert
 */
function Navigation({ competitionsCount }: NavigationProps) {
	const { t } = useTranslation()
	const { openSettings } = useSettings()

	return (
		<div className='border-b border-gray-200 backdrop-blur-sm dark:border-zinc-900'>
			<div className='mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4'>
				<div className='flex items-center gap-2 sm:gap-3'>
					<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-500/30 sm:h-10 sm:w-10'>
						⚽
					</div>
					<div>
						<div className='text-sm font-bold text-gray-900 dark:text-white sm:text-lg'>
							{t('leagues.title')}
						</div>
						<div className='hidden text-xs text-gray-500 dark:text-zinc-500 sm:block'>
							{t('leagues.competitions_count', {
								count: competitionsCount,
							})}
						</div>
					</div>
				</div>

				{/* Settings Button */}
				<button
					onClick={openSettings}
					className='group rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white sm:p-2.5'
					aria-label={t('settings.open')}
					title={t('settings.title')}
				>
					<svg
						className='h-5 w-5 transition-transform group-hover:rotate-90 sm:h-6 sm:w-6'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						aria-hidden='true'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
						/>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
						/>
					</svg>
				</button>
			</div>
		</div>
	)
}

export default memo(Navigation)

