# Отправка заявок с формы на почту (Next.js + Nodemailer)

Документация по реализации отправки заявок с лендинга на email через SMTP.

## Содержание

1. [Архитектура](#архитектура)
2. [Зависимости](#зависимости)
3. [Переменные окружения](#переменные-окружения)
4. [API эндпоинт](#api-эндпоинт)
5. [Клиентская функция отправки](#клиентская-функция-отправки)
6. [Валидация (Zod)](#валидация-zod)
7. [Типы](#типы)
8. [Инструкция по интеграции](#инструкция-по-интеграции)

---

## Архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│  Браузер                                                        │
│  ┌──────────────┐                                               │
│  │  Форма       │                                               │
│  │  (React)     │                                               │
│  └──────┬───────┘                                               │
│         │ submitContactForm()                                   │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │  Zod         │  ← Валидация на клиенте (опционально)         │
│  └──────┬───────┘                                               │
└─────────┼───────────────────────────────────────────────────────┘
          │ POST /api/forms/contact
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Сервер (Next.js API Route)                                     │
│  ┌──────────────┐                                               │
│  │  Zod         │  ← Валидация на сервере                       │
│  └──────┬───────┘                                               │
│         │                                                       │
│  ┌──────▼───────┐    ┌────────────────┐                         │
│  │  Nodemailer  │───►│  SMTP Beget    │───► Получатели          │
│  └──────────────┘    └────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Зависимости

```bash
npm install nodemailer zod
npm install -D @types/nodemailer
```

Версии из проекта:
- `nodemailer`: ^7.0.6
- `zod`: ^4.1.11
- `@types/nodemailer`: ^7.0.1

---

## Переменные окружения

Создайте файл `.env.local` в корне проекта:

```bash
# SMTP настройки для Beget
SMTP_HOST=smtp.beget.com
SMTP_PORT=465
SMTP_USER=info@yourdomain.ru
SMTP_PASSWORD=your_password
MAIL_FROM=info@yourdomain.ru
MAIL_TO=recipient1@gmail.com,recipient2@mail.ru
```

| Переменная     | Описание                                        |
| -------------- | ----------------------------------------------- |
| `SMTP_HOST`    | Адрес SMTP сервера                              |
| `SMTP_PORT`    | Порт (465 для SSL, 587 для TLS)                 |
| `SMTP_USER`    | Логин почтового ящика                           |
| `SMTP_PASSWORD`| Пароль от почтового ящика                       |
| `MAIL_FROM`    | Адрес отправителя (обычно = SMTP_USER)          |
| `MAIL_TO`      | Получатели через запятую                        |
| `SMTP_SECURE`  | (опционально) `true`/`false`, auto по порту     |

---

## API эндпоинт

Создайте файл `app/api/forms/contact/route.ts`:

```typescript
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import type { ContactFormSchema } from "@/validation/contactForm";
import { contactFormSchema } from "@/validation/contactForm";
import type { ContactFormResponse } from "@/types/forms";

export const runtime = "nodejs";

// =====================================================================================
// КОНФИГУРАЦИЯ SMTP
// =====================================================================================

interface MailerConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string[];
  from: string;
}

function resolveMailerConfig(): MailerConfig | null {
  const host = process.env.SMTP_HOST;
  const portString = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const toRaw = process.env.MAIL_TO;
  const from = process.env.MAIL_FROM ?? user;
  const secureFlag = process.env.SMTP_SECURE;

  if (!host || !portString || !user || !pass || !toRaw || !from) {
    return null;
  }

  // Парсим множественных получателей через запятую
  const to = toRaw
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  if (to.length === 0) {
    return null;
  }

  const port = Number.parseInt(portString, 10);
  const secure = secureFlag ? secureFlag === "true" : port === 465;

  return {
    host,
    port: Number.isFinite(port) ? port : 587,
    secure,
    user,
    pass,
    to,
    from,
  };
}

// =====================================================================================
// УТИЛИТЫ
// =====================================================================================

/**
 * Получает реальный IP пользователя из заголовков
 */
function getRealUserIP(request: Request): string {
  const ipHeaders = [
    "cf-connecting-ip", // Cloudflare
    "x-real-ip",        // Nginx proxy
    "x-forwarded-for",  // Standard proxy header
    "x-client-ip",      // Apache
  ];

  for (const header of ipHeaders) {
    const value = request.headers.get(header);
    if (value) {
      const ips = value.split(",").map((ip) => ip.trim());
      for (const ip of ips) {
        if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
          return ip;
        }
      }
    }
  }

  return "127.0.0.1";
}

/**
 * Извлекает UTM метки из URL
 */
function extractUtmParams(url: string): Record<string, string> {
  const utmParams: Record<string, string> = {};

  if (!url) return utmParams;

  try {
    const parsedUrl = new URL(url);
    const queryParams = parsedUrl.searchParams;

    const utmKeys: Record<string, string> = {
      utm_source: "Источник",
      utm_medium: "Канал",
      utm_campaign: "Кампания",
      utm_content: "Объявление",
      utm_term: "Ключевое слово",
      gclid: "Google Click ID",
      yclid: "Yandex Click ID",
    };

    for (const [key, label] of Object.entries(utmKeys)) {
      const value = queryParams.get(key);
      if (value) {
        utmParams[label] = value;
      }
    }
  } catch {
    // Невалидный URL
  }

  return utmParams;
}

interface SystemInfo {
  date: string;
  ip: string;
  referer: string;
  userAgent: string;
  utmParams: Record<string, string>;
}

function getSystemInfo(request: Request): SystemInfo {
  const now = new Date();
  const formattedDate = now.toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow", // Укажите свой часовой пояс
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const ip = getRealUserIP(request);
  const referer = request.headers.get("referer") || "Прямой переход";
  const userAgent = request.headers.get("user-agent") || "Неизвестно";
  const utmParams = extractUtmParams(referer);

  return {
    date: `${formattedDate} (Москва)`,
    ip,
    referer,
    userAgent,
    utmParams,
  };
}

// =====================================================================================
// ФОРМАТИРОВАНИЕ ПИСЬМА
// =====================================================================================

const CONTACT_REASON_LABELS: Record<string, string> = {
  callback: "Запрос обратного звонка",
  consultation: "Заявка на консультацию",
  question: "Вопрос от клиента",
  order: "Заказ",
  support: "Поддержка",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPlainText(payload: ContactFormSchema, systemInfo: SystemInfo) {
  const lines: string[] = [];

  lines.push("=== НОВАЯ ЗАЯВКА С САЙТА ===");
  lines.push("");
  lines.push(`Тип запроса: ${CONTACT_REASON_LABELS[payload.contactReason] ?? payload.contactReason}`);
  lines.push(`Имя: ${payload.name}`);
  lines.push(`Телефон: ${payload.phone}`);

  if (payload.comment) {
    lines.push("");
    lines.push("Комментарий:");
    lines.push(payload.comment);
  }

  lines.push("");
  lines.push("=== СИСТЕМНАЯ ИНФОРМАЦИЯ ===");
  lines.push(`Дата отправки: ${systemInfo.date}`);
  lines.push(`IP адрес: ${systemInfo.ip}`);
  lines.push(`Источник: ${systemInfo.referer}`);

  if (Object.keys(systemInfo.utmParams).length > 0) {
    lines.push("");
    lines.push("UTM-метки:");
    for (const [label, value] of Object.entries(systemInfo.utmParams)) {
      lines.push(`  ${label}: ${value}`);
    }
  }

  lines.push("");
  lines.push("Согласие на обработку данных: получено");

  return lines.join("\n");
}

function formatHtml(payload: ContactFormSchema, systemInfo: SystemInfo) {
  return `
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <h2>Новая заявка с сайта</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Тип запроса:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(CONTACT_REASON_LABELS[payload.contactReason] ?? payload.contactReason)}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Имя:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(payload.name)}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Телефон:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(payload.phone)}</td>
        </tr>
        ${payload.comment ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Комментарий:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(payload.comment).replace(/\n/g, "<br>")}</td>
        </tr>
        ` : ""}
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Дата:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(systemInfo.date)}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">IP:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(systemInfo.ip)}</td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// =====================================================================================
// ОБРАБОТЧИК POST ЗАПРОСА
// =====================================================================================

export async function POST(request: Request) {
  // Парсим JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const response: ContactFormResponse = {
      success: false,
      message: "Некорректный формат запроса",
      error: "Request body must be valid JSON",
      statusCode: 400,
    };
    return NextResponse.json(response, { status: 400 });
  }

  // Валидация через Zod
  let payload: ContactFormSchema;
  try {
    payload = contactFormSchema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      const response: ContactFormResponse = {
        success: false,
        message: "Проверьте корректность заполнения формы",
        error: error.flatten().formErrors.join("; "),
        statusCode: 400,
      };
      return NextResponse.json(response, { status: 400 });
    }
    const response: ContactFormResponse = {
      success: false,
      message: "Произошла ошибка при обработке данных",
      error: error instanceof Error ? error.message : "Unknown error",
      statusCode: 400,
    };
    return NextResponse.json(response, { status: 400 });
  }

  // Получаем конфигурацию SMTP
  const config = resolveMailerConfig();
  if (!config) {
    const response: ContactFormResponse = {
      success: false,
      message: "Сервис недоступен",
      error: "Mailer configuration is not complete",
      statusCode: 500,
    };
    return NextResponse.json(response, { status: 500 });
  }

  // Собираем системную информацию
  const systemInfo = getSystemInfo(request);

  // Отправляем письмо
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    // Отправляем всем получателям параллельно
    const emailPromises = config.to.map((recipient) =>
      transporter.sendMail({
        from: config.from,
        to: recipient,
        subject: `Заявка с сайта · ${CONTACT_REASON_LABELS[payload.contactReason] ?? "Новая заявка"}`,
        text: formatPlainText(payload, systemInfo),
        html: formatHtml(payload, systemInfo),
      }),
    );

    await Promise.all(emailPromises);

    const response: ContactFormResponse = {
      success: true,
      message: "Спасибо! Заявка успешно отправлена.",
      statusCode: 200,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Ошибка отправки письма:", error);
    const response: ContactFormResponse = {
      success: false,
      message: "Не удалось отправить заявку. Попробуйте позже.",
      error: error instanceof Error ? error.message : "Unknown mailer error",
      statusCode: 500,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
```

---

## Клиентская функция отправки

Создайте файл `src/lib/mailer.ts`:

```typescript
import type { ContactFormPayload, ContactFormResponse } from "@/types/forms";

export interface SubmitContactFormOptions {
  endpoint?: string;
  headers?: HeadersInit;
}

const DEFAULT_ENDPOINT = "/api/forms/contact";

export async function submitContactForm(
  payload: ContactFormPayload,
  options: SubmitContactFormOptions = {}
): Promise<ContactFormResponse> {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Не удалось отправить заявку",
        error: `Request failed with status ${response.status}`,
        statusCode: response.status,
      };
    }

    const data = (await response.json().catch(() => null)) as
      | Partial<ContactFormResponse>
      | null;

    return {
      success: data?.success ?? true,
      message: data?.message ?? "Спасибо! Мы свяжемся с вами в ближайшее время.",
      error: data?.error,
      statusCode: data?.statusCode ?? response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: "Произошла ошибка при отправке. Попробуйте ещё раз позже.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
```

---

## Валидация (Zod)

Создайте файл `src/validation/contactForm.ts`:

```typescript
import { z } from "zod";

// Типы причин обращения - настройте под свой проект
export const CONTACT_REASONS = [
  "callback",
  "consultation",
  "question",
  "order",
  "support",
] as const;

// Вспомогательные функции валидации
function requiredTrimmedString(fieldName: string, options: { min: number; max: number }) {
  const { min, max } = options;
  return z
    .string()
    .trim()
    .min(min, { message: `${fieldName} должно содержать не менее ${min} символов` })
    .max(max, { message: `${fieldName} должно содержать не более ${max} символов` });
}

function optionalTrimmedString(fieldName: string, options: { min?: number; max?: number }) {
  const { min, max } = options;
  return z
    .union([z.string(), z.undefined(), z.null()])
    .transform((value) => {
      if (typeof value !== "string") return undefined;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    })
    .superRefine((value, ctx) => {
      if (!value) return;
      if (typeof min === "number" && value.length < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} должно содержать не менее ${min} символов`,
        });
      }
      if (typeof max === "number" && value.length > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} должно содержать не более ${max} символов`,
        });
      }
    });
}

const consentSchema = z
  .union([z.boolean(), z.undefined(), z.null()])
  .transform((value) => value === true)
  .refine((value) => value === true, {
    message: "Необходимо согласиться с обработкой персональных данных",
  });

export const contactFormSchema = z.object({
  name: requiredTrimmedString("Имя", { min: 2, max: 120 }),
  phone: requiredTrimmedString("Телефон", { min: 5, max: 32 }),
  contactReason: z.enum(CONTACT_REASONS),
  comment: optionalTrimmedString("Комментарий", { max: 1200 }),
  consent: consentSchema,
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
```

---

## Типы

Создайте файл `src/types/forms.ts`:

```typescript
export const CONTACT_REASONS = [
  "callback",
  "consultation",
  "question",
  "order",
  "support",
] as const;

export type ContactReason = (typeof CONTACT_REASONS)[number];

export interface ContactFormPayload {
  name: string;
  phone: string;
  contactReason: ContactReason;
  comment?: string;
  consent: boolean;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
  statusCode?: number;
}
```

---

## Инструкция по интеграции

### Шаг 1: Установка зависимостей

```bash
npm install nodemailer zod
npm install -D @types/nodemailer
```

### Шаг 2: Создание файлов

1. `src/types/forms.ts` - типы данных
2. `src/validation/contactForm.ts` - Zod схема
3. `src/lib/mailer.ts` - клиентская функция
4. `app/api/forms/contact/route.ts` - API эндпоинт

### Шаг 3: Настройка окружения

Создайте `.env.local`:

```bash
SMTP_HOST=smtp.beget.com
SMTP_PORT=465
SMTP_USER=info@yourdomain.ru
SMTP_PASSWORD=your_password
MAIL_FROM=info@yourdomain.ru
MAIL_TO=recipient@gmail.com
```

Добавьте `.env.local` в `.gitignore`.

### Шаг 4: Настройка tsconfig.json

Убедитесь, что настроен алиас `@/`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Шаг 5: Использование в компоненте

```tsx
"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/mailer";
import type { ContactFormPayload } from "@/types/forms";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);

    const payload: ContactFormPayload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      contactReason: "callback",
      comment: formData.get("comment") as string | undefined,
      consent: formData.get("consent") === "on",
    };

    const result = await submitContactForm(payload);

    setStatus(result.success ? "success" : "error");
    setMessage(result.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Имя" required />
      <input name="phone" type="tel" placeholder="Телефон" required />
      <textarea name="comment" placeholder="Комментарий" />
      <label>
        <input name="consent" type="checkbox" required />
        Согласен на обработку данных
      </label>
      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Отправка..." : "Отправить"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

### Шаг 6: Тестирование

Для тестирования без реального SMTP используйте [Ethereal Email](https://ethereal.email/):

```bash
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_ethereal_user
SMTP_PASSWORD=your_ethereal_password
MAIL_FROM=your_ethereal_user
MAIL_TO=your_ethereal_user
```

---

## Особенности Beget

1. **Порт 465** - SSL/TLS соединение (рекомендуется)
2. **Порт 587** - STARTTLS (альтернатива)
3. **Отправитель** - должен совпадать с почтовым ящиком на хостинге
4. **Множественные получатели** - через запятую в `MAIL_TO`

---

## Безопасность

1. Никогда не коммитьте `.env.local` в Git
2. Установите права доступа `600` на файл окружения
3. Используйте отдельный почтовый ящик для рассылки
4. Валидируйте данные на сервере (Zod)
5. Экранируйте HTML в письмах (`escapeHtml`)
