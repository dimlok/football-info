import type { FootballDataStandingsResponse } from '@/services/football_data/football_data.types'
import { memo } from 'react'

type SummaryTabProps = {
	standings: FootballDataStandingsResponse['standings'] | undefined
	isLoading: boolean
}

function SummaryTab({ standings, isLoading }: SummaryTabProps) {
	return (
		<div className='space-y-6'>
			<h2 className='text-xl font-bold text-gray-900 dark:text-white'>
				Übersicht
			</h2>

			{/* Aktuelle Tabelle (Top 5) */}
			{isLoading && (
				<div className='text-center text-gray-600 dark:text-zinc-400'>
					Lade Daten...
				</div>
			)}

			{standings && standings?.[0] && (
				<div className='rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900'>
					<h3 className='mb-4 font-semibold text-gray-900 dark:text-white'>
						Aktuelle Tabelle (Top 5)
					</h3>
					<div className='space-y-2'>
						{standings[0].table.slice(0, 5).map(team => (
							<div
								key={team.team.id}
								className='flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-zinc-800'
							>
								<div className='flex items-center gap-3'>
									<span className='w-6 text-sm font-bold text-gray-900 dark:text-white'>
										{team.position}
									</span>
									<img
										src={team.team.crest}
										alt={team.team.name}
										className='h-6 w-6 object-contain'
										onError={e => {
											e.currentTarget.style.display = 'none'
										}}
									/>
									<span className='text-sm font-medium text-gray-900 dark:text-white'>
										{team.team.name}
									</span>
								</div>
								<div className='flex gap-4 text-sm text-gray-600 dark:text-zinc-400'>
									<span>Sp: {team.playedGames}</span>
									<span className='font-bold text-gray-900 dark:text-white'>
										{team.points} Pkt
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Placeholder für weitere Summary-Inhalte */}
			<div className='rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900'>
				<p className='text-gray-600 dark:text-zinc-400'>
					Weitere Statistiken und Informationen folgen...
				</p>
			</div>
		</div>
	)
}

export default memo(SummaryTab)

