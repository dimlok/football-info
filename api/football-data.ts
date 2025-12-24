import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Vercel Serverless Function - Football Data API Proxy
 *
 * Löst CORS-Probleme indem API Calls server-side gemacht werden
 *
 * Usage:
 * - GET /api/football-data?path=/competitions
 * - GET /api/football-data?path=/teams/5
 * - GET /api/football-data?path=/persons/44
 */

const FOOTBALL_DATA_API = 'https://api.football-data.org/v4'

export default async function handler(req: VercelRequest, res: VercelResponse) {
	// CORS Headers für Browser-Zugriff
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

	// OPTIONS Request (Preflight)
	if (req.method === 'OPTIONS') {
		return res.status(200).end()
	}

	// Nur GET erlauben
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const { path } = req.query

	if (!path || typeof path !== 'string') {
		return res.status(400).json({
			error: 'Missing path parameter',
			example: '/api/football-data?path=/competitions',
		})
	}

	// API Key aus Environment Variable
	const apiKey = process.env.FOOTBALL_DATA_API_KEY

	if (!apiKey) {
		console.error('❌ FOOTBALL_DATA_API_KEY not configured')
		return res.status(500).json({
			error: 'API Key not configured',
			hint: 'Set FOOTBALL_DATA_API_KEY in Vercel Environment Variables',
		})
	}

	try {
		const url = `${FOOTBALL_DATA_API}${path}`
		console.log(`📡 Proxying request to: ${url}`)

		const response = await fetch(url, {
			headers: {
				'X-Auth-Token': apiKey,
			},
		})

		// Rate Limit Headers weitergeben
		const rateLimitHeaders = {
			'X-Requests-Available-Minute':
				response.headers.get('X-Requests-Available-Minute') || '',
			'X-RequestCounter-Reset':
				response.headers.get('X-RequestCounter-Reset') || '',
		}

		Object.entries(rateLimitHeaders).forEach(([key, value]) => {
			if (value) {
				res.setHeader(key, value)
			}
		})

		// Fehler von Football Data API weitergeben
		if (!response.ok) {
			const errorText = await response.text()
			console.error(`❌ Football Data API Error ${response.status}:`, errorText)
			return res.status(response.status).json({
				error: `Football Data API Error: ${response.statusText}`,
				details: errorText,
			})
		}

		const data = await response.json()
		return res.status(200).json(data)
	} catch (error) {
		console.error('❌ Proxy Error:', error)
		return res.status(500).json({
			error: 'Proxy request failed',
			message: error instanceof Error ? error.message : 'Unknown error',
		})
	}
}

