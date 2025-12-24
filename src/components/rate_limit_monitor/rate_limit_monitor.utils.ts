export type RateLimitInfo = {
	remaining: number
	total: number
	resetIn: string
}

// Event Bus für Rate Limit Updates
const rateLimitEventBus = new EventTarget()

export const emitRateLimitUpdate = (info: RateLimitInfo) => {
	rateLimitEventBus.dispatchEvent(
		new CustomEvent('rateLimit', { detail: info })
	)
}

export const addRateLimitListener = (
	handler: (info: RateLimitInfo) => void
) => {
	const listener = (event: Event) => {
		const customEvent = event as CustomEvent<RateLimitInfo>
		handler(customEvent.detail)
	}

	rateLimitEventBus.addEventListener('rateLimit', listener)

	return () => {
		rateLimitEventBus.removeEventListener('rateLimit', listener)
	}
}

