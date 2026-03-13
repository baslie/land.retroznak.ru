import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import type { ContactFormSchema } from "@/validation/contactForm";
import { contactFormSchema } from "@/validation/contactForm";
import type { ContactFormResponse } from "@/types/forms";

export const runtime = "nodejs";

// =====================================================================================
// УТИЛИТЫ ДЛЯ ИЗВЛЕЧЕНИЯ ИНФОРМАЦИИ О ЗАПРОСЕ
// =====================================================================================

/**
 * Извлекает реальный IP адрес пользователя из заголовков запроса
 * Проверяет несколько заголовков, которые используют прокси и CDN
 */
function getRealUserIP(request: Request): string {
  const ipHeaders = [
    "cf-connecting-ip", // Cloudflare
    "x-real-ip", // Nginx proxy
    "x-forwarded-for", // Standard proxy header
    "x-client-ip", // Apache
  ];

  for (const header of ipHeaders) {
    const value = request.headers.get(header);
    if (value) {
      // X-Forwarded-For может содержать несколько IP через запятую
      const ips = value.split(",").map((ip) => ip.trim());
      // Берем первый валидный публичный IP
      for (const ip of ips) {
        // Базовая проверка формата IPv4
        if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
          return ip;
        }
      }
    }
  }

  // Fallback для локальной разработки
  return "127.0.0.1";
}

/**
 * Извлекает UTM метки и параметры отслеживания из URL
 */
function extractUtmParams(url: string): Record<string, string> {
  const utmParams: Record<string, string> = {};

  if (!url) {
    return utmParams;
  }

  try {
    const parsedUrl = new URL(url);
    const queryParams = parsedUrl.searchParams;

    // Маппинг UTM параметров на русские названия
    const utmKeys: Record<string, string> = {
      utm_source: "Источник",
      utm_medium: "Канал",
      utm_campaign: "Кампания",
      utm_content: "Объявление",
      utm_term: "Ключевое слово",
      gclid: "Google Click ID",
      yclid: "Yandex Click ID",
      fbclid: "Facebook Click ID",
    };

    for (const [key, label] of Object.entries(utmKeys)) {
      const value = queryParams.get(key);
      if (value) {
        utmParams[label] = value;
      }
    }
  } catch {
    // Если URL невалидный, возвращаем пустой объект
  }

  return utmParams;
}

/**
 * Собирает системную информацию о запросе
 */
interface SystemInfo {
  date: string;
  ip: string;
  referer: string;
  userAgent: string;
  utmParams: Record<string, string>;
}

