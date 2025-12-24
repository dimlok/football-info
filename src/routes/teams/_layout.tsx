import LanguageSwitcher from '@/components/language_switcher/language_switcher'
import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'

export default function TeamsLayout() {
	const { t } = useTranslation()

	return (
		<div className='mx-auto max-w-6xl px-4 py-10'>
			<div className='mb-6 flex items-center justify-between'>
				<Link
					to='/'
					className='text-sm text-zinc-400 transition-colors hover:text-zinc-100'
				>
					← {t('navigation.back_to_home')}
				</Link>
				<LanguageSwitcher />
			</div>
			<Outlet />
		</div>
	)
}

