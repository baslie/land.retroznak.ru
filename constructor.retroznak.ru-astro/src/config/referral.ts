/**
 * Конфигурация системы отслеживания и проброса реферальных параметров
 *
 * Этот модуль управляет автоматическим пробросом всех URL-параметров
 * со страниц land.retroznak.ru на внешний сайт ретрознак.рф
 */

/**
 * Интерфейс конфигурации реферального трекинга
 */
export interface ReferralConfig {
  /** Включить/выключить систему отслеживания */
  enabled: boolean;

  /** Режим отладки - выводит логи в консоль */
  debug: boolean;

  /** Ключ для хранения параметров в sessionStorage */
  storageKey: string;

  /**
   * Целевые домены для проброса параметров
   * Поддерживаются:
   * - Кириллические домены (ретрознак.рф)
   * - Punycode версии (xn--80ajgnnembr.xn--p1ai)
   */
  targetDomains: string[];

  /**
   * Регулярное выражение для определения целевых доменов
   * (альтернативный способ через RegExp)
   */
  targetDomainsRegex?: RegExp;

  /**
   * Параметры, которые НЕ нужно пробрасывать
   * (например, внутренние параметры Next.js или технические параметры)
   */
  excludedParams: string[];
}

/**
 * Основная конфигурация реферального трекинга
 *
 * Режим работы: SESSION
 * - Параметры сохраняются в sessionStorage
 * - Живут только в рамках текущей сессии браузера
 * - При закрытии вкладки данные удаляются
 *
 * Логика проброса:
 * 1. При загрузке страницы захватываются ВСЕ параметры из URL
 * 2. Параметры сохраняются в sessionStorage
 * 3. При клике на ссылку к целевому домену параметры добавляются автоматически
 */
export const referralConfig: ReferralConfig = {
  // Включить систему отслеживания
  enabled: true,

  // Режим отладки: включен в dev, выключен в production
  debug: process.env.NODE_ENV !== 'production',

  // Ключ для sessionStorage
  storageKey: 'referral_params',

  // Целевые домены (кириллица и punycode версии ретрознак.рф)
  targetDomains: [
    'ретрознак.рф',
    'xn--80ajgnnembr.xn--p1ai', // punycode для ретрознак.рф
    'retroznak.ru', // на случай латинской версии
  ],

  // Регулярное выражение для проверки целевых доменов (опционально)
  targetDomainsRegex: /^(ретрознак\.рф|xn--80ajgnnembr\.xn--p1ai|retroznak\.ru)$/i,

  // Параметры, которые не нужно пробрасывать
  // (оставляем пустым массив, так как нужно пробрасывать ВСЕ параметры)
  excludedParams: [],
};

/**
 * Проверить, включена ли система отслеживания
 */
export const isReferralTrackingEnabled = (): boolean => {
  return referralConfig.enabled;
};

/**
 * Проверить, включен ли режим отладки
 */
export const isDebugMode = (): boolean => {
  return referralConfig.debug;
};

/**
 * Получить список целевых доменов
 */
export const getTargetDomains = (): string[] => {
  return referralConfig.targetDomains;
};

/**
 * Проверить, является ли домен целевым для проброса параметров
 */
export const isTargetDomain = (hostname: string): boolean => {
  // Нормализуем hostname (убираем www. и приводим к нижнему регистру)
  const normalizedHost = hostname.replace(/^www\./, '').toLowerCase();

  // Проверяем через список доменов
  const matchesList = referralConfig.targetDomains.some(
    (domain) => normalizedHost === domain.toLowerCase()
  );

  // Проверяем через регулярное выражение (если задано)
  const matchesRegex = referralConfig.targetDomainsRegex
    ? referralConfig.targetDomainsRegex.test(normalizedHost)
    : false;

  return matchesList || matchesRegex;
};