function getSystemInfo(request: Request): SystemInfo {
  // Форматируем дату в томском часовом поясе
  const now = new Date();
  const tomskTime = now.toLocaleString("ru-RU", {
    timeZone: "Asia/Tomsk",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Получаем IP адрес
  const ip = getRealUserIP(request);

  // Получаем referer
  const referer = request.headers.get("referer") || "Прямой переход";

  // Получаем user-agent
  const userAgent = request.headers.get("user-agent") || "Неизвестно";

  // Извлекаем UTM параметры из referer
  const utmParams = extractUtmParams(referer);

  // Также проверяем URL самого запроса
  const requestUrl = request.url;
  const requestUtmParams = extractUtmParams(requestUrl);

  // Объединяем UTM параметры (приоритет у параметров из текущего запроса)
  const allUtmParams = { ...utmParams, ...requestUtmParams };

  return {
    date: `${tomskTime} (Томск)`,
    ip,
    referer,
    userAgent,
    utmParams: allUtmParams,
  };
}

interface MailerConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string[]; // Массив получателей
  from: string;
}

const CONTACT_REASON_LABELS: Record<string, string> = {
  callback: "Запрос обратного звонка",
  consultation: "Заявка на консультацию",
  question: "Вопрос от клиента",
  timeline: "Исторический запрос",
  order: "Заказ ретрознака",
  support: "Поддержка",
};

const MESSENGER_LABELS: Record<string, string> = {
  phone: "Телефон",
  max: "MAX",
  telegram: "Telegram",
  vk: "VK",
  youtube: "YouTube",
};

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

  // Парсим множественных получателей через запятую (как в PHP версии)
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const GROUP_LABELS: Record<string, string> = {
  lighting: "Подсветка",
  "text-style": "Стиль текста",
  steel: "Сталь",
  color: "Цвет",
  extras: "Дополнительно",
};

function formatPlainText(payload: ContactFormSchema, systemInfo: SystemInfo) {
  const lines: string[] = [];

  lines.push("=== НОВАЯ ЗАЯВКА С САЙТА ===");
  lines.push("");
  lines.push(`Тип запроса: ${CONTACT_REASON_LABELS[payload.contactReason] ?? payload.contactReason}`);
  lines.push(`Имя: ${payload.name}`);
  lines.push(`Телефон: ${payload.phone}`);

  if (payload.messenger) {
    lines.push(`Предпочтительный канал: ${MESSENGER_LABELS[payload.messenger] ?? payload.messenger}`);
  }
  if (payload.address) {
    lines.push(`Адрес или объект: ${payload.address}`);
  }
  if (payload.preferredTime) {
    lines.push(`Удобное время для связи: ${payload.preferredTime}`);
  }
  if (payload.projectType) {
    lines.push(`Тип проекта: ${payload.projectType}`);
  }
  if (payload.comment) {
    lines.push("");
    lines.push("Комментарий:");
    lines.push(payload.comment);
    lines.push("");
  }

  if (payload.productOptions) {
    lines.push("");
    lines.push("=== ВЫБРАННАЯ КОНФИГУРАЦИЯ ПРОДУКТА ===");
    lines.push(`Модель: ${payload.productOptions.productName}`);
    lines.push(`Базовая цена: ${payload.productOptions.basePrice.toLocaleString("ru-RU")} ₽`);
    lines.push("");
    lines.push("Выбранные опции:");

    // Group options by their group
    const optionsByGroup: Record<string, typeof payload.productOptions.selectedOptions> = {};
    payload.productOptions.selectedOptions.forEach((option) => {
      if (!optionsByGroup[option.group]) {
        optionsByGroup[option.group] = [];
      }
      optionsByGroup[option.group].push(option);
    });

    // Display options grouped by category
    Object.entries(optionsByGroup).forEach(([groupKey, options]) => {
      const groupLabel = GROUP_LABELS[groupKey] || groupKey;
      lines.push(`  ${groupLabel}:`);
      options.forEach((option) => {
        const priceDisplay = option.price > 0 ? ` (+${option.price.toLocaleString("ru-RU")} ₽)` : "";
        lines.push(`    • ${option.label}${priceDisplay}`);
      });
    });

    lines.push("");
    lines.push(`ИТОГОВАЯ ЦЕНА: ${payload.productOptions.totalPrice.toLocaleString("ru-RU")} ₽`);
  }

  lines.push("");
  lines.push("=== СИСТЕМНАЯ ИНФОРМАЦИЯ ===");
  lines.push(`Дата отправки: ${systemInfo.date}`);
  lines.push(`IP адрес: ${systemInfo.ip}`);
  lines.push("");
  lines.push("=== ИНФОРМАЦИЯ О ПЕРЕХОДЕ ===");
  lines.push(`Источник перехода: ${systemInfo.referer}`);

  if (Object.keys(systemInfo.utmParams).length > 0) {
    lines.push("");
    lines.push("UTM-метки:");
    for (const [label, value] of Object.entries(systemInfo.utmParams)) {
      lines.push(`  ${label}: ${value}`);
    }
  } else {
    lines.push("UTM-метки: Отсутствуют");
  }

  lines.push("");
  lines.push(`User Agent: ${systemInfo.userAgent}`);
  lines.push("");
  lines.push("Согласие на обработку данных: получено");

  return lines.join("\n");
}

/**
 * Создает строку таблицы для HTML письма
 */
function createTableRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">${label}:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; vertical-align: top;">${value}</td>
    </tr>
  `;
}

/**
 * Форматирует UTM параметры для отображения в письме
 */
function formatUtmParams(utmParams: Record<string, string>): string {
  if (Object.keys(utmParams).length === 0) {
    return '<span style="color: #888; font-style: italic;">Отсутствуют</span>';
  }

  let html = '<div style="background: #f9f9f9; padding: 10px; border-radius: 5px; margin-top: 5px;">';
  for (const [label, value] of Object.entries(utmParams)) {
    html += `<div style="margin-bottom: 5px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</div>`;
  }
  html += "</div>";

  return html;
}

/**
 * Форматирует HTML письмо в стиле оригинального PHP скрипта
 */
