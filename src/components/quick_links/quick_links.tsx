import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

/**
 * Quick Links Component
 * Zeigt Navigation Links zu Players, Teams und API Test
 *
 * Memoized da diese Component statisch ist
 */
function QuickLinks() {
	const { t } = useTranslation()

	return (
		<div className='mt-12 grid w-full gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'>
			<Link
				to='/players'
				className='group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-500 hover:bg-blue-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-blue-600 dark:hover:bg-zinc-900 sm:p-6'
			>
				<div className='mb-2 text-3xl sm:text-4xl'>⚽</div>
				<div className='mb-1 text-base font-bold text-gray-900 dark:text-white sm:text-lg'>
					{t('leagues.quick_links.players_title')}
				</div>
				<div className='text-xs text-gray-600 dark:text-zinc-500 sm:text-sm'>
					{t('leagues.quick_links.players_description')}
				</div>
			</Link>

			<Link
				to='/teams'
				className='group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-yellow-500 hover:bg-yellow-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-yellow-600 dark:hover:bg-zinc-900 sm:p-6'
			>
				<div className='mb-2 text-3xl sm:text-4xl'>🏆</div>
				<div className='mb-1 text-base font-bold text-gray-900 dark:text-white sm:text-lg'>
					{t('leagues.quick_links.teams_title')}
				</div>
				<div className='text-xs text-gray-600 dark:text-zinc-500 sm:text-sm'>
					{t('leagues.quick_links.teams_description')}
				</div>
			</Link>

			<Link
				to='/api-test'
				className='group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-green-500 hover:bg-green-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-green-600 dark:hover:bg-zinc-900 sm:col-span-2 sm:p-6 lg:col-span-1'
			>
				<div className='mb-2 text-3xl sm:text-4xl'>🔌</div>
				<div className='mb-1 text-base font-bold text-gray-900 dark:text-white sm:text-lg'>
					{t('leagues.quick_links.api_test_title')}
				</div>
				<div className='text-xs text-gray-600 dark:text-zinc-500 sm:text-sm'>
					{t('leagues.quick_links.api_test_description')}
				</div>
			</Link>
		</div>
	)
}

export default memo(QuickLinks)

