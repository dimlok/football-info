import { createContext, useContext, useState } from 'react'
import type { ThemeMode } from './theme_context'

type Settings = {
	theme: ThemeMode
	language: string
	// Erweiterbar für weitere Settings:
	// notifications: boolean
	// animations: boolean
	// etc.
}

type SettingsContextType = {
	settings: Settings
	updateSettings: (updates: Partial<Settings>) => void
	isSettingsOpen: boolean
	openSettings: () => void
	closeSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined
)

const STORAGE_KEY = 'football-app-settings'

/**
 * Settings Provider Component
 * Verwaltet alle App-Einstellungen zentral mit localStorage-Persistierung
 *
 * Features:
 * - Zentrale Settings-Verwaltung
 * - Automatische localStorage-Persistierung
 * - Modal State Management
 * - Erweiterbar für neue Settings
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
	// Initiale Settings aus localStorage laden
	const [settings, setSettings] = useState<Settings>(() => {
		if (typeof window === 'undefined') {
			return {
				theme: 'system',
				language: 'de',
			}
		}

		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				return JSON.parse(stored)
			}
		} catch (error) {
			console.error('Failed to load settings from localStorage:', error)
		}

		// Defaults
		return {
			theme: 'system',
			language: 'de',
		}
	})

	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	// Settings updaten und in localStorage speichern
	const updateSettings = (updates: Partial<Settings>) => {
		setSettings(prev => {
			const newSettings = { ...prev, ...updates }

			// In localStorage speichern
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
			} catch (error) {
				console.error('Failed to save settings to localStorage:', error)
			}

			return newSettings
		})
	}

	const openSettings = () => setIsSettingsOpen(true)
	const closeSettings = () => setIsSettingsOpen(false)

	return (
		<SettingsContext.Provider
			value={{
				settings,
				updateSettings,
				isSettingsOpen,
				openSettings,
				closeSettings,
			}}
		>
			{children}
		</SettingsContext.Provider>
	)
}

/**
 * Custom Hook um Settings Context zu nutzen
 *
 * @example
 * const { settings, updateSettings } = useSettings()
 * updateSettings({ theme: 'dark' })
 */
export function useSettings() {
	const context = useContext(SettingsContext)
	if (!context) {
		throw new Error('useSettings must be used within SettingsProvider')
	}
	return context
}

