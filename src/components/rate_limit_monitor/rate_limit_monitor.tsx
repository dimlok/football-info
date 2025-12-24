import { useEffect, useState } from 'react'
import {
	addRateLimitListener,
	type RateLimitInfo,
} from './rate_limit_monitor.utils'

/**
 * Rate Limit Monitor Component
 * Zeigt API Rate Limit Status visuell an
 */
export default function RateLimitMonitor() {
	const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null)

	useEffect(() => {
		const cleanup = addRateLimitListener(setRateLimitInfo)
		return cleanup
	}, [])

	if (!rateLimitInfo) {
		return null
	}

	const percentage = (rateLimitInfo.remaining / rateLimitInfo.total) * 100
	const isLow = rateLimitInfo.remaining <= 3
	const isWarning = rateLimitInfo.remaining <= 5

	return (
		<div
			className={`fixed bottom-4 right-4 rounded-lg border p-4 shadow-lg ${
				isLow
					? 'border-red-500 bg-red-950/90'
					: isWarning
					? 'border-yellow-500 bg-yellow-950/90'
					: 'border-green-500 bg-green-950/90'
			}`}
		>
			<div className='mb-2 flex items-center gap-2'>
				<span className='text-xl'>
					{isLow ? '🚫' : isWarning ? '⚠️' : '✅'}
				</span>
				<span className='font-semibold text-zinc-100'>API Rate Limit</span>
			</div>

			<div className='mb-2 text-sm text-zinc-300'>
				<div className='flex justify-between'>
					<span>Requests übrig:</span>
					<span className='font-bold'>
						{rateLimitInfo.remaining} / {rateLimitInfo.total}
					</span>
				</div>
				<div className='flex justify-between'>
					<span>Reset in:</span>
					<span className='font-bold'>{rateLimitInfo.resetIn}s</span>
				</div>
			</div>

			{/* Progress Bar */}
			<div className='h-2 overflow-hidden rounded-full bg-zinc-800'>
				<div
					className={`h-full transition-all duration-300 ${
						isLow ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
					}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>

			{isLow && (
				<div className='mt-2 text-xs text-red-300'>
					⚠️ Warte {rateLimitInfo.resetIn}s bevor du weitere Requests machst!
				</div>
			)}
		</div>
	)
}

