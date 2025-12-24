import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import deTranslations from './locales/de.json'
import enTranslations from './locales/en.json'
import ruTranslations from './locales/ru.json'

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			de: { translation: deTranslations },
			en: { translation: enTranslations },
			ru: { translation: ruTranslations },
		},
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
		},
	})

export default i18n

