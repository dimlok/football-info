# 🎬 View Transitions Guide

## ✅ Установлено!

View Transitions API теперь работает в вашем приложении! 🎉

## 📱 Поддержка браузеров

| Браузер                    | Поддержка   | Результат           |
| -------------------------- | ----------- | ------------------- |
| Chrome/Edge 111+ (Desktop) | ✅ Да       | Плавные transitions |
| Chrome Android             | ✅ Да       | Плавные transitions |
| Samsung Internet           | ✅ Да       | Плавные transitions |
| Safari iOS                 | ⚠️ Fallback | Обычная навигация   |
| Safari Desktop             | ⚠️ Fallback | Обычная навигация   |
| Firefox                    | ⚠️ Fallback | Обычная навигация   |

**Важно:** На неподдерживаемых браузерах всё работает нормально, просто без анимации!

## 🚀 Как это работает

### Автоматические Transitions (уже включены!)

Благодаря CSS правилу `@view-transition { navigation: auto; }`, **все** переходы между routes автоматически анимированы!

Просто кликайте по ссылкам - transitions работают автоматически:

- Главная → Teams/Players
- Teams List → Team Detail
- Players List → Player Detail

### Анимации

**Базовая анимация:** Slide transition (300ms)

- Старая страница уходит влево с fade-out
- Новая страница приходит справа с fade-in

**На мобильных:** Быстрее (250ms) для лучшей производительности

**Accessibility:** Автоматически отключается если пользователь включил `prefers-reduced-motion`

## 💻 Использование в коде

### Вариант 1: Автоматический (рекомендуется)

Ничего делать не нужно! Все `<Link>` компоненты из React Router автоматически используют View Transitions.

```tsx
import { Link } from 'react-router-dom'

// Просто используйте обычный Link - transitions работают автоматически!
;<Link to='/teams/5'>Bayern München</Link>
```

### Вариант 2: TransitionLink (для особых случаев)

Если нужен больший контроль:

```tsx
import { TransitionLink } from '@/components/transition_link/transition_link'

// Такой же API как у обычного Link
;<TransitionLink to='/teams/5' className='...'>
	Bayern München
</TransitionLink>
```

### Вариант 3: Программная навигация

```tsx
import { useNavigate } from 'react-router-dom'
import { withViewTransition } from '@/lib/view_transitions'

function MyComponent() {
	const navigate = useNavigate()

	const handleClick = () => {
		// С View Transition
		withViewTransition(() => {
			navigate('/teams/5')
		})

		// Или без (обычная навигация)
		// navigate('/teams/5')
	}

	return <button onClick={handleClick}>Go to Bayern</button>
}
```

## 🎨 Специальные анимации для элементов

Вы можете добавить классы для создания "shared element transitions" - когда элемент плавно перетекает из одной страницы в другую.

### Пример: Логотип команды

```tsx
// На странице списка команд
<div className="team-logo-transition text-4xl">
  {team.logo}
</div>

// На странице детальной информации о команде
<div className="team-logo-transition text-7xl">
  {team.logo}
</div>
```

Логотип будет плавно увеличиваться при переходе!

### Доступные классы

| Класс                         | Использование                         |
| ----------------------------- | ------------------------------------- |
| `team-logo-transition`        | Для логотипов команд                  |
| `player-photo-transition`     | Для фото игроков                      |
| `team-card` или `player-card` | Для карточек (требует CSS переменную) |

### Кастомные transitions для карточек

```tsx
<div
	className='team-card'
	style={{ '--card-transition-name': `team-${team.id}` }}
>
	{/* Контент карточки */}
</div>
```

## ⚙️ Настройка

### Изменить длительность анимации

В `src/index.css`:

```css
::view-transition-old(root),
::view-transition-new(root) {
	animation-duration: 300ms; /* Измените здесь */
}
```

### Изменить тип анимации

Замените `slide-out-to-left` и `slide-in-from-right` на свои keyframes:

