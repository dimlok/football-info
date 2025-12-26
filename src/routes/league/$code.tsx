import {
	useCompetitionMatches,
	useCompetitionStandings,
} from '@/services/football_data/football_data.hooks'
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ArchiveTab from './components/archive_tab'
import FixturesTab from './components/fixtures_tab'
import LeagueHeader from './components/league_header'
import ResultsTab from './components/results_tab'
import SummaryTab from './components/summary_tab'
import TableTab from './components/table_tab'

type TabKey = 'summary' | 'results' | 'fixtures' | 'table' | 'archive'

const LeaguePage = () => {
	const { code = '' } = useParams<{ code: string }>()
	const [activeTab, setActiveTab] = useState<TabKey>('summary')

	// Memoized callback für Tab-Wechsel
	const handleTabChange = useCallback((tab: TabKey) => {
		setActiveTab(tab)
	}, [])

	// API Calls (nur wenn benötigt)
	const {
		data,
		isLoading: standingsLoading,
		error: standingsError,
	} = useCompetitionStandings(code)
	const { standings, season, competition } = data || {}
	const beginOfSeason = season?.startDate || '2024-08-01'
	const endOfSeason = season?.endDate || '2025-05-31'
	const { data: matches, isLoading: matchesLoading } = useCompetitionMatches(
		code,
		beginOfSeason,
		endOfSeason,
		{
			enabled: activeTab === 'results' || activeTab === 'fixtures',
		}
	)

	// Sicherer Zugriff auf matches
	const matchesList = useMemo(() => matches?.matches || [], [matches?.matches])

	if (!code) {
		return null
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-zinc-950'>
			{competition && (
				<LeagueHeader
					competition={competition}
					startDate={beginOfSeason}
					endDate={endOfSeason}
					activeTab={activeTab}
					onTabChange={handleTabChange}
				/>
			)}

			{/* Tab Content */}
			<div className='mx-auto max-w-7xl px-4 py-8'>
				{activeTab === 'summary' && (
					<SummaryTab standings={standings} isLoading={standingsLoading} />
				)}

				{activeTab === 'results' && (
					<ResultsTab matches={matchesList} isLoading={matchesLoading} />
				)}

				{activeTab === 'fixtures' && (
					<FixturesTab matches={matchesList} isLoading={matchesLoading} />
				)}

				{activeTab === 'table' && (
					<TableTab
						standings={standings}
						isLoading={standingsLoading}
						error={standingsError}
					/>
				)}

				{activeTab === 'archive' && <ArchiveTab />}
			</div>
		</div>
	)
}

export default LeaguePage
LeaguePage.displayName = 'LeaguePage' as const

