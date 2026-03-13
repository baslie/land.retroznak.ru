import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

// =====================================================================================
// УТИЛИТЫ ДЛЯ ИЗВЛЕЧЕНИЯ ИНФОРМАЦИИ О ЗАПРОСЕ
// =====================================================================================

/**
 * Извлекает реальный IP адрес пользователя из заголовков запроса
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

  const ip = getRealUserIP(request);
  const referer = request.headers.get("referer") || "Прямой переход";
  const userAgent = request.headers.get("user-agent") || "Неизвестно";

  const utmParams = extractUtmParams(referer);
  const requestUrl = request.url;
  const requestUtmParams = extractUtmParams(requestUrl);
  const allUtmParams = { ...utmParams, ...requestUtmParams };

  return {
    date: `${tomskTime} (Томск)`,
    ip,
    referer,
    userAgent,
    utmParams: allUtmParams,
  };
}

// Схема валидации данных заказа из конструктора
const constructorOrderSchema = z.object({
  // Контактные данные
  name: z.string().min(2, "Укажите имя"),
  phone: z.string().min(10, "Укажите корректный телефон"),
  email: z.string().email().optional().or(z.literal("")),
  comment: z.string().optional(),
  // Параметры заказа
  signType: z.string(),
  signSize: z.string(),
  street: z.string(),
  houseNumber: z.string(),
  material: z.string(),
  roofColor: z.string(),
  plateColor: z.string(),
  hasRelief: z.boolean(),
  hasBacklight: z.boolean(),
  hasPhotoRelay: z.boolean(),
  totalPrice: z.number(),
});

type ConstructorOrderData = z.infer<typeof constructorOrderSchema>;

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

  const to = toRaw.split(",").map((email) => email.trim()).filter((email) => email.length > 0);

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPlainText(data: ConstructorOrderData, systemInfo: SystemInfo): string {
  const lines: string[] = [];

  lines.push("=== ЗАКАЗ ИЗ КОНСТРУКТОРА ===");
  lines.push("");
  lines.push("--- Контактные данные ---");
  lines.push(`Имя: ${data.name}`);
  lines.push(`Телефон: ${data.phone}`);
  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.comment) lines.push(`Комментарий: ${data.comment}`);
  lines.push("");
  lines.push("--- Параметры знака ---");
  lines.push(`Модель: ${data.signType}`);
  lines.push(`Размер: ${data.signSize}`);
  lines.push(`Улица: ${data.street || "Не указана"}`);
  lines.push(`Номер дома: ${data.houseNumber || "Не указан"}`);
  lines.push(`Материал: ${data.material}`);
  lines.push(`Цвет крыши: ${data.roofColor}`);
  lines.push(`Цвет тарелки: ${data.plateColor}`);
  lines.push("");
  lines.push("--- Опции ---");
  lines.push(`Рельефный текст: ${data.hasRelief ? "Да" : "Нет"}`);
  lines.push(`Подсветка: ${data.hasBacklight ? "Да" : "Нет"}`);
  lines.push(`Фотореле: ${data.hasPhotoRelay ? "Да" : "Нет"}`);
  lines.push("");
  lines.push(`ИТОГО: ${data.totalPrice.toLocaleString("ru-RU")} ₽`);
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

function formatHtml(data: ConstructorOrderData, systemInfo: SystemInfo): string {
  // Основные данные заказа
  let formDataRows = "";

  formDataRows += createTableRow("Имя", escapeHtml(data.name));
  formDataRows += createTableRow("Телефон", escapeHtml(data.phone));
  if (data.email) {
    formDataRows += createTableRow("Email", escapeHtml(data.email));
  }
  if (data.comment) {
    formDataRows += createTableRow("Комментарий", escapeHtml(data.comment).replace(/\n/g, "<br>"));
  }

  // Параметры знака
  formDataRows += createTableRow("Модель", escapeHtml(data.signType));
  formDataRows += createTableRow("Размер", escapeHtml(data.signSize));
  formDataRows += createTableRow("Улица", escapeHtml(data.street || "Не указана"));
  formDataRows += createTableRow("Номер дома", escapeHtml(data.houseNumber || "Не указан"));
  formDataRows += createTableRow("Материал", escapeHtml(data.material));
  formDataRows += createTableRow("Цвет крыши", escapeHtml(data.roofColor));
  formDataRows += createTableRow("Цвет тарелки", escapeHtml(data.plateColor));

  // Опции
  formDataRows += createTableRow("Рельефный текст", data.hasRelief ? "Да" : "Нет");
  formDataRows += createTableRow("Подсветка", data.hasBacklight ? "Да" : "Нет");
  formDataRows += createTableRow("Фотореле", data.hasPhotoRelay ? "Да" : "Нет");

  // Цена
  formDataRows += createTableRow(
    "Итоговая стоимость",
    `<span style="color: #d97706; font-weight: bold;">${data.totalPrice.toLocaleString("ru-RU")} ₽</span>`
  );

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
      <h2>Заказ из конструктора</h2>
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
    return NextResponse.json({
      success: false,
      message: "Некорректный формат запроса",
    }, { status: 400 });
  }

  let data: ConstructorOrderData;
  try {
    data = constructorOrderSchema.parse(body);
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Проверьте корректность заполнения формы",
      error: error instanceof z.ZodError ? error.flatten().fieldErrors : "Validation error",
    }, { status: 400 });
  }

  const config = resolveMailerConfig();
  if (!config) {
    return NextResponse.json({
      success: false,
      message: "Сервис временно недоступен",
    }, { status: 500 });
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

    const emailPromises = config.to.map((recipient) =>
      transporter.sendMail({
        from: config.from,
        to: recipient,
        subject: `Retroznak · Заказ из конструктора: ${data.signType}`,
        text: formatPlainText(data, systemInfo),
        html: formatHtml(data, systemInfo),
      }),
    );

    const results = await Promise.all(emailPromises);

    // Log preview URL for Ethereal Email testing
    const previewUrl = nodemailer.getTestMessageUrl(results[0]);
    if (previewUrl) {
      console.log("\n📧 ════════════════════════════════════════════════");
      console.log("   Заказ из конструктора успешно отправлен!");
      console.log(`   Получателей: ${config.to.length}`);
      console.log("   Preview URL:", previewUrl);
      console.log("   ════════════════════════════════════════════════\n");
    }

    return NextResponse.json({
      success: true,
      message: "Заказ успешно отправлен!",
    }, { status: 200 });
  } catch (error) {
    console.error("Ошибка отправки заказа:", error);
    return NextResponse.json({
      success: false,
      message: "Не удалось отправить заказ. Попробуйте позже.",
    }, { status: 500 });
  }
}
