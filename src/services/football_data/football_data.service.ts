import type {
	FootballDataCompetitionsResponse,
	FootballDataCompetitionTeamsResponse,
	FootballDataMatchesResponse,
	FootballDataPerson,
	FootballDataStandingsResponse,
	FootballDataTeamResponse,
} from './football_data.types'

const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY

/**
 * Football-Data.org API Client
 * Free Tier: 10 requests per minute
 * Docs: https://www.football-data.org/documentation/quickstart
 *
 * Development: Nutzt Vite Proxy (/api/football-data) um CORS zu umgehen
 * Production: Nutzt direkten API-Call (benötigt Backend-Proxy)
 */

const isDevelopment = import.meta.env.DEV

// In Development: Vite Proxy nutzen (kein CORS!)
// In Production: Vercel Serverless Function als Proxy
const BASE_URL = isDevelopment ? '/api/football-data' : '/api/football-data'

if (!API_KEY && isDevelopment) {
	console.warn(
		'⚠️ VITE_FOOTBALL_DATA_API_KEY fehlt in .env.local!\n' +
			'API Requests werden fehlschlagen.'
	)
}

// Headers sind leer, weil:
// - In Development: Vite Proxy fügt API Key hinzu
// - In Production: Vercel Serverless Function fügt API Key hinzu
const headers: Record<string, string> = {}

/**
 * Rate Limit Info aus Response Headers extrahieren
 * Sendet Updates an RateLimitMonitor Component
 */
const logRateLimit = (response: Response) => {
	const remaining = response.headers.get('X-Requests-Available-Minute')
	const limit = response.headers.get('X-RequestCounter-Reset')

	if (remaining) {
		const remainingNum = parseInt(remaining, 10)
		const resetIn = limit || '60'

		// Event an RateLimitMonitor senden
		if (typeof window !== 'undefined') {
			// Dynamic import um circular dependencies zu vermeiden
			import('@/components/rate_limit_monitor/rate_limit_monitor.utils').then(
				({ emitRateLimitUpdate }) => {
					emitRateLimitUpdate({
						remaining: remainingNum,
						total: 10,
						resetIn,
					})
				}
			)
		}

		// Console Logs
		if (remainingNum <= 3) {
			console.warn(
				`⚠️ Nur noch ${remainingNum} API Requests übrig! (Reset in ${resetIn}s)`
			)
		} else if (remainingNum <= 5) {
			console.log(`📊 API Limit: ${remainingNum} Requests übrig`)
		}
	}
}

/**
 * Fetch Helper mit besseren Error Messages & Rate Limit Tracking
 */
const fetchData = async <T>(endpoint: string): Promise<T> => {
	try {
		// In Production: ?path= Parameter für Vercel Function
		// In Development: Direkt den Endpoint nutzen (Vite Proxy)
		const url = isDevelopment
			? `${BASE_URL}${endpoint}`
			: `${BASE_URL}?path=${encodeURIComponent(endpoint)}`

		const response = await fetch(url, { headers })

		// Rate Limit Info loggen (vor Error Checks)
		logRateLimit(response)

		// 429 = Too Many Requests (Rate Limit erreicht)
		if (response.status === 429) {
			const resetTime = response.headers.get('X-RequestCounter-Reset')
			throw new Error(
				`🚫 API Rate Limit erreicht!\n` +
					`Free Tier: 10 Requests pro Minute\n` +
					`Warte ${resetTime || '60'} Sekunden und versuche es erneut.`
			)
		}

		// HTML Response = API Error (meistens 401, 403, etc.)
		const contentType = response.headers.get('content-type')
		if (contentType?.includes('text/html')) {
			throw new Error(
				`❌ API gibt HTML zurück (Status: ${response.status}).\n` +
					`Mögliche Ursachen:\n` +
					`- API Key ist ungültig\n` +
					`- .env.local fehlt oder falsch\n` +
					`- Server wurde nicht neu gestartet nach .env.local Änderung`
			)
		}

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(
				`API Error ${response.status}: ${response.statusText}\n${errorText}`
			)
		}

		return response.json()
	} catch (error) {
		if (error instanceof Error) {
			throw error
		}
		throw new Error(`Unbekannter Fehler: ${error}`)
	}
}

/**
 * Hole Team inkl. Squad
 * Beispiel Team IDs:
 * - Bayern München: 5
 * - Real Madrid: 86
 * - Barcelona: 81
 * - Manchester United: 66
 * - Liverpool: 64
 */
export const getTeam = async (
	teamId: number
): Promise<FootballDataTeamResponse> => {
	return fetchData<FootballDataTeamResponse>(`/teams/${teamId}`)
}

/**
 * Hole Person (Spieler) Details
 */
export const getPerson = async (
	personId: number
): Promise<FootballDataPerson> => {
	return fetchData<FootballDataPerson>(`/persons/${personId}`)
}

/**
 * Hole Teams einer Competition/Liga
 * Competition IDs:
 * - Premier League (England): PL (2021)
 * - Bundesliga (Germany): BL1 (2002)
 * - La Liga (Spain): PD (2014)
 * - Serie A (Italy): SA (2019)
 * - Ligue 1 (France): FL1 (2015)
 * - Champions League: CL (2001)
 */
export const getCompetitionTeams = async (
	competitionCode: string
): Promise<FootballDataCompetitionTeamsResponse> => {
	return fetchData<FootballDataCompetitionTeamsResponse>(
		`/competitions/${competitionCode}/teams`
	)
}

/**
 * Hole alle verfügbaren Competitions/Ligen
 */
export const getAllCompetitions =
	async (): Promise<FootballDataCompetitionsResponse> => {
		return fetchData<FootballDataCompetitionsResponse>(`/competitions`)
	}

/**
 * Hole Tabelle/Standings einer Competition
 * @param competitionCode - z.B. 'PL', 'BL1', 'PD', 'SA'
 */
export const getCompetitionStandings = async (
	competitionCode: string
): Promise<FootballDataStandingsResponse> => {
	return fetchData<FootballDataStandingsResponse>(
		`/competitions/${competitionCode}/standings`
	)
}

/**
 * Hole Matches/Spiele einer Competition
 * @param competitionCode - z.B. 'PL', 'BL1', 'PD', 'SA'
 * @param dateFrom - Start-Datum (YYYY-MM-DD)
 * @param dateTo - End-Datum (YYYY-MM-DD)
 */
export const getCompetitionMatches = async (
	competitionCode: string,
	dateFrom?: string,
	dateTo?: string
): Promise<FootballDataMatchesResponse> => {
	let endpoint = `/competitions/${competitionCode}/matches`
	const params = new URLSearchParams()

	if (dateFrom) {
		params.append('dateFrom', dateFrom)
	}
	if (dateTo) {
		params.append('dateTo', dateTo)
	}

	if (params.toString()) {
		endpoint += `?${params.toString()}`
	}

	return fetchData<FootballDataMatchesResponse>(endpoint)
}

/**
 * Test ob API funktioniert
 */
export const testConnection = async (): Promise<boolean> => {
	try {
		await fetchData(`/competitions`)
		return true
	} catch (error) {
		console.error('❌ API Connection failed:', error)
		return false
	}
}