```css
@keyframes fade-out {
	to {
		opacity: 0;
	}
}

@keyframes fade-in {
	from {
		opacity: 0;
	}
}

::view-transition-old(root) {
	animation-name: fade-out;
}

::view-transition-new(root) {
	animation-name: fade-in;
}
```

### Отключить для определённых маршрутов

```tsx
<Link
	to='/teams'
	onClick={e => {
		// Отключаем View Transition для этой ссылки
		e.stopPropagation()
	}}
>
	Teams (без анимации)
</Link>
```

## 🔍 Отладка

### Проверить поддержку браузера

```tsx
import { supportsViewTransitions } from '@/lib/view_transitions'

console.log('View Transitions supported:', supportsViewTransitions())
```

### Chrome DevTools

1. Откройте Chrome DevTools (F12)
2. Перейдите на вкладку **Animations**
3. Кликните по ссылке в приложении
4. Вы увидите timeline анимации View Transition!

### Slow Motion (для отладки)

В Chrome DevTools:

1. `Ctrl+Shift+P` → "Show Animations"
2. Уменьшите скорость анимации до 10% или 25%
3. Теперь transitions будут идти медленно - удобно для отладки!

## 📊 Performance Tips

### ✅ Хорошо:

- Transitions между маршрутами
- Анимация 2-3 элементов одновременно
- Длительность 200-400ms

### ⚠️ Избегайте:

- Слишком много элементов с `view-transition-name` (>5)
- Очень длинные анимации (>500ms)
- Transitions на очень больших страницах

## 🎯 Примеры использования

### Пример 1: Список → Детали

```tsx
// teams/route.tsx - Список команд
{teams.map(team => (
  <Link key={team.id} to={`/teams/${team.id}`}>
    <div className="team-logo-transition">
      {team.logo}
    </div>
    <h3>{team.name}</h3>
  </Link>
))}

// teams/$id.tsx - Детали команды
<div className="team-logo-transition text-7xl">
  {team.logo}
</div>
<h1>{team.name}</h1>
```

### Пример 2: Навигация с состоянием

```tsx
const [isTransitioning, setIsTransitioning] = useState(false)

const handleNavigate = () => {
	setIsTransitioning(true)

	withViewTransition(() => {
		navigate('/teams/5')
		// Состояние сбросится после перехода
	})
}

return (
	<button onClick={handleNavigate} disabled={isTransitioning}>
		{isTransitioning ? 'Переход...' : 'К команде'}
	</button>
)
```

## 🐛 Troubleshooting

### Transitions не работают

1. ✅ Проверьте браузер - Chrome/Edge 111+?
2. ✅ Откройте DevTools → Console - есть ошибки?
3. ✅ Проверьте `src/index.css` - правила View Transition на месте?
4. ✅ Попробуйте Hard Refresh (Ctrl+Shift+R)

### Transitions слишком быстрые/медленные

Измените `animation-duration` в `src/index.css`:

```css
::view-transition-old(root),
::view-transition-new(root) {
	animation-duration: 500ms; /* Было 300ms */
}
```

### На iOS не работает

Это нормально! iOS Safari пока не поддерживает View Transitions. Приложение работает нормально, просто без анимации.

## 📚 Полезные ссылки

- [View Transitions API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [Can I Use - View Transitions](https://caniuse.com/view-transitions)
- [Chrome Developers Guide](https://developer.chrome.com/docs/web-platform/view-transitions/)

## 🎉 Готово!

View Transitions настроены и работают! Просто переходите между страницами и наслаждайтесь плавными анимациями! 🚀⚽

**Протестируйте:**

1. Откройте http://localhost:5174/
2. Переходите между `/teams`, `/players` и детальными страницами
3. На Chrome/Android - видите плавные transitions? ✨
4. На iOS - всё работает без анимации? ✅

Если хотите кастомизировать анимации - редактируйте `src/index.css`!

