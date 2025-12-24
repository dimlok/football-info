# ♾️ Unendliches Caching mit TanStack Query

## 🎯 Übersicht

Die App nutzt **TanStack Query** mit **unendlichem Cache** für optimale Performance:

- ✅ Daten werden **1x** geladen, dann **für immer** gecached
- ✅ **React Router Loader** prefetched Daten auf dem Server
- ✅ **Keine unnötigen API-Calls** mehr
- ✅ **Sofortige Navigation** zwischen Seiten

## 📦 Konfiguration

### `src/main.tsx`

```typescript
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity, // ♾️ Daten sind IMMER fresh
			gcTime: Infinity, // ♾️ Cache läuft NIE ab
			retry: 1, // 1x retry bei Fehler
			refetchOnWindowFocus: false, // Kein Refetch bei Tab-Wechsel
		},
	},
})
```

## 🔄 Workflow: Loader + TanStack Query

### 1. **Route mit Loader definieren** (`App.tsx`)

```typescript
{
  path: '/api-test',
  element: <ApiExample />,
  loader: apiExampleLoader,  // ← Prefetch hier!
}
```

### 2. **Loader prefetched Daten** (`api_example.loader.ts`)

```typescript
export const apiExampleLoader = async () => {
	// Daten prefetchen BEVOR Component rendert
	await queryClient.prefetchQuery({
		queryKey: ['team', 5],
		queryFn: () => getTeam(5),
	})

	return null
}
```

### 3. **Component nutzt Hook** (`api_example.tsx`)

```typescript
export default function ApiExample() {
	// Daten kommen aus dem Cache!
	const { data, isLoading } = useTeam(5)

	// isLoading = false (Daten sind schon da)
	// Kein API Call mehr nötig!
}
```

## 🚀 Vorteile

### ✅ Performance

- **Keine Ladezeiten** - Daten sind sofort da
- **Keine API-Kosten** - Nur 1x laden, dann Cache
- **Instant Navigation** - Keine Wartezeiten zwischen Seiten

### ✅ User Experience

- **Kein Flackern** - Keine Loading-States
- **Smooth Navigation** - Sofortige Seitenwechsel
- **Offline-fähig** - Cache bleibt bestehen

### ✅ Developer Experience

- **Einfach zu nutzen** - Loader + Hook = Fertig
- **Automatisch optimiert** - TanStack Query handled alles
- **Type-safe** - TypeScript Support

## 🔥 Best Practices

### 1. **Prefetch in Loaders**

```typescript
// ✅ GOOD: Prefetch im Loader
export const loader = async () => {
	await queryClient.prefetchQuery({
		queryKey: ['teams'],
		queryFn: getTeams,
	})
	return null
}

// ❌ BAD: Kein Prefetch → Ladezeit in Component
export const loader = async () => {
	return null
}
```

### 2. **Gleiche queryKey nutzen**

```typescript
// Loader
await queryClient.prefetchQuery({
	queryKey: ['team', 5], // ← Wichtig!
	queryFn: () => getTeam(5),
})

// Hook
const { data } = useQuery({
	queryKey: ['team', 5], // ← Gleiche Key!
	queryFn: () => getTeam(5),
})
```

### 3. **Mehrere Daten parallel prefetchen**

```typescript
export const loader = async () => {
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ['team', 5],
			queryFn: () => getTeam(5),
		}),
		queryClient.prefetchQuery({
			queryKey: ['team', 86],
			queryFn: () => getTeam(86),
		}),
	])
	return null
}
```

## 🎯 Wann Cache invalidieren?

Da der Cache **unendlich** ist, musst du aktiv invalidieren wenn nötig:

### Manual Refetch

```typescript
const { refetch } = useTeam(5)

// Bei Button-Click neu laden
<button onClick={() => refetch()}>
  Neu laden
</button>
```

### Cache Invalidierung

```typescript
import { queryClient } from '@/main'

// Einzelne Query invalidieren
queryClient.invalidateQueries({ queryKey: ['team', 5] })

// Alle Teams invalidieren
queryClient.invalidateQueries({ queryKey: ['team'] })

// Alles invalidieren
queryClient.invalidateQueries()
```

## 📊 Cache Debugging

### React Query DevTools

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
;<QueryClientProvider client={queryClient}>
	<App />
	<ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

Öffne die DevTools (rechts unten):

- ✅ Siehst du alle gecachten Queries
- ✅ Timestamps
- ✅ Status (fresh, stale, fetching)

## 🔧 Cache-Zeiten anpassen

Falls du doch zeitbasiertes Caching willst:

```typescript
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 Minuten
			gcTime: 10 * 60 * 1000, // 10 Minuten
		},
	},
})
```

## 💡 Zusammenfassung

```
Route aufrufen → Loader prefetched → TanStack Query cached
                                    ↓
Component rendert → Hook holt aus Cache → Sofort da! ✅
                                    ↓
Erneuter Besuch → Cache noch da → Kein API Call! 🎉
```

**Ergebnis:** Schnellste App ever! 🚀⚽

