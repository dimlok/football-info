import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')

	return {
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: {
			watch: {
				usePolling: true,
			},
			hmr: {
				overlay: true,
			},
			proxy: {
				'/api/football-data': {
					target: 'https://api.football-data.org/v4',
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api\/football-data/, ''),
					configure: proxy => {
						proxy.on('proxyReq', proxyReq => {
							// API Key aus .env.local hinzufügen
							proxyReq.setHeader(
								'X-Auth-Token',
								env.VITE_FOOTBALL_DATA_API_KEY || ''
							)
						})
					},
				},
			},
		},
	}
})

