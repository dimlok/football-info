import { useSettings } from '@/contexts/settings_context'
import { useTheme } from '@/contexts/theme_context'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Settings Modal Component
 * Zentrales Einstellungs-Modal mit Theme & Sprache
 *
 * Features:
 * - Dark Mode (Light/Dark/System)
 * - Sprachauswahl (DE/EN/RU)
 * - Barrierefreiheit (Keyboard Navigation, ARIA Labels)
 * - Schließen via ESC, Background-Click oder Close-Button
 */
export default function SettingsModal() {
	const { t, i18n } = useTranslation()
	const { isSettingsOpen, closeSettings, updateSettings } = useSettings()
	const { theme, effectiveTheme, setTheme } = useTheme()

	// ESC key & Body scroll lock
	useEffect(() => {
		if (!isSettingsOpen) {
			return
		}

		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeSettings()
			}
		}

		document.addEventListener('keydown', handleEsc)
		document.body.style.overflow = 'hidden'

		return () => {
			document.removeEventListener('keydown', handleEsc)
			document.body.style.overflow = 'unset'
		}
	}, [isSettingsOpen, closeSettings])

	if (!isSettingsOpen) {
		return null
	}

	// Theme ändern
	const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
		setTheme(newTheme)
		updateSettings({ theme: newTheme })
	}

	// Sprache ändern
	const handleLanguageChange = (language: string) => {
		i18n.changeLanguage(language)
		updateSettings({ language })
	}

	const languages = [
		{ code: 'de', label: 'Deutsch', flag: '🇩🇪' },
		{ code: 'en', label: 'English', flag: '🇬🇧' },
		{ code: 'ru', label: 'Русский', flag: '🇷🇺' },
	]

	const themes: Array<{
		value: 'light' | 'dark' | 'system'
		label: string
		icon: string
	}> = [
		{ value: 'light', label: t('settings.theme.light'), icon: '☀️' },
		{ value: 'dark', label: t('settings.theme.dark'), icon: '🌙' },
		{ value: 'system', label: t('settings.theme.system'), icon: '💻' },
	]

	return (
		<>
			{/* Overlay */}
			<div className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm dark:bg-black/60' />

			{/* Modal Container */}
			<div
				className='fixed inset-0 z-50 flex items-center justify-center p-4'
				onClick={closeSettings}
			>
				{/* Modal Content */}
				<div
					className='relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950'
					onClick={e => e.stopPropagation()}
					role='dialog'
					aria-modal='true'
					aria-labelledby='settings-title'
				>
					{/* Header */}
					<div className='sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950/95'>
						<div className='flex items-center justify-between'>
							<h2
								id='settings-title'
								className='text-xl font-bold text-gray-900 dark:text-white'
							>
								⚙️ {t('settings.title')}
							</h2>

							{/* Close Button */}
							<button
								onClick={closeSettings}
								className='rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
								aria-label={t('settings.close')}
							>
								<svg
									className='h-6 w-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Content */}
					<div className='p-6 space-y-8'>
						{/* Theme Section */}
						<section>
							<h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400'>
								{t('settings.theme.title')}
							</h3>

							<div className='grid grid-cols-3 gap-3'>
								{themes.map(themeOption => (
									<button
										key={themeOption.value}
										onClick={() => handleThemeChange(themeOption.value)}
										className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
											theme === themeOption.value
												? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950/30 dark:text-white'
												: 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50 dark:hover:text-white'
										}`}
										aria-label={`${t('settings.theme.title')}: ${
											themeOption.label
										}`}
										aria-pressed={theme === themeOption.value}
									>
										<span className='text-2xl' aria-hidden='true'>
											{themeOption.icon}
										</span>
										<span className='text-xs font-medium'>
											{themeOption.label}
										</span>
										{theme === themeOption.value && (
											<span className='sr-only'>{t('settings.selected')}</span>
										)}
									</button>
								))}
							</div>

							{/* Current Theme Info */}
							<p className='mt-3 text-center text-xs text-gray-500 dark:text-zinc-500'>
								{t('settings.theme.current')}:{' '}
								<span className='font-semibold text-gray-700 dark:text-zinc-300'>
									{effectiveTheme === 'dark'
										? t('settings.theme.dark')
										: t('settings.theme.light')}
								</span>
							</p>
						</section>

						{/* Language Section */}
						<section>
							<h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400'>
								{t('settings.language.title')}
							</h3>

							<div className='space-y-2'>
								{languages.map(lang => (
									<button
										key={lang.code}
										onClick={() => handleLanguageChange(lang.code)}
										className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
											i18n.language === lang.code
												? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950/30 dark:text-white'
												: 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50 dark:hover:text-white'
										}`}
										aria-label={`${t('settings.language.title')}: ${
											lang.label
										}`}
										aria-pressed={i18n.language === lang.code}
									>
										<span className='text-2xl' aria-hidden='true'>
											{lang.flag}
										</span>
										<span className='flex-1 text-left font-medium'>
											{lang.label}
										</span>
										{i18n.language === lang.code && (
											<>
												<svg
													className='h-5 w-5 text-blue-500'
													fill='currentColor'
													viewBox='0 0 20 20'
													aria-hidden='true'
												>
													<path
														fillRule='evenodd'
														d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
														clipRule='evenodd'
													/>
												</svg>
												<span className='sr-only'>
													{t('settings.selected')}
												</span>
											</>
										)}
									</button>
								))}
							</div>
						</section>

						{/* Info Section */}
						<section className='rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900/30'>
							<p className='text-xs text-gray-600 dark:text-zinc-500'>
								{t('settings.info')}
							</p>
						</section>
					</div>
				</div>
			</div>
		</>
	)
}

