import RateLimitMonitor from '@/components/rate_limit_monitor/rate_limit_monitor'
import { useTeam } from '@/services/football_data/football_data.hooks'

/**
 * Beispiel Component - Zeigt wie man die Football-Data API nutzt
 *
 * ✅ Daten werden im Loader prefetched (siehe api_example.loader.ts)
 * ✅ TanStack Query gibt sie aus dem Cache zurück
 * ✅ Cache: UNENDLICH ♾️
 */
export default function ApiExample() {
	// Beispiel 1: Einzelnes Team (Bayern München)
	// Daten kommen aus dem Cache (Loader hat sie prefetched!)
	const { data: bayern, isLoading, error, dataUpdatedAt } = useTeam(5)

	// // Beispiel 2: Mehrere Teams gleichzeitig (mit Caching!)
	// const { data: topTeams } = useMultipleTeams([5, 86, 81]) // Bayern, Real, Barca

	// // Beispiel 3: Alle Bundesliga Teams
	// const { data: bundesliga } = useCompetitionTeams('BL1')

	if (isLoading) {
		return <div className='p-6 text-zinc-400'>Lade Daten...</div>
	}

	if (error) {
		return (
			<div className='p-6 text-red-400'>
				Fehler: {error instanceof Error ? error.message : 'API Error'}
			</div>
		)
	}

	return (
		<>
			<RateLimitMonitor />
			<div className='p-6'>
				<h1 className='mb-6 text-2xl font-bold'>Football-Data API Beispiele</h1>

				{/* Beispiel 1: Einzelnes Team */}
				{bayern && (
					<div className='mb-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6'>
						<h2 className='mb-4 text-xl font-semibold'>
							Einzelnes Team: {bayern.name}
						</h2>
						<div className='mb-4 flex items-center gap-4'>
							<img src={bayern.crest} alt={bayern.name} className='h-16 w-16' />
							<div>
								<div className='text-zinc-400'>Gegründet: {bayern.founded}</div>
								<div className='text-zinc-400'>Stadion: {bayern.venue}</div>
								<div className='text-zinc-400'>
									Kader: {bayern.squad?.length || 0} Spieler
								</div>
							</div>
						</div>

						<h3 className='mb-2 font-semibold'>Kader (erste 5 Spieler):</h3>
						<div className='space-y-2'>
							{bayern.squad?.slice(0, 5).map(player => (
								<div
									key={player.id}
									className='flex items-center justify-between rounded-lg bg-zinc-950 p-3'
								>
									<div>
										<div className='font-medium'>{player.name}</div>
										<div className='text-sm text-zinc-400'>
											{player.position}
										</div>
									</div>
									<div className='text-sm text-zinc-500'>
										#{player.shirtNumber || '?'}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Beispiel 2: Mehrere Teams */}
				{/* {topTeams && (
				<div className='mb-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6'>
					<h2 className='mb-4 text-xl font-semibold'>
						Top 3 Teams (parallel geladen):
					</h2>
					<div className='grid gap-4 sm:grid-cols-3'>
						{topTeams.map(team => (
							<div
								key={team.id}
								className='rounded-lg bg-zinc-950 p-4 text-center'
							>
								<img
									src={team.crest}
									alt={team.name}
									className='mx-auto mb-2 h-12 w-12'
								/>
								<div className='font-medium'>{team.shortName}</div>
								<div className='text-sm text-zinc-400'>
									{team.squad?.length || 0} Spieler
								</div>
							</div>
						))}
					</div>
				</div>
			)} */}

				{/* Beispiel 3: Liga Teams */}
				{/* {bundesliga?.teams && (
				<div className='rounded-xl border border-zinc-800 bg-zinc-900/50 p-6'>
					<h2 className='mb-4 text-xl font-semibold'>
						Bundesliga Teams ({bundesliga.teams.length}):
					</h2>
					<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
						{bundesliga.teams.slice(0, 9).map(team => (
							<div key={team.id} className='flex items-center gap-3 rounded-lg bg-zinc-950 p-3'>
								<img src={team.crest} alt={team.name} className='h-8 w-8' />
								<div className='text-sm font-medium'>{team.shortName}</div>
							</div>
						))}
					</div>
					<div className='mt-4 text-sm text-zinc-500'>
						...und {bundesliga.teams.length - 9} weitere Teams
					</div>
				</div>
			)} */}

				<div className='space-y-4'>
					<div className='rounded-lg bg-green-900/20 p-4 text-sm text-green-300'>
						♾️ <strong>Unendlicher Cache!</strong> Daten werden im{' '}
						<strong>React Router Loader</strong> prefetched und von TanStack
						Query für IMMER gecached.
					</div>

					<div className='rounded-lg bg-blue-900/20 p-4 text-sm text-blue-300'>
						💡 <strong>Teste es:</strong> Lade die Seite neu (F5) → Daten kommen
						sofort aus dem Cache, keine API-Anfrage!
					</div>

					{dataUpdatedAt && (
						<div className='rounded-lg bg-zinc-900/50 p-4 text-xs text-zinc-400'>
							🕐 <strong>Letztes Update:</strong>{' '}
							{new Date(dataUpdatedAt).toLocaleString('de-DE')}
							<br />
							<strong>Status:</strong> {isLoading ? 'Lädt...' : 'Aus Cache ✅'}
						</div>
					)}
				</div>
			</div>
		</>
	)
}

