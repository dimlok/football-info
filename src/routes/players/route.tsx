import PlayerCard from '@/components/player_card/player_card'
import { useTopPlayers } from '@/services/football_data/football_data.hooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Liga-Filter
const leagues = [
	{ code: 'ALL', name: 'Alle Top Ligen', flag: '🌍' },
	{ code: 'PL', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
	{ code: 'BL1', name: 'Bundesliga', flag: '🇩🇪' },
	{ code: 'PD', name: 'La Liga', flag: '🇪🇸' },
	{ code: 'SA', name: 'Serie A', flag: '🇮🇹' },
	{ code: 'FL1', name: 'Ligue 1', flag: '🇫🇷' },
]

const topLeagues = ['PL', 'BL1', 'PD', 'SA', 'FL1'] // Premier, Bundesliga, La Liga, Serie A, Ligue 1

export default function PlayersPage() {
	const { t } = useTranslation()
	const [selectedLeague, setSelectedLeague] = useState('PL')

	// Hole Top-Spieler von ausgewählten Ligen
	const {
		data: players,
		isLoading,
		error,
	} = useTopPlayers(selectedLeague ? [selectedLeague] : topLeagues, 20)

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-zinc-950'>
			{/* Header */}
			<div className='border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'>
				<div className='mx-auto max-w-7xl px-4 py-8'>
					<h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl'>
						{t('players.page_title')}
					</h1>
					<p className='text-gray-600 dark:text-zinc-400'>
						{t('players.page_subtitle')}
					</p>

					{/* Liga Filter */}
					<div className='mt-6 flex flex-wrap gap-2'>
						{leagues.map(league => (
							<button
								key={league.code}
								onClick={() =>
									setSelectedLeague(league.code === 'ALL' ? '' : league.code)
								}
								className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
									(selectedLeague === '' && league.code === 'ALL') ||
									selectedLeague === league.code
										? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
								}`}
							>
								<span>{league.flag}</span>
								<span>{league.name}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className='mx-auto max-w-7xl px-4 py-8'>
				{/* Loading */}
				{isLoading && (
					<div className='flex min-h-[400px] items-center justify-center'>
						<div className='text-center'>
							<div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
							<p className='text-gray-600 dark:text-zinc-400'>{t('loading')}</p>
						</div>
					</div>
				)}

				{/* Error */}
				{error && (
					<div className='rounded-xl border border-red-300 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/30'>
						<p className='text-red-700 dark:text-red-400'>
							❌ {t('error')}: {error.message}
						</p>
						<p className='mt-2 text-sm text-red-600 dark:text-red-500'>
							⚠️ API Rate Limit erreicht? Free Tier: 10 Requests/Minute
						</p>
					</div>
				)}

				{/* Players Grid */}
				{!isLoading && !error && players && players.length > 0 && (
					<>
						<div className='mb-4 text-sm text-gray-600 dark:text-zinc-400'>
							{players.length} Spieler gefunden
						</div>
						<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
							{players.map((player, index) => (
								<PlayerCard key={`${player.id}-${index}`} player={player} />
							))}
						</div>
					</>
				)}

				{/* No Results */}
				{!isLoading && !error && (!players || players.length === 0) && (
					<div className='flex min-h-[400px] items-center justify-center'>
						<div className='text-center'>
							<div className='mb-4 text-6xl'>🔍</div>
							<p className='text-gray-600 dark:text-zinc-400'>
								{t('no_players_found')}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

