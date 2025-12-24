# 🔌 API Integration - Später echte Daten holen

## Aktueller Stand

✅ Mock-Daten mit FIFA-Attributen  
✅ FIFA Card Component  
✅ Service Layer vorbereitet  
✅ Alles funktioniert lokal

## 🎯 Nächste Schritte für echte API-Daten

### 1. API auswählen

**Empfohlene APIs:**

- **FutAPI** (https://docs.futapi.app) - Kostenlos nach Registrierung
- **FutDB** (https://futdatabase.com) - Free Tier verfügbar
- **EA Sports FC Web App** - Offizielle Daten (komplex)

### 2. API Key setup

```bash
# .env.local erstellen
VITE_API_BASE_URL=https://api.futapi.app/v1
VITE_API_KEY=dein_api_key_hier
```

### 3. Service Layer aktualisieren

Datei: `src/services/player/player.service.ts`

```typescript
// Alle TODOs auskommentieren und durch echte API calls ersetzen:

export const getAllPlayers = async (): Promise<Player[]> => {
	const response = await fetch(`${API_BASE_URL}/players`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		throw new Error('Failed to fetch players')
	}

	const data = await response.json()

	// API-Daten zu unserem Format transformieren
	return data.map(transformApiPlayer)
}
```

### 4. Data Transformation

```typescript
// API Daten → Unser Player Format
function transformApiPlayer(apiPlayer: any): Player {
	return {
		id: apiPlayer.id || apiPlayer.playerId,
		name: apiPlayer.name || apiPlayer.commonName,
		position: mapPosition(apiPlayer.position),
		rating: apiPlayer.rating || apiPlayer.overallRating,
		attributes: {
			pace: apiPlayer.pace,
			shooting: apiPlayer.shooting,
			passing: apiPlayer.passing,
			dribbling: apiPlayer.dribbling,
			defending: apiPlayer.defending,
			physical: apiPlayer.physicality,
		},
		// ... rest mappings
	}
}
```

### 5. Error Handling & Loading States

```typescript
// In Components:
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
	getAllPlayers()
		.then(setPlayers)
		.catch(err => setError(err.message))
		.finally(() => setLoading(false))
}, [])
```

### 6. Caching (Optional aber empfohlen)

```typescript
// Mit React Query oder SWR:
import { useQuery } from '@tanstack/react-query'

const {
	data: players,
	isLoading,
	error,
} = useQuery({
	queryKey: ['players'],
	queryFn: getAllPlayers,
	staleTime: 5 * 60 * 1000, // 5 Minuten Cache
})
```

## 📝 Wichtige Notizen

- **Mock-Daten nicht löschen!** Behalte sie als Fallback
- **Environment Variables** nie in Git committen
- **Rate Limits** der API beachten
- **Bilder**: Meiste APIs haben eigene CDN-URLs für Player-Fotos
- **TypeScript**: API-Response-Types definieren

## 🎨 FIFA Card Anpassungen

Falls die API andere Bildformate liefert:

```typescript
// fifa_card.tsx anpassen:
<div className='player-photo'>
	{player.imageUrl ? (
		<img src={player.imageUrl} alt={player.name} />
	) : (
		<div className='text-7xl'>{player.photo}</div>
	)}
</div>
```

## ✅ Checkliste für Live-Gang

- [ ] API Key besorgt
- [ ] `.env.local` erstellt
- [ ] Service Layer aktualisiert
- [ ] Data Transformation getestet
- [ ] Error Handling implementiert
- [ ] Loading States hinzugefügt
- [ ] Caching eingerichtet (optional)
- [ ] Bilder funktionieren
- [ ] Rate Limits beachtet

Viel Erfolg! 🚀⚽

