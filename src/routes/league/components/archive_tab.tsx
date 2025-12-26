import { memo } from 'react'

function ArchiveTab() {
	return (
		<div className='rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900'>
			<div className='mb-4 text-6xl'>📁</div>
			<h2 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
				Archiv
			</h2>
			<p className='text-gray-600 dark:text-zinc-400'>
				Historische Daten werden hier angezeigt
			</p>
		</div>
	)
}

export default memo(ArchiveTab)

