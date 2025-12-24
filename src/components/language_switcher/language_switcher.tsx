import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
	{ code: 'de', label: 'Deutsch', flag: '🇩🇪' },
	{ code: 'en', label: 'English', flag: '🇬🇧' },
	{ code: 'ru', label: 'Русский', flag: '🇷🇺' },
]

export default function LanguageSwitcher() {
	const { i18n } = useTranslation()

	const handleLanguageChange = (langCode: string) => {
		i18n.changeLanguage(langCode)
	}

	return (
		<div className='flex gap-2 rounded-full bg-zinc-900 p-1'>
			{LANGUAGES.map(lang => (
				<button
					key={lang.code}
					onClick={() => {
						handleLanguageChange(lang.code)
					}}
					className={cn(
						'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
						i18n.language === lang.code
							? 'bg-zinc-100 text-red-500'
							: 'text-zinc-400 hover:text-zinc-100'
					)}
					aria-label={`Switch to ${lang.label}`}
					tabIndex={0}
				>
					<span className='text-lg'>{lang.flag}</span>
					<span>{lang.label}</span>
				</button>
			))}
		</div>
	)
}

