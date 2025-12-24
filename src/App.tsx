import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import ApiExample from './components/examples/api_example'
import { apiExampleLoader } from './components/examples/api_example.loader'
import CompetitionsPage from './routes/competitions/route'
import HomePage from './routes/route'
import PlayerDetailPage, {
	loader as playerDetailLoader,
} from './routes/players/$id'
import PlayersLayout from './routes/players/_layout'
import PlayersPage, { loader as playersLoader } from './routes/players/route'
// Alternative: import HomePage from './routes/leagues_home_compact'
import TeamDetailPage, { loader as teamDetailLoader } from './routes/teams/$id'
import TeamsLayout from './routes/teams/_layout'
import TeamsPage, { loader as teamsLoader } from './routes/teams/route'

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/api-test',
		element: <ApiExample />,
		loader: apiExampleLoader,
	},
	{
		path: '/competitions',
		element: <CompetitionsPage />,
	},
	{
		path: '/players',
		element: <PlayersLayout />,
		children: [
			{
				index: true,
				element: <PlayersPage />,
				loader: playersLoader,
			},
			{
				path: ':id',
				element: <PlayerDetailPage />,
				loader: playerDetailLoader,
			},
		],
	},
	{
		path: '/teams',
		element: <TeamsLayout />,
		children: [
			{
				index: true,
				element: <TeamsPage />,
				loader: teamsLoader,
			},
			{
				path: ':id',
				element: <TeamDetailPage />,
				loader: teamDetailLoader,
			},
		],
	},
	{
		path: '*',
		element: <div className='p-6'>404</div>,
	},
])

export default function App() {
	return <RouterProvider router={router} />
}

