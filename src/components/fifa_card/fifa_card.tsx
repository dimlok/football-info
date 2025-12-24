import { cn } from '@/lib/utils'
import type { Player } from '@/types/player.types'
import { Link } from 'react-router-dom'

type FifaCardProps = {
	player: Player
	teamName?: string
}

const getCardGradient = (cardType: Player['cardType']) => {
	switch (cardType) {
		case 'gold':
			return 'from-amber-600 via-yellow-500 to-amber-600'
		case 'silver':
			return 'from-slate-400 via-gray-300 to-slate-400'
		case 'bronze':
			return 'from-orange-700 via-amber-800 to-orange-700'
		case 'special':
			return 'from-purple-600 via-pink-500 to-purple-600'
	}
}

const getPositionShort = (position: Player['position']) => {
	switch (position) {
		case 'goalkeeper':
			return 'GK'
		case 'defender':
			return 'DEF'
		case 'midfielder':
			return 'MID'
		case 'forward':
			return 'FWD'
	}
}

export default function FifaCard({ player, teamName }: FifaCardProps) {
	const cardGradient = getCardGradient(player.cardType)
	const positionShort = getPositionShort(player.position)

	return (
		<Link
			to={`/players/${player.id}`}
			className='group relative block w-full max-w-[280px]'
		>
			{/* Card Container */}
			<div
				className={cn(
					'relative aspect-[2/3] rounded-2xl bg-gradient-to-br p-4 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-amber-500/50',
					cardGradient
				)}
			>
				{/* Inner Card */}
				<div className='relative flex h-full flex-col rounded-xl border-2 border-amber-900/30 bg-gradient-to-br from-black/40 to-black/60 p-4 backdrop-blur-sm'>
					{/* Header: Rating & Position */}
					<div className='mb-2 flex items-start justify-between'>
						<div className='text-center'>
							<div className='text-4xl font-black text-amber-100 drop-shadow-lg'>
								{player.rating}
							</div>
							<div className='text-sm font-bold uppercase tracking-wider text-amber-200'>
								{positionShort}
							</div>
						</div>
						<div className='flex flex-col items-end gap-1'>
							<div className='text-2xl'>{player.nationality}</div>
							<div className='flex gap-0.5'>
								{Array.from({ length: player.weakFoot }).map((_, i) => (
									<span key={i} className='text-xs text-amber-300'>
										⭐
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Player Photo */}
					<div className='mb-3 flex flex-1 items-center justify-center'>
						<div className='text-7xl drop-shadow-2xl'>{player.photo}</div>
					</div>

					{/* Player Name */}
					<div className='mb-3 text-center'>
						<div className='text-xl font-black uppercase tracking-wide text-amber-100 drop-shadow-lg'>
							{player.name}
						</div>
						{teamName && (
							<div className='text-xs font-medium text-amber-200/80'>
								{teamName}
							</div>
						)}
					</div>

					{/* Attributes Grid */}
					<div className='grid grid-cols-3 gap-2 border-t border-amber-900/50 pt-3'>
						<AttributeStat label='PAC' value={player.attributes.pace} />
						<AttributeStat label='SHO' value={player.attributes.shooting} />
						<AttributeStat label='PAS' value={player.attributes.passing} />
						<AttributeStat label='DRI' value={player.attributes.dribbling} />
						<AttributeStat label='DEF' value={player.attributes.defending} />
						<AttributeStat label='PHY' value={player.attributes.physical} />
					</div>

					{/* Skill Moves */}
					<div className='mt-2 flex justify-center gap-0.5 border-t border-amber-900/50 pt-2'>
						{Array.from({ length: player.skillMoves }).map((_, i) => (
							<span key={i} className='text-xs text-amber-300'>
								⚡
							</span>
						))}
					</div>
				</div>

				{/* Card Shine Effect */}
				<div className='pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
			</div>
		</Link>
	)
}

type AttributeStatProps = {
	label: string
	value: number
}

function AttributeStat({ label, value }: AttributeStatProps) {
	return (
		<div className='flex flex-col items-center'>
			<div className='text-lg font-bold text-amber-100'>{value}</div>
			<div className='text-[10px] font-semibold uppercase tracking-wider text-amber-300/80'>
				{label}
			</div>
		</div>
	)
}

