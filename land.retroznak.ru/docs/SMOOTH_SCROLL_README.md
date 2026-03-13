# Lenis Smooth Scroll — Документация

Плавный скролл для проекта **land.retroznak.ru**, основанный на библиотеке [Lenis](https://lenis.darkroom.engineering/).

## 📦 Установленные компоненты

### 1. **SmoothScrollProvider**
`src/components/providers/SmoothScrollProvider.tsx`

Главный провайдер для инициализации Lenis. Обеспечивает:
- Плавный скролл с настройками easing
- Автоматическую остановку при открытии модальных окон
- Поддержку `data-lenis-prevent` атрибутов
- RAF-цикл для производительности
- Авто-ресайз при изменении размеров окна

### 2. **useSmoothScroll Hook**
`src/hooks/useSmoothScroll.ts`

Хук для программного управления скроллом:

```tsx
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

function MyComponent() {
  const { scrollTo, scrollToTop, scrollToElement } = useSmoothScroll();

  return (
    <button onClick={() => scrollToTop({ duration: 1.5 })}>
      Наверх
    </button>
  );
}
```

### 3. **CSS Стили**
`src/styles/globals.css`

Необходимые стили для корректной работы Lenis, включая:
- HTML/Body настройки
- Отключение pointer events при скролле
- Стили для `data-lenis-prevent` элементов

## 🎯 Использование

### Базовое использование

Провайдер уже подключен в `app/layout.tsx`. Smooth scroll работает автоматически на всех страницах.

### Программный скролл

```tsx
"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function MyComponent() {
  const { scrollTo, scrollToTop, scrollToElement } = useSmoothScroll();

  return (
    <div>
      {/* Скролл к конкретной позиции */}
      <button onClick={() => scrollTo(500)}>
        Прокрутить на 500px
      </button>

      {/* Скролл к элементу */}
      <button onClick={() => scrollToElement("#hero", { offset: -100 })}>
        К Hero секции
      </button>

      {/* Скролл наверх с анимацией */}
      <button onClick={() => scrollToTop({ duration: 2 })}>
        Наверх
      </button>
    </div>
  );
}
```

### Отключение smooth scroll для элементов

Добавьте атрибут `data-lenis-prevent` к элементам, где нужно отключить плавный скролл:

```tsx
<div data-lenis-prevent>
  {/* Здесь будет обычный нативный скролл */}
  <div className="overflow-y-auto h-96">
    Контент с нативным скроллом
  </div>
</div>
```

### Модальные окна

Все модальные окна уже настроены с `data-lenis-prevent`:
- `CallbackModal`
- `ConsultationModal`
- `QuestionModal`

Smooth scroll автоматически останавливается при открытии модалок благодаря `MutationObserver`.

## 🎨 Настройки

### Изменение параметров Lenis

Отредактируйте `src/components/providers/SmoothScrollProvider.tsx`:

```tsx
const lenisInstance = new Lenis({
  duration: 1,          // Длительность анимации (секунды)
  wheelMultiplier: 1,   // Множитель скорости колеса мыши
  touchMultiplier: 1.5, // Множитель для тач-устройств
  // ... другие настройки
});
```

### Оптимизация производительности

Для лучшей отзывчивости курсора и hover-эффектов, `pointer-events: none` применяется только к iframe во время скролла, а не ко всей странице.

### Добавление классов для отключения скролла

В `SmoothScrollProvider.tsx` найдите массив `preventClasses`:

```tsx
const preventClasses = [
  "modal",
  "popup",
  "drawer",
  "dialog",
  "dropdown-menu",
  // Добавьте свои классы здесь
];
```

## 🔧 API

### useSmoothScroll()

```tsx
const {
  lenis,              // Инстанс Lenis
  scrollTo,           // Скролл к позиции/элементу
  scrollToTop,        // Скролл наверх
  scrollToBottom,     // Скролл вниз
  scrollToElement,    // Скролл к элементу
  start,              // Запустить скролл
  stop,               // Остановить скролл
  getScroll,          // Получить текущую позицию
  getLimit,           // Получить максимальную позицию
  getProgress,        // Получить прогресс (0-1)
} = useSmoothScroll();
```

### ScrollToOptions

```tsx
interface ScrollToOptions {
  offset?: number;           // Смещение в пикселях
  lerp?: number;             // Интерполяция (0-1)
  duration?: number;         // Длительность анимации
  easing?: (t: number) => number; // Функция easing
  immediate?: boolean;       // Мгновенный скролл
  lock?: boolean;            // Заблокировать скролл
  force?: boolean;           // Принудительный скролл
  onComplete?: () => void;   // Callback по завершении
}
```

## 🚀 Примеры

### Кнопка "Наверх"

```tsx
"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const { scrollToTop } = useSmoothScroll();

  return (
    <button
      onClick={() => scrollToTop({ duration: 1.5 })}
      className="fixed bottom-8 right-8 p-4 bg-primary text-white rounded-full"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
}
```

### Навигация по секциям

```tsx
"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function SectionNav() {
  const { scrollToElement } = useSmoothScroll();

  const sections = [
    { id: "hero", label: "Главная" },
    { id: "products", label: "Продукты" },
    { id: "reviews", label: "Отзывы" },
  ];

  return (
    <nav>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToElement(`#${section.id}`, { offset: -100 })}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
```

### Отслеживание позиции скролла

```tsx
"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

export function ScrollProgress() {
  const { lenis } = useLenis();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      setProgress(lenis.progress);
    };

    lenis.on("scroll", handleScroll);

    return () => {
      // Lenis не имеет метода off, но очистка происходит при destroy
    };
  }, [lenis]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
```

## 🐛 Исправление проблем

### Проблема с задержкой курсора

**Проблема**: После установки Lenis курсор не сразу реагировал на hover-эффекты ссылок и кнопок.

**Причина**: CSS-правило `.lenis.lenis-scrolling { pointer-events: none }` отключало все события указателя во время скролла.

**Решение**:

1. **Удалено `pointer-events: none` для основного элемента** (`src/styles/globals.css`):

```css
/* Disable pointer events for iframes while scrolling to prevent scroll interference */
.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
```

Теперь `pointer-events: none` применяется **только к iframe**, где это действительно необходимо.

2. **Уменьшена длительность анимации** (`src/components/providers/SmoothScrollProvider.tsx`):
   - Было: `duration: 1.2`
   - Стало: `duration: 1`

**Результат**:
- ✅ Курсор мгновенно реагирует на hover-эффекты
- ✅ Smooth scroll продолжает работать плавно
- ✅ Iframe не мешают скроллу
- ✅ Улучшена общая отзывчивость интерфейса

## 📝 Заметки

- **SSR**: Провайдер использует `"use client"` и безопасен для Next.js SSR
- **Производительность**: RAF-цикл оптимизирован для 60 FPS
- **Модалки**: Автоматическая остановка скролла при `body.style.overflow = "hidden"`
- **Адаптация**: Код адаптирован из Tilda-версии с учетом React-подхода

## 🔗 Ссылки

- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [Lenis Documentation](https://lenis.darkroom.engineering/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Версия**: 1.0.1
**Дата**: 2025-10-23
**Автор**: Claude Code
