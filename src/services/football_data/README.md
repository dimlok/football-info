# 🌍 Football-Data.org Integration

## ✅ Setup abgeschlossen!

Dein API Key ist konfiguriert: `32c2e233776e40139f5439634c00eb74`

## 📊 Verfügbare Daten

### Top Teams & ihre IDs:

- **Bayern München**: 5
- **Real Madrid**: 86
- **Barcelona**: 81
- **Manchester United**: 66
- **Liverpool**: 64
- **PSG**: 524
- **Arsenal**: 57
- **Chelsea**: 61
- **Manchester City**: 65

### Ligen/Competitions:

- **Premier League**: `PL` oder `2021`
- **Bundesliga**: `BL1` oder `2002`
- **La Liga**: `PD` oder `2014`
- **Serie A**: `SA` oder `2019`
- **Ligue 1**: `FL1` oder `2015`
- **Champions League**: `CL` oder `2001`

## 🚀 Beispiel-Nutzung

### 1. Hole Bayern München Squad

```typescript
import { getTeam } from '@/services/football_data/football_data.service'

const bayernData = await getTeam(5)
console.log(bayernData.name) // "FC Bayern München"
console.log(bayernData.squad) // Array aller Spieler
```

### 2. Hole alle Bundesliga Teams

```typescript
import { getCompetitionTeams } from '@/services/football_data/football_data.service'

const { teams } = await getCompetitionTeams('BL1')
teams.forEach(team => {
	console.log(team.name, team.crest) // Name & Logo
})
```

### 3. Teste die Verbindung

```typescript
import { testConnection } from '@/services/football_data/football_data.service'

const isConnected = await testConnection()
console.log('API works:', isConnected)
```

## ⚠️ Rate Limits

**Free Tier:** 10 Requests pro Minute

**Tipps:**

- Caching nutzen (React Query / SWR)
- Nicht zu oft neu laden
- Daten in localStorage speichern

## 🔄 Nächste Schritte

1. **Teste die API:**

```typescript
// In einer Component oder Loader:
const data = await getTeam(5) // Bayern München
console.log(data)
```

2. **Transformiere zu deinem Format:**

```typescript
// Football-Data → Dein Player Type
const transformPlayer = (person: FootballDataPerson): Player => ({
	id: person.id.toString(),
	name: person.name,
	position: mapPosition(person.position),
	nationality: person.nationality,
	// ... etc
})
```

3. **Ersetze Mock-Daten:**
   Ändere `player.service.ts` um echte Daten zu nutzen!

## 📚 API Dokumentation

https://www.football-data.org/documentation/quickstart

## 🎯 Beispiel Teams zum Testen

```typescript
// Teste mit echten Team IDs:
await getTeam(5) // Bayern München
await getTeam(86) // Real Madrid
await getTeam(81) // Barcelona
await getTeam(64) // Liverpool
```

