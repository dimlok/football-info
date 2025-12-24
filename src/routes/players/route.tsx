import FifaCard from '@/components/fifa_card/fifa_card'
import { players } from '@/mocks/players.mock'
import { teams } from '@/mocks/teams.mock'
import type { Player } from '@/types/player.types'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'

export const loader = () => {
	return { players, teams }
}

type LoaderData = {
	players: Player[]
	teams: typeof teams
}

export default function PlayersPage() {
	const { players, teams } = useLoaderData() as LoaderData
	const { t } = useTranslation()

	const getTeamName = (teamId: string) => {
		return teams.find(team => team.id === teamId)?.name || teamId
	}

	return (
		<>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold sm:text-4xl'>
					{t('players.page_title')}
				</h1>
				<p className='mt-2 text-zinc-400'>{t('players.page_subtitle')}</p>
			</div>

			<div className='grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{players.map(player => (
					<FifaCard
						key={player.id}
						player={player}
						teamName={getTeamName(player.teamId)}
					/>
				))}
			</div>
		</>
	)
}

