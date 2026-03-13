# Руководство по типографике

Этот документ описывает правила работы с типографом в проекте для обеспечения консистентной русской типографики на всём сайте.

## Зачем нужен типограф?

Типограф автоматически исправляет типографические ошибки в русском тексте:

- **Неразрывные пробелы** — предлоги (в, на, от, к) не отрываются от следующего слова
- **Правильные кавычки** — «ёлочки» вместо "прямых"
- **Тире вместо дефиса** — корректное использование en-dash (–) и em-dash (—)
- **Пунктуация** — правильные пробелы вокруг знаков препинания

**До типографа:**
```
Мы работаем с 9:00 до 18:00 в будни - звоните!
```

**После типографа:**
```
Мы работаем с 9:00 до 18:00 в будни — звоните!
```

## Инфраструктура

### 1. Библиотека типографа

**Файл:** `src/lib/typograf.ts`

```typescript
import { typograf } from "@/lib/typograf";

const text = typograf("Привет мир - это тест");
// Результат: "Привет мир — это тест"
```

#### `typografContent()` — для content файлов

Рекурсивно применяет типограф ко всем строкам в объекте:

```typescript
import { typografContent } from "@/lib/typograf";

export const myContent = typografContent({
  title: "Заголовок секции",
  subtitle: "Подзаголовок с - дефисом",
  items: [
    { name: "Элемент 1", description: "Описание элемента" },
    { name: "Элемент 2", description: "Ещё одно описание" }
  ]
});
// Все строки будут обработаны типографом
```

### 2. Централизованный словарь

**Файл:** `src/content/common.ts`

Для часто используемых фраз используйте `commonTexts`:

```typescript
import { commonTexts } from "@/content/common";

<h3>{commonTexts.contacts}</h3>
<p>{commonTexts.workingHours}</p>
<button>{commonTexts.submit}</button>
```

Доступные тексты:
- Навигация: `backToHome`, `documents`, `contacts`, `mainNavigation`
- Разделы: `catalog`, `faq`, `reviews`, `photoGallery`, `ourWorkshop`
- Кнопки: `submit`, `sending`, `sent`, `readMore`, `readLess`
- Формы: `formErrorMessage`, `formSuccessTitle`, `formConsentLabel`
- CTA блоки: `ctaReady`, `ctaArchive`, `ctaQuestion`

### 3. React хук

**Файл:** `src/hooks/useTypograf.ts`

```typescript
import { useTypograf } from "@/hooks/useTypograf";

function MyComponent() {
  const title = useTypograf("Заголовок страницы - с тире");
  return <h1>{title}</h1>;
}
```

### 4. React компонент

**Файл:** `src/components/ui/Typography.tsx`

```tsx
import { Typography } from "@/components/ui/Typography";

function MyComponent() {
  return (
    <Typography as="h1" className="text-4xl">
      Заголовок с автоматической типографикой
    </Typography>
  );
}
```

### 5. Безопасная обработка HTML

**Файл:** `src/lib/sanitize.ts`

Для контента с HTML (например, FAQ с ссылками):

```typescript
import { typografSafe } from "@/lib/sanitize";

const htmlContent = typografSafe('<p>Ответ с <a href="#">ссылкой</a></p>');
// Типограф + DOMPurify для безопасности
```

## Когда использовать каждый подход?

### `useTypograf()` — для статического текста

Используйте для текста, который редко меняется:

```tsx
function HeroSection() {
  const title = useTypograf("Добро пожаловать на сайт");
  const subtitle = useTypograf("Мы создаём качественные продукты");

  return (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
```

**Преимущества:**
- Мемоизация с `useMemo` — вычисляется один раз
- Подходит для компонентов верхнего уровня

### `typograf()` — для динамического текста

Используйте внутри циклов и для динамических данных:

```tsx
function BlogList({ posts }) {
  return (
    <ul>
      {posts.map((post) => {
        const title = typograf(post.title);
        const excerpt = typograf(post.excerpt);

        return (
          <li key={post.id}>
            <h2>{title}</h2>
            <p>{excerpt}</p>
          </li>
        );
      })}
    </ul>
  );
}
```

**Преимущества:**
- Не создаёт лишние хуки в циклах
- Применяется непосредственно к данным

### `<Typography>` — для простого JSX

Используйте для удобства в JSX:

```tsx
function Card() {
  return (
    <div>
      <Typography as="h3" className="font-bold">
        Заголовок карточки
      </Typography>
      <Typography as="p" className="text-gray-600">
        Описание с автоматической типографикой
      </Typography>
    </div>
  );
}
```

