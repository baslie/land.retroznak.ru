# Ретрознак — демо-портфолио

Демо-портфолио: лендинг и конструктор адресных табличек для компании «Ретрознак».

**Live-демо:** [baslie.github.io/land.retroznak.ru](https://baslie.github.io/land.retroznak.ru/)

## Структура репозитория

```
.
├── land.retroznak.ru/              # Лендинг компании (Next.js)
├── constructor.retroznak.ru/       # Конструктор табличек (Next.js)
├── constructor.retroznak.ru-astro/ # Конструктор табличек (Astro 6) ← актуальная демо-версия
└── README.md
```

## Технологии

- **Astro 6** — статическая генерация актуальной демо-версии
- **React 19** — интерактивные компоненты (конструктор на Canvas)
- **Tailwind CSS 4** — стилизация
- **TypeScript** — типизация
- **Framer Motion** — анимации
- **HTML5 Canvas** — визуализация табличек в реальном времени

## Быстрый старт

```bash
# Клонировать репозиторий
git clone https://github.com/baslie/land.retroznak.ru.git
cd land.retroznak.ru

# Запустить Astro-конструктор (актуальная демо-версия)
cd constructor.retroznak.ru-astro
npm install
npm run dev
```

## Проекты

### constructor.retroznak.ru-astro — Конструктор (Astro)

Актуальная демо-версия конструктора адресных табличек. Развёрнута на GitHub Pages.

Возможности:
- Выбор стиля таблички (Ленинградский, Петроградский, Мини)
- Настройка надписей (улица, номер дома)
- Выбор материала и цветов по RAL
- Опции: подсветка, рельеф, фотореле
- Предпросмотр на Canvas в реальном времени

### land.retroznak.ru — Лендинг (Next.js)

Лендинг компании: каталог продукции, фотогалерея, отзывы, FAQ, формы обратной связи.

### constructor.retroznak.ru — Конструктор (Next.js)

Предыдущая версия конструктора на Next.js.

## Лицензия

MIT

2025–2026 Ретрознак
