import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n/config'
import './index.css'

// TanStack Query Client mit Caching-Konfiguration
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity, // ♾️ Unendlich - Daten sind IMMER fresh
			gcTime: Infinity, // ♾️ Unendlich - Cache läuft NIE ab
			retry: 1, // 1x retry bei Fehler
			refetchOnWindowFocus: false, // Nicht neu laden bei Tab-Wechsel
		},
	},
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</React.StrictMode>
)

