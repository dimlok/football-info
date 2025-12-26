import type { FootballDataCompetition } from '@/services/football_data/football_data.types'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type TabKey = 'summary' | 'results' | 'fixtures' | 'table' | 'archive'

type LeagueHeaderProps = {
	competition: FootballDataCompetition
	startDate: string
	endDate: string
	activeTab: TabKey
	onTabChange: (tab: TabKey) => void
}

function LeagueHeader({
	competition,
	startDate,
	endDate,
	activeTab,
	onTabChange,
}: LeagueHeaderProps) {
	const { t } = useTranslation()

	// Define tabs with translations
	const TABS: Array<{ key: TabKey; label: string }> = [
		{ key: 'summary', label: t('leagues.tabs.summary') },
		{ key: 'results', label: t('leagues.tabs.results') },
		{ key: 'fixtures', label: t('leagues.tabs.fixtures') },
		{ key: 'table', label: t('leagues.tabs.table') },
		{ key: 'archive', label: t('leagues.tabs.archive') },
	]
	// Berechne den Fortschritt der Saison
	const start = new Date(startDate).getTime()
	const end = new Date(endDate).getTime()
	const now = new Date().getTime()
	const totalDuration = end - start
	const elapsed = now - start
	const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)

	return (
		<div className='border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'>
			<div className='mx-auto max-w-7xl px-4 py-6'>
				{/* Back Button */}
				<div className='mb-4'>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'
					>
						<span>←</span>
						<span>{t('navigation.back_to_home')}</span>
					</Link>
				</div>

				<div className='mb-6 flex items-center gap-4'>
					<div className='flex-1'>
						<img
							src={competition.emblem}
							alt={competition.name}
							className='h-12  w-12 object-contain justify-self-center transition-transform group-hover:scale-110 sm:h-16 sm:w-16'
							onError={e => {
								e.currentTarget.style.display = 'none'
							}}
						/>
						<h1 className='text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl'>
							{competition.name}
						</h1>
						<p className='text-sm text-gray-600 dark:text-zinc-400'>
							{t('leagues.season_label')} {new Date(startDate).getFullYear()}/
							{new Date(endDate).getFullYear()}
						</p>
					</div>
				</div>

				{/* Timeline */}
				<div className='mb-6'>
					<div className='relative'>
						{/* Zeitstrahl Container */}
						<div className='relative h-2 rounded-full bg-gray-200 dark:bg-zinc-800'>
							{/* Fortschrittsbalken */}
							<div
								className='absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-500'
								style={{ width: `${progress}%` }}
							/>

							{/* Aktueller Punkt */}
							<div
								className='absolute top-1/2 -translate-x-1/2 -translate-y-1/2'
								style={{ left: `${progress}%` }}
							>
								<div className='h-4 w-4 rounded-full border-2 border-pink-500 bg-white shadow-lg dark:bg-zinc-900' />
							</div>
						</div>

						{/* Datum-Labels */}
						<div className='mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-zinc-400'>
							<div className='flex flex-col items-start'>
								<span className='font-medium'>
									{t('leagues.timeline.start')}
								</span>
								<span className='text-gray-900 dark:text-white'>
									{new Date(startDate).toLocaleDateString('de-DE', {
										day: '2-digit',
										month: 'short',
										year: 'numeric',
									})}
								</span>
							</div>

							<div className='flex flex-col items-center'>
								<span className='font-medium'>
									{t('leagues.timeline.today')}
								</span>
								<span className='text-pink-600 dark:text-pink-400'>
									{new Date().toLocaleDateString('de-DE', {
										day: '2-digit',
										month: 'short',
										year: 'numeric',
									})}
								</span>
							</div>

							<div className='flex flex-col items-end'>
								<span className='font-medium'>{t('leagues.timeline.end')}</span>
								<span className='text-gray-900 dark:text-white'>
									{new Date(endDate).toLocaleDateString('de-DE', {
										day: '2-digit',
										month: 'short',
										year: 'numeric',
									})}
								</span>
							</div>
						</div>

						{/* Fortschritts-Prozent */}
						<div className='mt-2 text-center text-xs font-medium text-gray-600 dark:text-zinc-400'>
							{t('leagues.season_progress', {
								progress: progress.toFixed(0),
							})}
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className='flex gap-2 overflow-x-auto'>
					{TABS.map(tab => (
						<button
							key={tab.key}
							onClick={() => onTabChange(tab.key)}
							className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
								activeTab === tab.key
									? 'border-pink-500 text-pink-600 dark:text-pink-400'
									: 'border-transparent text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

export default memo(LeagueHeader)

