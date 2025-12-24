import { getPlayersByTeam } from '@/mocks/players.mock'
import { teams } from '@/mocks/teams.mock'
import type { Team } from '@/types/team.types'
import { useTranslation } from 'react-i18next'
import { Link, useLoaderData } from 'react-router-dom'

export const loader = () => {
	return { teams }
}

type LoaderData = {
	teams: Team[]
}

export default function TeamsPage() {
	const { teams } = useLoaderData() as LoaderData
	const { t } = useTranslation()

	const getTeamPlayersCount = (teamId: string) => {
		return getPlayersByTeam(teamId).length
	}

	return (
		<>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold sm:text-4xl'>
					{t('teams.page_title')}
				</h1>
				<p className='mt-2 text-zinc-400'>{t('teams.page_subtitle')}</p>
			</div>

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{teams.map(team => (
					<Link
						key={team.id}
						to={`/teams/${team.id}`}
						className='group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900'
					>
						<div className='mb-4'>
							<div className='text-4xl'>{team.logo}</div>
							<div className='mt-3 text-xl font-semibold group-hover:text-zinc-100'>
								{team.name}
							</div>
							<div className='mt-1 text-sm text-zinc-400'>{team.country}</div>
						</div>

						<div className='space-y-2 text-sm'>
							<div className='flex justify-between'>
								<span className='text-zinc-500'>
									{t('teams.details.founded')}
								</span>
								<span className='font-medium'>{team.founded}</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-zinc-500'>
									{t('teams.details.stadium')}
								</span>
								<span className='font-medium'>{team.stadium}</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-zinc-500'>
									{t('teams.details.players')}
								</span>
								<span className='font-medium'>
									{getTeamPlayersCount(team.id)}
								</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</>
	)
}

