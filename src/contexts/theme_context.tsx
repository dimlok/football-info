import { createContext, useContext, useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

type ThemeContextType = {
	theme: ThemeMode
	effectiveTheme: 'light' | 'dark'
	setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Theme Provider Component
 * Verwaltet Theme-Modus (Light/Dark/System) mit localStorage-Persistierung
 *
 * Features:
 * - Unterstützt Light, Dark und System (folgt OS-Einstellung)
 * - Persistiert Theme in localStorage
 * - Erkennt prefers-color-scheme für System-Modus
 * - Setzt automatisch 'dark' class auf <html> Element
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
	// Initiales Theme aus localStorage oder 'system' als Fallback
	const [theme, setThemeState] = useState<ThemeMode>(() => {
		if (typeof window === 'undefined') {
			return 'system'
		}
		const stored = localStorage.getItem('theme') as ThemeMode
		return stored || 'system'
	})

	// Effektives Theme berechnen (system → light/dark)
	const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark')

	// Funktion um Theme zu setzen
	const setTheme = (newTheme: ThemeMode) => {
		setThemeState(newTheme)
		localStorage.setItem('theme', newTheme)
	}

	// Berechne effektives Theme basierend auf theme & prefers-color-scheme
	useEffect(() => {
		const calculateEffectiveTheme = (): 'light' | 'dark' => {
			if (theme === 'system') {
				// Prüfe OS-Einstellung
				if (
					typeof window !== 'undefined' &&
					window.matchMedia('(prefers-color-scheme: dark)').matches
				) {
					return 'dark'
				}
				return 'light'
			}
			return theme
		}

		const updateTheme = () => {
			const effective = calculateEffectiveTheme()
			setEffectiveTheme(effective)

			// Setze 'dark' class auf <html> für Tailwind
			if (effective === 'dark') {
				document.documentElement.classList.add('dark')
			} else {
				document.documentElement.classList.remove('dark')
			}
		}

		updateTheme()

		// Listen for OS theme changes (nur wenn theme === 'system')
		if (theme === 'system') {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
			const handleChange = () => updateTheme()

			// Modern browsers
			mediaQuery.addEventListener('change', handleChange)

			return () => {
				mediaQuery.removeEventListener('change', handleChange)
			}
		}
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

/**
 * Custom Hook um Theme Context zu nutzen
 *
 * @example
 * const { theme, effectiveTheme, setTheme } = useTheme()
 * setTheme('dark')
 */
export function useTheme() {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider')
	}
	return context
}

