import { getPlayerById } from '@/mocks/players.mock'
import { getTeamById } from '@/mocks/teams.mock'
import type { Player } from '@/types/player.types'
import type { Team } from '@/types/team.types'
import { useTranslation } from 'react-i18next'
import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router-dom'

export const loader = ({ params }: LoaderFunctionArgs) => {
	const player = params.id ? getPlayerById(params.id) : undefined
	const team = player ? getTeamById(player.teamId) : undefined

	if (!player) {
		throw new Response('Player not found', { status: 404 })
	}

	return { player, team }
}

type LoaderData = {
	player: Player
	team: Team | undefined
}

export default function PlayerDetailPage() {
	const { player, team } = useLoaderData() as LoaderData
	const { t } = useTranslation()

	return (
		<>
			<div className='mb-6 flex items-center justify-between'>
				<Link
					to='/players'
					className='text-sm text-zinc-400 transition-colors hover:text-zinc-100'
				>
					← {t('navigation.back_to_players')}
				</Link>
			</div>

			<div className='rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 sm:p-10'>
				<div className='mb-8 flex items-start gap-6'>
					<div className='text-6xl'>{player.photo}</div>
					<div className='flex-1'>
						<h1 className='text-3xl font-bold sm:text-4xl'>{player.name}</h1>
						<div className='mt-2 text-lg text-zinc-400'>
							{t(`players.positions.${player.position}`)} • #{player.number}
						</div>
						{team && (
							<Link
								to={`/teams/${team.id}`}
								className='mt-3 inline-block text-zinc-300 transition-colors hover:text-zinc-100'
							>
								{team.logo} {team.name}
							</Link>
						)}
					</div>
				</div>

				<div className='mb-8 grid gap-6 sm:grid-cols-2'>
					<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
						<div className='mb-1 text-sm text-zinc-500'>
							{t('players.details.nationality')}
						</div>
						<div className='text-lg font-semibold'>{player.nationality}</div>
					</div>
					<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
						<div className='mb-1 text-sm text-zinc-500'>
							{t('players.details.age')}
						</div>
						<div className='text-lg font-semibold'>
							{player.age} {t('players.details.years')}
						</div>
					</div>
				</div>

				<div>
					<h2 className='mb-4 text-xl font-semibold'>
						{t('players.stats.title')}
					</h2>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
							<div className='mb-1 text-sm text-zinc-500'>
								{t('players.stats.goals')}
							</div>
							<div className='text-2xl font-bold'>{player.stats.goals}</div>
						</div>
						<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
							<div className='mb-1 text-sm text-zinc-500'>
								{t('players.stats.assists')}
							</div>
							<div className='text-2xl font-bold'>{player.stats.assists}</div>
						</div>
						<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
							<div className='mb-1 text-sm text-zinc-500'>
								{t('players.stats.matches')}
							</div>
							<div className='text-2xl font-bold'>{player.stats.matches}</div>
						</div>
						<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
							<div className='mb-1 text-sm text-zinc-500'>
								{t('players.stats.yellow_cards')}
							</div>
							<div className='text-2xl font-bold'>
								{player.stats.yellowCards}
							</div>
						</div>
						<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
							<div className='mb-1 text-sm text-zinc-500'>
								{t('players.stats.red_cards')}
							</div>
							<div className='text-2xl font-bold'>{player.stats.redCards}</div>
						</div>
						<div className='rounded-xl border border-zinc-800 bg-zinc-950/50 p-5'>
							<div className='mb-1 text-sm text-zinc-500'>
								{t('players.stats.goals_per_match')}
							</div>
							<div className='text-2xl font-bold'>
								{(player.stats.goals / player.stats.matches).toFixed(2)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

