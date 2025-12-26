// Shimmer component for loading state
const MatchesShimmer = ({ count = 3 }: { count?: number }) => {
	return (
		<div className='space-y-4'>
			{[...Array(count)].map((_, index) => (
				<div
					key={index}
					className='flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900'
				>
					<div className='flex-1'>
						<div className='h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-zinc-800' />
					</div>
					<div className='px-4'>
						<div className='h-7 w-12 animate-pulse rounded bg-gray-200 dark:bg-zinc-800' />
					</div>
					<div className='flex-1 text-right'>
						<div className='ml-auto h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-zinc-800' />
					</div>
				</div>
			))}
		</div>
	)
}

export default MatchesShimmer
