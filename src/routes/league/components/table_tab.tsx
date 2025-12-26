import type { FootballDataStandingsResponse } from '@/services/football_data/football_data.types'
import { memo } from 'react'

type TableTabProps = {
	standings: FootballDataStandingsResponse['standings'] | undefined
	isLoading: boolean
	error: Error | null
}

function TableTab({ standings, isLoading, error }: TableTabProps) {
	return (
		<div>
			<h2 className='mb-6 text-xl font-bold text-gray-900 dark:text-white'>
				Tabelle
			</h2>

			{isLoading && (
				<div className='text-center text-gray-600 dark:text-zinc-400'>
					Lade Tabelle...
				</div>
			)}

			{error && (
				<div className='rounded-xl border border-red-300 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/30'>
					<p className='text-red-700 dark:text-red-400'>
						❌ Fehler beim Laden der Tabelle
					</p>
				</div>
			)}

			{standings && standings?.[0] && (
				<div className='overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'>
					<table className='w-full'>
						<thead className='border-b border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-800/50'>
							<tr className='text-left text-sm font-medium text-gray-600 dark:text-zinc-400'>
								<th className='p-3'>Pos</th>
								<th className='p-3'>Mannschaft</th>
								<th className='p-3 text-center'>Sp</th>
								<th className='p-3 text-center'>S</th>
								<th className='p-3 text-center'>U</th>
								<th className='p-3 text-center'>N</th>
								<th className='p-3 text-center'>Tore</th>
								<th className='p-3 text-center'>Diff</th>
								<th className='p-3 text-center font-bold'>Pkt</th>
							</tr>
						</thead>
						<tbody>
							{standings[0].table.map(team => (
								<tr
									key={team.team.id}
									className='border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30'
								>
									<td className='p-3'>
										<span className='font-bold text-gray-900 dark:text-white'>
											{team.position}
										</span>
									</td>
									<td className='p-3'>
										<div className='flex items-center gap-3'>
											<img
												src={team.team.crest}
												alt={team.team.name}
												className='h-6 w-6 object-contain'
												onError={e => {
													e.currentTarget.style.display = 'none'
												}}
											/>
											<span className='font-medium text-gray-900 dark:text-white'>
												{team.team.name}
											</span>
										</div>
									</td>
									<td className='p-3 text-center text-gray-600 dark:text-zinc-400'>
										{team.playedGames}
									</td>
									<td className='p-3 text-center text-gray-600 dark:text-zinc-400'>
										{team.won}
									</td>
									<td className='p-3 text-center text-gray-600 dark:text-zinc-400'>
										{team.draw}
									</td>
									<td className='p-3 text-center text-gray-600 dark:text-zinc-400'>
										{team.lost}
									</td>
									<td className='p-3 text-center text-gray-600 dark:text-zinc-400'>
										{team.goalsFor}:{team.goalsAgainst}
									</td>
									<td className='p-3 text-center text-gray-600 dark:text-zinc-400'>
										{team.goalDifference > 0 ? '+' : ''}
										{team.goalDifference}
									</td>
									<td className='p-3 text-center'>
										<span className='font-bold text-gray-900 dark:text-white'>
											{team.points}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

export default memo(TableTab)

