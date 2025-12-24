# 📦 Services Architektur

## 📁 Struktur

```
src/services/
├── football_data/
│   ├── football_data.service.ts        # ⚙️ Basis API Calls
│   ├── football_data.loader.server.ts  # 🔒 Loader Functions (Cache Management)
│   ├── football_data.hooks.ts          # 🪝 React Hooks für Components
│   └── football_data.types.ts          # 📝 TypeScript Types
│
├── player/
│   ├── player.service.ts               # ⚙️ Player API
│   ├── player.loader.server.ts         # 🔒 Player Loader Functions
│   ├── player.hooks.ts                 # 🪝 Player Hooks
│   └── player.types.ts                 # 📝 Player Types
│
└── team/
    ├── team.service.ts                 # ⚙️ Team API
    ├── team.loader.server.ts           # 🔒 Team Loader Functions
    └── team.types.ts                   # 📝 Team Types
```

## 🎯 Datei-Typen

### ⚙️ `.service.ts` - API Layer

**Zweck:** Rohe API Calls  
**Genutzt von:** `.loader.server.ts` und `.hooks.ts`  
**Hat Zugriff auf:** `fetch`, API URLs, Headers

```typescript
// football_data.service.ts
export const getTeam = async (teamId: number) => {
	const response = await fetch(`/api/football-data/teams/${teamId}`)
	return response.json()
}
```

### 🔒 `.loader.server.ts` - Loader Layer

**Zweck:** Daten laden & cachen (vor Component Render)  
**Genutzt von:** React Router Loaders  
**Hat Zugriff auf:** `.service.ts`, `queryClient`

```typescript
// football_data.loader.server.ts
export const loadTeam = async (teamId: number) => {
	const data = await getTeam(teamId)
	queryClient.setQueryData(['team', teamId], data)
	return data
}
```

### 🪝 `.hooks.ts` - React Hooks Layer

**Zweck:** TanStack Query Hooks für Components  
**Genutzt von:** React Components  
**Hat Zugriff auf:** `.service.ts`, `useQuery`

```typescript
// football_data.hooks.ts
export const useTeam = (teamId: number) => {
	return useQuery({
		queryKey: ['team', teamId],
		queryFn: () => getTeam(teamId),
	})
}
```

### 📝 `.types.ts` - TypeScript Types

**Zweck:** Shared Types für alle Layer  
**Genutzt von:** Alle anderen Dateien

```typescript
// football_data.types.ts
export type Team = {
	id: number
	name: string
	// ...
}
```

## 🔄 Data Flow

```
┌──────────────────────────────────────────────────────┐
│ 1. Route aufrufen (z.B. /api-test)                  │
└──────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────┐
│ 2. React Router Loader läuft                         │
│    import { loadTeam } from '.loader.server'         │
│    await loadTeam(5)                                 │
└──────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────┐
│ 3. .loader.server.ts                                 │
│    - Ruft .service.ts (API Call)                     │
│    - Speichert in queryClient.setQueryData()         │
└──────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────┐
│ 4. Component rendert                                 │
│    const { data } = useTeam(5)                       │
└──────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────┐
│ 5. .hooks.ts (useQuery)                              │
│    - Liest aus TanStack Query Cache                  │
│    - Daten sind sofort da! (Loader hat sie geladen)  │
└──────────────────────────────────────────────────────┘
```

## ✅ Vorteile dieser Struktur

### 1. **Saubere Trennung**

- Service = API Calls
- Loader = Cache Management
- Hooks = React Integration

### 2. **Wiederverwendbar**

```typescript
// Gleiche loadTeam() in mehreren Loadern nutzen
export const dashboardLoader = () => loadTeam(5)
export const teamPageLoader = () => loadTeam(5)
```

### 3. **Testbar**

```typescript
// Services mocken
vi.mock('./football_data.service')

// Loader Functions testen
await loadTeam(5)
expect(queryClient.getQueryData(['team', 5])).toBeDefined()
```

### 4. **Type-Safe**

```typescript
// Volle TypeScript Unterstützung überall
const team: Team = await loadTeam(5)
```

## 🚀 Wie neue Services hinzufügen?

### Schritt 1: `.service.ts` erstellen

```typescript
// src/services/competition/competition.service.ts
export const getCompetition = async (code: string) => {
	const response = await fetch(`/api/football-data/competitions/${code}`)
	return response.json()
}
```

### Schritt 2: `.loader.server.ts` erstellen

```typescript
// src/services/competition/competition.loader.server.ts
import { queryClient } from '@/main'
import { getCompetition } from './competition.service'

export const loadCompetition = async (code: string) => {
	const data = await getCompetition(code)
	queryClient.setQueryData(['competition', code], data)
	return data
}
```

### Schritt 3: `.hooks.ts` erstellen

```typescript
// src/services/competition/competition.hooks.ts
import { useQuery } from '@tanstack/react-query'
import { getCompetition } from './competition.service'

export const useCompetition = (code: string) => {
	return useQuery({
		queryKey: ['competition', code],
		queryFn: () => getCompetition(code),
	})
}
```

### Schritt 4: In Loader nutzen

```typescript
// src/routes/competition/competition.loader.ts
import { loadCompetition } from '@/services/competition/competition.loader.server'

export const competitionLoader = async () => {
	await loadCompetition('BL1')
	return null
}
```

### Schritt 5: In Component nutzen

```typescript
// src/routes/competition/route.tsx
import { useCompetition } from '@/services/competition/competition.hooks'

export default function CompetitionPage() {
	const { data } = useCompetition('BL1')
	return <div>{data.name}</div>
}
```

## 📚 Weitere Docs

- [`LOADER_SERVER_PATTERN.md`](../../LOADER_SERVER_PATTERN.md) - Detaillierte Pattern-Erklärung
- [`CACHING_STRATEGY.md`](../../CACHING_STRATEGY.md) - TanStack Query Caching
- [`TANSTACK_QUERY_GUIDE.md`](../../TANSTACK_QUERY_GUIDE.md) - TanStack Query Basics

Happy Coding! 🚀⚽

