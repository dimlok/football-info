# Vercel Deployment Guide

## 🚀 CORS-Probleme gelöst!

Die App nutzt jetzt eine **Vercel Serverless Function** als Proxy für die Football Data API.

## ✅ Setup Schritte

### 1. Vercel Project erstellen

```bash
# Falls noch nicht geschehen
vercel login
vercel
```

### 2. Environment Variables konfigurieren

Gehe zu deinem Vercel Dashboard:

- **Project Settings** → **Environment Variables**
- Füge folgende Variable hinzu:

```
FOOTBALL_DATA_API_KEY = dein_football_data_api_key
```

**Wichtig:**

- Environment: `Production`, `Preview`, `Development` alle auswählen
- Variable Name ist **FOOTBALL_DATA_API_KEY** (ohne `VITE_` Prefix!)

### 3. API Key erhalten

Falls du noch keinen API Key hast:

1. Gehe zu https://www.football-data.org/
2. Registriere dich (Free Tier reicht)
3. Kopiere deinen API Key
4. Füge ihn in Vercel Environment Variables ein

### 4. Deploy

```bash
git push origin main
```

Vercel deployed automatisch!

## 🔧 Wie es funktioniert

### Architecture

```
Browser (Frontend)
    ↓
/api/football-data (Vercel Serverless Function)
    ↓
api.football-data.org (External API)
```

### Vorteile

- ✅ **Kein CORS:** API Calls laufen server-side
- ✅ **API Key sicher:** Nicht im Frontend Code
- ✅ **Rate Limit Headers:** Werden weitergegeben
- ✅ **Automatisch:** Keine Extra-Konfiguration nötig

### Files

- `api/football-data.ts` - Vercel Serverless Function (Proxy)
- `src/services/football_data/football_data.service.ts` - Frontend Service
- `vercel.json` - Vercel Konfiguration

## 🧪 Testen

### Lokal (mit Vercel CLI)

```bash
vercel dev
```

### Production

Nach dem Deploy:

```bash
curl https://your-app.vercel.app/api/football-data?path=/competitions
```

## ⚙️ Environment Variables Übersicht

| Variable                     | Wo               | Wofür                            |
| ---------------------------- | ---------------- | -------------------------------- |
| `VITE_FOOTBALL_DATA_API_KEY` | `.env.local`     | Development (Vite Proxy)         |
| `FOOTBALL_DATA_API_KEY`      | Vercel Dashboard | Production (Serverless Function) |

## 🐛 Troubleshooting

### "API Key not configured"

→ Prüfe ob `FOOTBALL_DATA_API_KEY` in Vercel Environment Variables gesetzt ist

### "404 Not Found"

→ Stelle sicher, dass der `api/` Ordner im Git Repository ist

### Rate Limit Errors

→ Free Tier: 10 Requests/Minute. Warte 60 Sekunden.

### CORS Errors

→ Sollten jetzt weg sein! Falls nicht, prüfe Browser Console für Details.

## 📚 Links

- [Football Data API Docs](https://www.football-data.org/documentation/quickstart)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

