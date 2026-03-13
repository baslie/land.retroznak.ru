import Typograf from "typograf";

/**
 * Экземпляр Typograf с настройками для русского языка
 * Используется для автоматического типографирования текста:
 * - расстановка неразрывных пробелов
 * - правильные кавычки («ёлочки» для русского)
 * - замена дефисов на тире
 * - исправление мелких опечаток
 */
const tp = new Typograf({ locale: ["ru", "en-US"] });

/**
 * Типографирует переданный текст по правилам русской типографики
 * @param text - Исходный текст для обработки
 * @returns Типографированный текст
 */
export function typograf(text: string): string {
  if (!text) return text;
  return tp.execute(text);
}

/**
 * Checks if text likely needs typography processing.
 * Detects common typography issues in Russian text:
 * - Regular hyphens instead of en-dashes or em-dashes (hyphen surrounded by spaces)
 * - Straight quotes instead of curly quotes
 * - Missing non-breaking spaces
 *
 * @param text - Text to check
 * @returns true if text likely needs typograf processing
 */
export function needsTypograf(text: string): boolean {
  if (!text) return false;

  // Check for hyphen with spaces (should be en-dash or em-dash)
  if (/\s-\s/.test(text)) return true;

  // Check for straight quotes in Russian text
  if (/"/.test(text) && /[а-яА-ЯёЁ]/.test(text)) return true;

  // Check for common prepositions not followed by non-breaking space
  // (в, на, от, до, из, к, с, о, за, под, над, при, по, у)
  if (/\s[внокусзпу]\s/i.test(text)) return true;

  return false;
}

/**
 * Проверяет, запущено ли приложение в режиме разработки
 * @returns true если NODE_ENV === "development"
 */
export function isDevMode(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Рекурсивно применяет типографирование ко всем строковым значениям в объекте
 * @param obj - Объект для обработки (может быть объектом, массивом или примитивом)
 * @returns Новый объект с типографированными строками
 */
export function typografDeep<T>(obj: T): T {
  if (typeof obj === "string") {
    return typograf(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => typografDeep(item)) as T;
  }

  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = typografDeep(value);
    }
    return result as T;
  }

  return obj;
}

/**
 * Применяет типографирование к content объекту, обрабатывая все строковые поля
 * Это специализированная версия typografDeep для content файлов
 * @param content - Content объект для обработки
 * @returns Новый объект с типографированными строками
 */
export function typografContent<T extends Record<string, unknown>>(
  content: T,
): T {
  return typografDeep(content);
}

/**
 * Экспорт экземпляра Typograf для более гибкой настройки в других модулях
 */
export { tp };
