# 🚀 TanStack Query Integration Guide

## ✅ Setup Abgeschlossen!

TanStack Query ist eingerichtet mit automatischem Caching! 🎉

## 📚 Wie du es nutzt

### 1. Einzelnes Team laden

```typescript
import { useTeam } from '@/services/football_data/football_data.hooks'

function BayernComponent() {
	// Beim ersten Aufruf: API Request
	// Bei weiteren Aufrufen (5 Min): Aus Cache!
	const { data, isLoading, error } = useTeam(5) // Bayern München

	if (isLoading) return <div>Lädt...</div>
	if (error) return <div>Fehler!</div>

	return (
		<div>
			<h1>{data.name}</h1>
			<p>Kader: {data.squad.length} Spieler</p>
		</div>
	)
}
```

### 2. Mehrere Teams gleichzeitig

```typescript
import { useMultipleTeams } from '@/services/football_data/football_data.hooks'

function TopTeams() {
	// Lädt alle 3 Teams PARALLEL - nur 1x API Call!
	const { data: teams } = useMultipleTeams([5, 86, 81])

	return (
		<div>
			{teams?.map(team => (
				<div key={team.id}>{team.name}</div>
			))}
		</div>
	)
}
```

### 3. Liga/Competition Teams

```typescript
import { useCompetitionTeams } from '@/services/football_data/football_data.hooks'

function BundesligaTeams() {
	// Cache: 30 Minuten (Teams ändern sich selten)
	const { data } = useCompetitionTeams('BL1')

	return (
		<div>
			{data?.teams.map(team => (
				<div key={team.id}>{team.name}</div>
			))}
		</div>
	)
}
```

## 🎯 Verfügbare Hooks

| Hook                        | Beschreibung           | Cache Zeit | Beispiel                      |
| --------------------------- | ---------------------- | ---------- | ----------------------------- |
| `useTeam(id)`               | Einzelnes Team + Squad | 5 Min      | `useTeam(5)`                  |
| `usePerson(id)`             | Spieler Details        | 5 Min      | `usePerson(123)`              |
| `useCompetitionTeams(code)` | Alle Liga-Teams        | 30 Min     | `useCompetitionTeams('BL1')`  |
| `useMultipleTeams(ids[])`   | Mehrere Teams parallel | 5 Min      | `useMultipleTeams([5,86,81])` |
| `useApiConnection()`        | API Test               | 1 Min      | `useApiConnection()`          |

## 🔥 Caching Features

### Automatisch dabei:

- ✅ **Keine doppelten Requests** - Gleiche Anfrage = Cache
- ✅ **5 Minuten Fresh-Zeit** - Daten gelten als aktuell
- ✅ **10 Minuten Cache** - Danach automatisch gelöscht
- ✅ **Loading States** - `isLoading`, `isFetching`
- ✅ **Error Handling** - `error` Object
- ✅ **Retry** - 1x automatisch bei Fehler

### Beispiel Cache-Verhalten:

```typescript
// Component A
const { data } = useTeam(5) // ✅ API Request

// Component B (zur gleichen Zeit)
const { data } = useTeam(5) // ✅ AUS CACHE - kein Request!

// 5 Minuten später
const { data } = useTeam(5) // ✅ Neuer API Request

// Nochmal aufrufen
const { data } = useTeam(5) // ✅ Wieder Cache
```

## 💡 Best Practices

### 1. Loading & Error States

```typescript
const { data, isLoading, error, isFetching } = useTeam(5)

if (isLoading) {
	return <LoadingSpinner />
}

if (error) {
	return <ErrorMessage error={error} />
}

// isFetching = true wenn im Hintergrund neu geladen wird
return (
	<div>
		{isFetching && <span>Aktualisiert...</span>}
		<TeamCard team={data} />
	</div>
)
```

### 2. Abhängige Queries

```typescript
const { data: team } = useTeam(5)

// Nur laden wenn team vorhanden
const firstPlayerId = team?.squad[0]?.id
const { data: player } = usePerson(firstPlayerId!)
```

### 3. Manuelles Refetching

```typescript
const { data, refetch } = useTeam(5)

return (
	<div>
		<button onClick={() => refetch()}>Neu laden</button>
	</div>
)
```

## 🎨 Beispiel Component

Siehe: `src/components/examples/api_example.tsx`

## ⚙️ Konfiguration anpassen

In `src/main.tsx`:

```typescript
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // Ändern: Cache-Dauer
			refetchOnWindowFocus: false, // Ändern: Auto-Refetch
			retry: 1, // Ändern: Retry-Anzahl
		},
	},
})
```

## 📊 Rate Limits beachten

Football-Data.org Free Tier: **10 Requests/Minute**

✅ Mit Caching: Kein Problem!

- Erste Anfrage: API Call
- Weitere Anfragen (5 Min): Cache
- → Nur 1 Request statt 100+

## 🔍 Debugging

### DevTools (Optional):

```bash
pnpm add @tanstack/react-query-devtools
```

In `main.tsx`:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

;<QueryClientProvider client={queryClient}>
	<App />
	<ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## 🚀 Nächste Schritte

1. ✅ Teste mit Bayern München: `useTeam(5)`
2. ✅ Schaue in Browser DevTools → Network Tab
3. ✅ Lade Seite neu → Keine neuen Requests! (Cache)
4. 🔄 Baue deine Player-Seite mit echten Daten

Happy Caching! 🎯⚽

