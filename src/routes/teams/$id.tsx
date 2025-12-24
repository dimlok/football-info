import { getPlayersByTeam } from '@/mocks/players.mock'
import { getTeamById } from '@/mocks/teams.mock'
import type { Player } from '@/types/player.types'
import type { Team } from '@/types/team.types'
import { useTranslation } from 'react-i18next'
import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router-dom'

export const loader = ({ params }: LoaderFunctionArgs) => {
	const team = params.id ? getTeamById(params.id) : undefined
	const players = params.id ? getPlayersByTeam(params.id) : []

	if (!team) {
		throw new Response('Team not found', { status: 404 })
	}

	return { team, players }
}

type LoaderData = {
	team: Team
	players: Player[]
}

export default function TeamDetailPage() {
	const { team, players } = useLoaderData() as LoaderData
	const { t } = useTranslation()

	return (
		<>
			<div className='mb-6 flex items-center justify-between'>
				<Link
					to='/teams'
					className='text-sm text-zinc-400 transition-colors hover:text-zinc-100'
				>
					← {t('navigation.back_to_teams')}
				</Link>
			</div>

			<div className='rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 sm:p-10'>
				<div className='mb-8 flex items-start gap-6'>
					<div className='text-7xl'>{team.logo}</div>
					<div className='flex-1'>
						<h1 className='text-3xl font-bold sm:text-4xl'>{team.name}</h1>
						<div className='mt-2 text-lg text-zinc-400'>{team.country}</div>
					</div>
				</div>

				<div className='mb-8 grid gap-6 sm:grid-cols-2'>
					<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
						<div className='mb-1 text-sm text-zinc-500'>
							{t('teams.details.founded')}
						</div>
						<div className='text-lg font-semibold'>{team.founded}</div>
					</div>
					<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
						<div className='mb-1 text-sm text-zinc-500'>
							{t('teams.details.city')}
						</div>
						<div className='text-lg font-semibold'>{team.city}</div>
					</div>
					<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
						<div className='mb-1 text-sm text-zinc-500'>
							{t('teams.details.stadium')}
						</div>
						<div className='text-lg font-semibold'>{team.stadium}</div>
					</div>
					<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
						<div className='mb-1 text-sm text-zinc-500'>
							{t('teams.details.players')}
						</div>
						<div className='text-lg font-semibold'>{players.length}</div>
					</div>
				</div>

				{players.length > 0 && (
					<div>
						<h2 className='mb-4 text-xl font-semibold'>
							{t('teams.squad_title')}
						</h2>
						<div className='grid gap-3 sm:grid-cols-2'>
							{players.map(player => (
								<Link
									key={player.id}
									to={`/players/${player.id}`}
									className='flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900'
								>
									<div className='text-3xl'>{player.photo}</div>
									<div className='flex-1'>
										<div className='font-semibold'>{player.name}</div>
										<div className='text-sm text-zinc-400'>
											{t(`players.positions.${player.position}`)} • #
											{player.number}
										</div>
									</div>
									<div className='text-right text-sm'>
										<div className='text-zinc-500'>
											{t('players.stats.goals')}
										</div>
										<div className='font-semibold'>{player.stats.goals}</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</>
	)
}

