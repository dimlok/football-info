# 🔒 Loader Server Pattern

## 🎯 Konzept

Saubere Trennung zwischen:

- **`.loader.server.ts`** - "Server-seitige" Daten-Logik (läuft im Loader)
- **`.hooks.ts`** - Client-seitige React Hooks (für Components)
- **`.service.ts`** - Basis API Calls (von beiden genutzt)

## 📁 Datei-Struktur

```
src/services/football_data/
├── football_data.service.ts       # API Calls (fetch)
├── football_data.loader.server.ts # Loader-spezifische Logik
├── football_data.hooks.ts         # React Hooks für Components
└── football_data.types.ts         # TypeScript Types
```

## 🔄 Workflow

### 1. **Service** - Basis API Call

```typescript
// football_data.service.ts
export const getTeam = async (teamId: number) => {
	const response = await fetch(`/api/football-data/teams/${teamId}`)
	return response.json()
}
```

### 2. **Loader Server** - Cache Management

```typescript
// football_data.loader.server.ts
import { queryClient } from '@/main'
import { getTeam } from './football_data.service'

export const loadTeam = async (teamId: number) => {
	const data = await getTeam(teamId) // API Call
	queryClient.setQueryData(['team', teamId], data) // In Cache speichern
	return data
}
```

### 3. **Loader** - Route Loader

```typescript
// route.loader.ts
import { loadTeam } from '@/services/football_data/football_data.loader.server'

export const loader = async () => {
	await loadTeam(5) // Lädt & cached Daten
	return null
}
```

### 4. **Hook** - Component nutzt Cache

```typescript
// football_data.hooks.ts
export const useTeam = (teamId: number) => {
	return useQuery({
		queryKey: ['team', teamId],
		queryFn: () => getTeam(teamId),
		// Daten sind schon da! (aus Loader)
	})
}
```

### 5. **Component** - Rendert Daten

```typescript
// Component.tsx
export default function TeamPage() {
	const { data } = useTeam(5) // Sofort aus Cache! ✅
	return <div>{data.name}</div>
}
```

## 🎯 Vorteile

### ✅ Saubere Trennung

```
Loader (vor Render)  →  .loader.server.ts  →  Daten laden & cachen
Component (render)   →  .hooks.ts          →  Daten aus Cache lesen
```

### ✅ Wiederverwendbar

```typescript
// In verschiedenen Loadern nutzen
export const teamLoader = () => loadTeam(5)
export const playerLoader = () => loadPlayer('123')
export const dashboardLoader = () => {
	await Promise.all([loadTeam(5), loadTeam(86), loadPlayer('123')])
}
```

### ✅ Type-Safe

```typescript
// Volle TypeScript Unterstützung
const team: FootballDataTeamResponse = await loadTeam(5)
```

### ✅ Testbar

```typescript
// Mock loadTeam für Tests
vi.mock('@/services/football_data/football_data.loader.server', () => ({
	loadTeam: vi.fn(() => mockTeamData),
}))
```

## 📊 Vergleich: Vorher vs. Nachher

### ❌ Vorher (ohne .loader.server)

```typescript
// route.loader.ts - Unübersichtlich
export const loader = async () => {
	const data = await getTeam(5)
	queryClient.setQueryData(['team', 5], data)

	const player = await getPlayer('123')
	queryClient.setQueryData(['player', '123'], player)

	// Cache-Logik vermischt mit Route-Logik
	return null
}
```

### ✅ Nachher (mit .loader.server)

```typescript
// route.loader.ts - Sauber & deklarativ
export const loader = async () => {
	await loadTeam(5)
	await loadPlayer('123')
	return null
}

// football_data.loader.server.ts - Wiederverwendbar
export const loadTeam = async (teamId: number) => {
	const data = await getTeam(teamId)
	queryClient.setQueryData(['team', teamId], data)
	return data
}
```

## 🚀 Best Practices

### 1. **Cache Check in .loader.server**

```typescript
export const loadTeam = async (teamId: number) => {
	// Check ob schon im Cache
	const cached = queryClient.getQueryData(['team', teamId])
	if (cached) {
		console.log(`✅ Team ${teamId} aus Cache`)
		return cached
	}

	// Sonst laden
	console.log(`📡 Team ${teamId} von API laden...`)
	const data = await getTeam(teamId)
	queryClient.setQueryData(['team', teamId], data)
	return data
}
```

### 2. **Error Handling**

```typescript
export const loadTeam = async (teamId: number) => {
	try {
		const data = await getTeam(teamId)
		queryClient.setQueryData(['team', teamId], data)
		return data
	} catch (error) {
		console.error(`Failed to load team ${teamId}:`, error)
		throw error // React Router zeigt Error Boundary
	}
}
```

### 3. **Parallel Loading**

```typescript
export const loadMultipleTeams = async (teamIds: number[]) => {
	const teams = await Promise.all(teamIds.map(id => loadTeam(id)))
	return teams
}

// Im Loader
export const loader = async () => {
	await loadMultipleTeams([5, 86, 81]) // Parallel! ⚡
	return null
}
```

### 4. **Conditional Loading**

```typescript
export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { teamId } = params

	if (teamId) {
		await loadTeam(parseInt(teamId))
	} else {
		await loadAllTeams()
	}

	return null
}
```

## 🎯 Wann welche Datei nutzen?

### `.service.ts` - Immer

Basis API Calls - von allen genutzt

```typescript
export const getTeam = async (teamId: number) => {
	return fetch(`/api/teams/${teamId}`).then(r => r.json())
}
```

### `.loader.server.ts` - Für Loader

Wenn du Daten **vor** Component Render laden willst

```typescript
export const loadTeam = async (teamId: number) => {
	const data = await getTeam(teamId)
	queryClient.setQueryData(['team', teamId], data)
	return data
}
```

### `.hooks.ts` - Für Components

Wenn du Daten **während** Component Render brauchst

```typescript
export const useTeam = (teamId: number) => {
	return useQuery({
		queryKey: ['team', teamId],
		queryFn: () => getTeam(teamId),
	})
}
```

## 💡 Zusammenfassung

```
┌─────────────────────────────────────────┐
│ Route Loader                            │
│ └─> .loader.server.ts                   │
│     └─> .service.ts (API Call)          │
│         └─> TanStack Query Cache ✅      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ Component rendert                       │
│ └─> .hooks.ts (useQuery)                │
│     └─> TanStack Query Cache (hit!)     │
│         └─> Daten sofort da! 🎉          │
└─────────────────────────────────────────┘
```

**Ergebnis:**

- ✅ Saubere Code-Struktur
- ✅ Wiederverwendbare Loader-Funktionen
- ✅ Volle TypeScript Unterstützung
- ✅ Einfach zu testen
- ✅ Keine doppelten API-Calls

Das ist das **"Loader Server Pattern"**! 🚀⚽

