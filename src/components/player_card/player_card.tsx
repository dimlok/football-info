import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import type { PlayerCardProps } from './player_card.types'

// Nationalflaggen Mapping (häufigste Länder)
const countryFlags: Record<string, string> = {
	Germany: '🇩🇪',
	England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
	Spain: '🇪🇸',
	France: '🇫🇷',
	Italy: '🇮🇹',
	Portugal: '🇵🇹',
	Brazil: '🇧🇷',
	Argentina: '🇦🇷',
	Netherlands: '🇳🇱',
	Belgium: '🇧🇪',
	Croatia: '🇭🇷',
	Poland: '🇵🇱',
	Denmark: '🇩🇰',
	Sweden: '🇸🇪',
	Norway: '🇳🇴',
	Austria: '🇦🇹',
	Switzerland: '🇨🇭',
	Serbia: '🇷🇸',
	Ukraine: '🇺🇦',
	Turkey: '🇹🇷',
	Morocco: '🇲🇦',
	Senegal: '🇸🇳',
	Uruguay: '🇺🇾',
	Colombia: '🇨🇴',
	Mexico: '🇲🇽',
	Japan: '🇯🇵',
	'Korea Republic': '🇰🇷',
	Russia: '🇷🇺',
	Ecuador: '🇪🇨',
}

// Position-Farben
const positionColors: Record<string, { bg: string; text: string }> = {
	Goalkeeper: {
		bg: 'bg-yellow-100 dark:bg-yellow-900/30',
		text: 'text-yellow-700 dark:text-yellow-400',
	},
	'Centre-Back': {
		bg: 'bg-blue-100 dark:bg-blue-900/30',
		text: 'text-blue-700 dark:text-blue-400',
	},
	'Left-Back': {
		bg: 'bg-blue-100 dark:bg-blue-900/30',
		text: 'text-blue-700 dark:text-blue-400',
	},
	'Right-Back': {
		bg: 'bg-blue-100 dark:bg-blue-900/30',
		text: 'text-blue-700 dark:text-blue-400',
	},
	Defence: {
		bg: 'bg-blue-100 dark:bg-blue-900/30',
		text: 'text-blue-700 dark:text-blue-400',
	},
	'Defensive Midfield': {
		bg: 'bg-green-100 dark:bg-green-900/30',
		text: 'text-green-700 dark:text-green-400',
	},
	'Central Midfield': {
		bg: 'bg-green-100 dark:bg-green-900/30',
		text: 'text-green-700 dark:text-green-400',
	},
	'Attacking Midfield': {
		bg: 'bg-purple-100 dark:bg-purple-900/30',
		text: 'text-purple-700 dark:text-purple-400',
	},
	Midfield: {
		bg: 'bg-green-100 dark:bg-green-900/30',
		text: 'text-green-700 dark:text-green-400',
	},
	'Left Winger': {
		bg: 'bg-red-100 dark:bg-red-900/30',
		text: 'text-red-700 dark:text-red-400',
	},
	'Right Winger': {
		bg: 'bg-red-100 dark:bg-red-900/30',
		text: 'text-red-700 dark:text-red-400',
	},
	'Centre-Forward': {
		bg: 'bg-red-100 dark:bg-red-900/30',
		text: 'text-red-700 dark:text-red-400',
	},
	Offence: {
		bg: 'bg-red-100 dark:bg-red-900/30',
		text: 'text-red-700 dark:text-red-400',
	},
}

// Initialen aus Namen extrahieren
const getInitials = (name: string): string => {
	const parts = name.split(' ')
	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
	}
	return name.slice(0, 2).toUpperCase()
}

// Alter berechnen
const calculateAge = (dateOfBirth: string): number => {
	const birthDate = new Date(dateOfBirth)
	const today = new Date()
	let age = today.getFullYear() - birthDate.getFullYear()
	const monthDiff = today.getMonth() - birthDate.getMonth()
	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--
	}
	return age
}

export default function PlayerCard({ player }: PlayerCardProps) {
	const { t } = useTranslation('players')
	const initials = getInitials(player.name)
	const age = calculateAge(player.dateOfBirth)
	const flag = countryFlags[player.nationality] || '🌍'
	const positionColor = positionColors[player.position] || {
		bg: 'bg-gray-100 dark:bg-gray-800',
		text: 'text-gray-700 dark:text-gray-300',
	}

	return (
		<div className='group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900'>
			{/* Header mit Team-Badge */}
			<div className='flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50'>
				<img
					src={player.teamCrest}
					alt={player.teamName}
					className='h-6 w-6 object-contain opacity-80'
					onError={e => {
						e.currentTarget.style.display = 'none'
					}}
				/>
				<span className='text-xs font-medium text-gray-500 dark:text-zinc-500'>
					{player.competitionCode || ''}
				</span>
			</div>

			{/* Player Avatar (Initialen) */}
			<div className='flex flex-col items-center px-6 py-6'>
				<div className='mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-bold text-white shadow-lg'>
					{initials}
				</div>

				{/* Name */}
				<h3 className='mb-1 text-center text-lg font-bold text-gray-900 dark:text-white'>
					{player.name}
				</h3>

				{/* Position Badge */}
				<span
					className={cn(
						'mb-3 rounded-full px-3 py-1 text-xs font-medium',
						positionColor.bg,
						positionColor.text
					)}
				>
					{player.position}
				</span>

				{/* Info Grid */}
				<div className='w-full space-y-2 border-t border-gray-100 pt-4 dark:border-zinc-800'>
					{/* Nationalität */}
					<div className='flex items-center justify-between text-sm'>
						<span className='text-gray-500 dark:text-zinc-500'>
							{t('card.country')}:
						</span>
						<span className='flex items-center gap-1.5 font-medium text-gray-900 dark:text-white'>
							<span>{flag}</span>
							<span>{player.nationality}</span>
						</span>
					</div>

					{/* Alter */}
					<div className='flex items-center justify-between text-sm'>
						<span className='text-gray-500 dark:text-zinc-500'>
							{t('card.age')}:
						</span>
						<span className='font-medium text-gray-900 dark:text-white'>
							{age} {t('card.years')}
						</span>
					</div>

					{/* Team */}
					<div className='flex items-center justify-between text-sm'>
						<span className='text-gray-500 dark:text-zinc-500'>
							{t('card.club')}:
						</span>
						<span className='truncate font-medium text-gray-900 dark:text-white'>
							{player.teamName}
						</span>
					</div>
				</div>
			</div>

			{/* Hover Effect */}
			<div className='absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100' />
		</div>
	)
}

