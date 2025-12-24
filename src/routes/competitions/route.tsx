import { useAllCompetitions } from '@/services/football_data/football_data.hooks'
import { Link } from 'react-router-dom'

export default function CompetitionsPage() {
	const { data, isLoading, error } = useAllCompetitions()

	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<div className='text-center'>
					<div className='mb-4 text-5xl'>⚽</div>
					<div className='text-xl'>Lade Ligen...</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<div className='rounded-2xl border border-red-800 bg-red-950/50 p-8 text-center'>
					<div className='mb-4 text-5xl'>❌</div>
					<div className='mb-2 text-xl font-bold text-red-400'>API Fehler</div>
					<div className='text-sm text-red-300'>
						{error instanceof Error ? error.message : 'Unbekannter Fehler'}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-zinc-950 p-6'>
			<div className='mx-auto max-w-7xl'>
				{/* Header */}
				<div className='mb-8'>
					<Link
						to='/'
						className='mb-4 inline-block text-sm text-zinc-400 transition-colors hover:text-zinc-100'
					>
						← Zurück
					</Link>
					<h1 className='mb-2 text-3xl font-bold sm:text-4xl'>
						🏆 Football Competitions
					</h1>
					<p className='text-zinc-400'>
						Alle verfügbaren Ligen von Football-Data.org API
					</p>
					<div className='mt-2 text-sm text-zinc-500'>
						Anzahl: {data?.count} Ligen
					</div>
				</div>

				{/* JSON Struktur - Expandierbar */}
				<div className='mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6'>
					<h2 className='mb-4 text-xl font-bold'>📋 Rohe API Antwort:</h2>
					<pre className='overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs text-zinc-300'>
						{JSON.stringify(data, null, 2)}
					</pre>
				</div>

				{/* Competitions Grid */}
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{data?.competitions.map(competition => (
						<div
							key={competition.id}
							className='rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700'
						>
							{/* Emblem */}
							{competition.emblem && (
								<div className='mb-4 flex justify-center'>
									<img
										src={competition.emblem}
										alt={competition.name}
										className='h-16 w-16 object-contain'
										onError={e => {
											e.currentTarget.style.display = 'none'
										}}
									/>
								</div>
							)}

							{/* Name */}
							<h3 className='mb-2 text-lg font-bold'>{competition.name}</h3>

							{/* Code */}
							<div className='mb-3 inline-block rounded bg-zinc-800 px-2 py-1 text-xs font-mono text-zinc-400'>
								{competition.code}
							</div>

							{/* Details */}
							<div className='space-y-2 text-sm'>
								{competition.area && (
									<div className='flex items-center gap-2'>
										<span className='text-2xl'>{competition.area.flag}</span>
										<span className='text-zinc-400'>
											{competition.area.name}
										</span>
									</div>
								)}

								<div className='flex justify-between'>
									<span className='text-zinc-500'>Type:</span>
									<span className='font-medium'>{competition.type}</span>
								</div>

								{competition.currentSeason && (
									<>
										<div className='flex justify-between'>
											<span className='text-zinc-500'>Saison:</span>
											<span className='font-medium'>
												{new Date(
													competition.currentSeason.startDate
												).getFullYear()}
												/
												{new Date(
													competition.currentSeason.endDate
												).getFullYear()}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-zinc-500'>Spieltag:</span>
											<span className='font-medium'>
												{competition.currentSeason.currentMatchday || '—'}
											</span>
										</div>
									</>
								)}

								{competition.numberOfAvailableSeasons && (
									<div className='flex justify-between'>
										<span className='text-zinc-500'>Seasons:</span>
										<span className='font-medium'>
											{competition.numberOfAvailableSeasons}
										</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

