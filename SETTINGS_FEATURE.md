# ⚙️ Settings Feature Dokumentation

## Überblick

Zentrales Einstellungs-System mit Dark Mode, Sprachauswahl und localStorage-Persistierung.

---

## ✨ Features

### 1. **Theme/Design-Modus**

- ☀️ **Light Mode** - Helles Design
- 🌙 **Dark Mode** - Dunkles Design (Standard)
- 💻 **System** - Folgt Betriebssystem-Einstellung (`prefers-color-scheme`)

### 2. **Sprachauswahl**

- 🇩🇪 Deutsch
- 🇬🇧 English
- 🇷🇺 Русский

### 3. **Persistenz**

- Alle Einstellungen werden automatisch in `localStorage` gespeichert
- Einstellungen bleiben nach Reload erhalten

### 4. **Barrierefreiheit**

- ✅ Keyboard-Navigation (Tab, Enter, ESC)
- ✅ ARIA Labels für Screen Reader
- ✅ Focus States für alle interaktiven Elemente
- ✅ WCAG 2.1 AA Kontrastanforderungen

---

## 🏗️ Architektur

### Context & Provider

```
ThemeProvider
├─ Theme Context (Light/Dark/System)
├─ prefers-color-scheme Detection
└─ <html class="dark"> Management

SettingsProvider
├─ Settings Context (Theme, Language, ...)
├─ localStorage Persistierung
└─ Modal State Management
```

### Components

```
components/
  settings_modal/
    └─ settings_modal.tsx        # Haupt-Modal Component

  navigation/
    └─ navigation.tsx             # Updated mit Settings Icon
```

### Contexts

```
contexts/
  theme_context.tsx               # Theme Management
  settings_context.tsx            # Settings Management
```

---

## 🎨 Design

### Dark Mode (Standard)

```css
Background: #0a0a0a, #121212, zinc-950
Text: #f9fafb, #9ca3af
Accent: Blue (#3b82f6, #60a5fa)
```

### Light Mode

```css
Background: #ffffff, #f9fafb
Text: #111827, #6b7280
Accent: Blue (#2563eb, #3b82f6)
```

### Transitions

- Smooth 150ms transitions für Theme-Wechsel
- Animiertes Zahnrad-Icon (rotation on hover)
- Fade-in Effekt beim Modal öffnen

---

## 💻 Usage

### 1. Settings öffnen

```tsx
import { useSettings } from '@/contexts/settings_context'

function MyComponent() {
	const { openSettings } = useSettings()
	return <button onClick={openSettings}>Settings</button>
}
```

### 2. Theme ändern

```tsx
import { useTheme } from '@/contexts/theme_context'

function ThemeToggle() {
	const { theme, effectiveTheme, setTheme } = useTheme()

	return (
		<button onClick={() => setTheme('dark')}>Current: {effectiveTheme}</button>
	)
}
```

### 3. Settings lesen

```tsx
import { useSettings } from '@/contexts/settings_context'

function MyComponent() {
	const { settings } = useSettings()

	console.log(settings.theme) // 'light' | 'dark' | 'system'
	console.log(settings.language) // 'de' | 'en' | 'ru'
}
```

---

## 🔌 Integration

### main.tsx

```tsx
<ThemeProvider>
	<SettingsProvider>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</SettingsProvider>
</ThemeProvider>
```

### route.tsx

```tsx
import SettingsModal from '@/components/settings_modal/settings_modal'

// ...
;<SettingsModal />
```

---

## 🌐 Internationalization

Alle Settings-Texte sind übersetzt (DE/EN/RU):

```json
{
	"settings": {
		"title": "Einstellungen",
		"theme": {
			"title": "Design-Modus",
			"light": "Hell",
			"dark": "Dunkel",
			"system": "System"
		},
		"language": {
			"title": "Sprache"
		}
	}
}
```

---

## 🚀 Erweiterung

Neue Settings hinzufügen:

### 1. Type in `settings_context.tsx` erweitern:

```tsx
type Settings = {
	theme: ThemeMode
	language: string
	notifications: boolean // ← NEU
}
```

### 2. Default-Wert hinzufügen:

```tsx
return {
	theme: 'system',
	language: 'de',
	notifications: true, // ← NEU
}
```

### 3. UI in `settings_modal.tsx` hinzufügen:

```tsx
<section>
	<h3>Notifications</h3>
	<button
		onClick={() => updateSettings({ notifications: !settings.notifications })}
	>
		Toggle
	</button>
</section>
```

---

## ✅ Akzeptanzkriterien - Erfüllt

- ✅ Einstellungen sind sichtbar (Zahnrad-Icon in Navigation)
- ✅ Sprache kann gewechselt werden (sofortige Wirkung)
- ✅ Dark Mode unterstützt Light/Dark/System
- ✅ Design entspricht Farb- & Typografie-Vorgaben
- ✅ Einstellungen bleiben nach Reload erhalten
- ✅ WCAG-Kontrastanforderungen erfüllt
- ✅ Keyboard-Navigation funktioniert
- ✅ ARIA Labels vorhanden
- ✅ Animierte Übergänge beim Theme-Wechsel
- ✅ Tooltips für Icons (via title Attribute)

---

## 🐛 Bekannte Limitierungen

### Fast Refresh Warnings

In Development Mode erscheinen Warnungen für `theme_context.tsx` und `settings_context.tsx`:

```
Fast refresh only works when a file only exports components.
```

**Grund:** Die Dateien exportieren sowohl den Context als auch Custom Hooks.  
**Lösung:** Ignorieren - hat keine Auswirkungen auf Production oder Funktionalität.

---

## 📝 Weitere Informationen

- **localStorage Key:** `football-app-settings`
- **Theme Detection:** Nutzt `window.matchMedia('(prefers-color-scheme: dark)')`
- **Tailwind Dark Mode:** Class-based (`class="dark"` auf `<html>`)
- **CSS Transitions:** 150ms für sanfte Theme-Wechsel