function formatHtml(payload: ContactFormSchema, systemInfo: SystemInfo) {
  // Основные поля формы
  let formDataRows = "";

  // Тип запроса
  formDataRows += createTableRow(
    "Тип запроса",
    escapeHtml(CONTACT_REASON_LABELS[payload.contactReason] ?? payload.contactReason),
  );

  // Имя
  formDataRows += createTableRow("Имя", escapeHtml(payload.name));

  // Телефон
  formDataRows += createTableRow("Телефон", escapeHtml(payload.phone));

  // Предпочтительный канал связи
  if (payload.messenger) {
    formDataRows += createTableRow(
      "Предпочтительный канал",
      escapeHtml(MESSENGER_LABELS[payload.messenger] ?? payload.messenger),
    );
  }

  // Адрес
  if (payload.address) {
    formDataRows += createTableRow("Адрес или объект", escapeHtml(payload.address));
  }

  // Удобное время для связи
  if (payload.preferredTime) {
    formDataRows += createTableRow("Удобное время для связи", escapeHtml(payload.preferredTime));
  }

  // Тип проекта
  if (payload.projectType) {
    formDataRows += createTableRow("Тип проекта", escapeHtml(payload.projectType));
  }

  // Комментарий (если есть)
  if (payload.comment) {
    const comment = escapeHtml(payload.comment).replace(/\n/g, "<br>");
    formDataRows += createTableRow("Комментарий", comment);
  }

  // Конфигурация продукта (если есть)
  if (payload.productOptions) {
    let productHtml = `<div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 5px;">`;
    productHtml += `<div style="margin-bottom: 10px;"><strong>Модель:</strong> ${escapeHtml(payload.productOptions.productName)}</div>`;
    productHtml += `<div style="margin-bottom: 10px;"><strong>Базовая цена:</strong> ${payload.productOptions.basePrice.toLocaleString("ru-RU")} ₽</div>`;
    productHtml += `<div style="margin-top: 15px; margin-bottom: 10px;"><strong>Выбранные опции:</strong></div>`;

    // Group options by their group
    const optionsByGroup: Record<string, typeof payload.productOptions.selectedOptions> = {};
    payload.productOptions.selectedOptions.forEach((option) => {
      if (!optionsByGroup[option.group]) {
        optionsByGroup[option.group] = [];
      }
      optionsByGroup[option.group].push(option);
    });

    // Display options grouped by category
    Object.entries(optionsByGroup).forEach(([groupKey, options]) => {
      const groupLabel = GROUP_LABELS[groupKey] || groupKey;
      productHtml += `<div style="margin-left: 10px; margin-bottom: 10px;">`;
      productHtml += `<div style="font-weight: bold; color: #555; margin-bottom: 5px;">${escapeHtml(groupLabel)}:</div>`;
      options.forEach((option) => {
        const priceDisplay = option.price > 0 ? ` <span style="color: #d97706;">(+${option.price.toLocaleString("ru-RU")} ₽)</span>` : "";
        productHtml += `<div style="margin-left: 15px; margin-bottom: 3px;">• ${escapeHtml(option.label)}${priceDisplay}</div>`;
      });
      productHtml += `</div>`;
    });

    productHtml += `<div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 16px;"><strong>ИТОГОВАЯ ЦЕНА:</strong> <span style="color: #d97706; font-weight: bold;">${payload.productOptions.totalPrice.toLocaleString("ru-RU")} ₽</span></div>`;
    productHtml += `</div>`;

    formDataRows += createTableRow("Конфигурация продукта", productHtml);
  }

  // Системная информация
  formDataRows += createTableRow("Дата отправки", escapeHtml(systemInfo.date));
  formDataRows += createTableRow("IP адрес", escapeHtml(systemInfo.ip));

  // Секция с информацией о переходе
  let referralRows = "";
  referralRows += createTableRow("Источник перехода", escapeHtml(systemInfo.referer));
  referralRows += createTableRow("UTM-метки и параметры", formatUtmParams(systemInfo.utmParams));
  referralRows += createTableRow("User Agent", escapeHtml(systemInfo.userAgent));

  return `
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <h2>Новая заявка с сайта</h2>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        ${formDataRows}
      </table>

      <h3 style="margin-top: 20px;">Информация о переходе</h3>
      <table style="border-collapse: collapse; width: 100%;">
        ${referralRows}
      </table>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
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

  // Собираем системную информацию о запросе
  const systemInfo = getSystemInfo(request);

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

    // Отправляем письма всем получателям (как в PHP версии)
    const emailPromises = config.to.map((recipient) =>
      transporter.sendMail({
        from: config.from,
        to: recipient,
        subject: `Retroznak · ${CONTACT_REASON_LABELS[payload.contactReason] ?? "Новая заявка"}`,
        text: formatPlainText(payload, systemInfo),
        html: formatHtml(payload, systemInfo),
      }),
    );

    const results = await Promise.all(emailPromises);

    // Log preview URL for Ethereal Email testing (только для первого письма)
    const previewUrl = nodemailer.getTestMessageUrl(results[0]);
    if (previewUrl) {
      console.log("\n📧 ════════════════════════════════════════════════");
      console.log("   Письмо успешно отправлено!");
      console.log(`   Получателей: ${config.to.length}`);
      console.log(`   Email: ${config.to.join(", ")}`);
      console.log("   Preview URL:", previewUrl);
      console.log("   ════════════════════════════════════════════════\n");
    }

    const response: ContactFormResponse = {
      success: true,
      message: "Спасибо! Заявка успешно отправлена. Мы свяжемся с вами в течение 2 часов.",
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