**Преимущества:**
- Короткий синтаксис
- Встроенная поддержка dev-режима (подсветка ошибок)
- Поддержка HTML с `html` пропом

### `typografSafe()` — для HTML контента

Используйте для контента с HTML-разметкой:

```tsx
function FAQItem({ answer }) {
  const safeAnswer = typografSafe(answer);

  return (
    <div dangerouslySetInnerHTML={{ __html: safeAnswer }} />
  );
}
```

**Преимущества:**
- Применяет типограф + санитизацию DOMPurify
- Защита от XSS-атак
- Безопасно для пользовательского контента

## Автоматические проверки

### ESLint правило

Кастомное правило `@local/require-typograf` предупреждает о русском тексте без типографа:

```tsx
// ❌ ESLint предупредит
<h1>Привет мир - это текст</h1>

// ✅ Правильно
import { useTypograf } from "@/hooks/useTypograf";

const title = useTypograf("Привет мир - это текст");
<h1>{title}</h1>
```

### Скрипт проверки

Запустите вручную для проверки всего проекта:

```bash
npm run check-typography
```

Скрипт найдёт:
- Файлы с русским текстом без импорта типографа
- Подозрительные паттерны (дефис вместо тире, прямые кавычки)

### Pre-commit хук

При каждом коммите автоматически запускается:
1. `npm run check-typography` — проверка типографики
2. `npm run lint` — ESLint проверка

Если обнаружены проблемы, вы получите предупреждение.

## Dev-режим с подсветкой

Компонент `<Typography>` подсвечивает проблемы в режиме разработки:

```tsx
<Typography as="p">
  Текст с - дефисом вместо тире
</Typography>
// В dev-режиме покажет красную рамку + tooltip
```

Отключить подсветку для конкретного компонента:

```tsx
<Typography noDevHighlight>
  Текст без подсветки
</Typography>
```

## Частые ошибки

### ❌ Ручные неразрывные пробелы

```tsx
// Плохо — ручной неразрывный пробел
const title = "Спасибо за\u00A0заявку!";
```

```tsx
// Хорошо — типограф сделает это автоматически
const title = useTypograf("Спасибо за заявку!");
```

### ❌ Забыли импорт

```tsx
// Плохо — нет типографа
<h1>{title}</h1>
```

```tsx
// Хорошо
import { useTypograf } from "@/hooks/useTypograf";

const typografTitle = useTypograf(title);
<h1>{typografTitle}</h1>
```

### ❌ useTypograf в цикле

```tsx
// Плохо — создаёт хуки в цикле (ошибка React)
{items.map(item => {
  const title = useTypograf(item.title); // ❌
  return <h2>{title}</h2>;
})}
```

```tsx
// Хорошо — используйте функцию typograf()
import { typograf } from "@/lib/typograf";

{items.map(item => {
  const title = typograf(item.title); // ✅
  return <h2>{title}</h2>;
})}
```

## Игнорирование проверок

### ESLint

Если нужно отключить правило для файла:

```tsx
/* eslint-disable @local/require-typograf */
```

Для конкретной строки:

```tsx
{/* eslint-disable-next-line @local/require-typograf */}
<p>Текст без типографа</p>
```

### Скрипт проверки

Добавьте файл в `IGNORE_PATTERNS` в `scripts/check-typography.js`:

```javascript
const IGNORE_PATTERNS = [
  "**/node_modules/**",
  "**/.next/**",
  "**/your-file.tsx", // Добавьте сюда
];
```

## Производительность

### Мемоизация

`useTypograf` использует `useMemo`, поэтому повторные рендеры не пересчитывают текст:

```tsx
const title = useTypograf(titleFromProps);
// Пересчитывается только при изменении titleFromProps
```

### Серверный рендеринг

Типограф работает как на сервере, так и на клиенте. `typografSafe()` применяет DOMPurify только в браузере.

## Поддержка

Если у вас возникли вопросы:

1. Проверьте этот документ
2. Изучите примеры в существующих компонентах
3. Запустите `npm run check-typography` для диагностики
4. Обратитесь к команде разработки

## Полезные ссылки

- [Документация Typograf](https://github.com/typograf/typograf)
- [Правила русской типографики](https://www.artlebedev.ru/typograf/)
- [DOMPurify документация](https://github.com/cure53/DOMPurify)

---

**Версия:** 2.0
**Последнее обновление:** 2025-10-29

## Changelog

### v2.0 (2025-10-29)
- Добавлена функция `typografContent()` для автоматической обработки content объектов
- Создан централизованный словарь `commonTexts` для часто используемых фраз
- Все content файлы теперь обрабатываются типографом при экспорте
- Обновлен скрипт проверки типографии
- Исправлены хардкод тексты в компонентах
