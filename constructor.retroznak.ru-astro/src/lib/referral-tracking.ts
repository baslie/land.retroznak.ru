/**
 * Утилиты для отслеживания и проброса реферальных параметров
 *
 * Основная логика:
 * 1. Захват всех URL-параметров при загрузке страницы
 * 2. Сохранение в sessionStorage (живёт только в рамках сессии)
 * 3. Автоматическое добавление параметров к ссылкам на целевой домен
 */

import {
  referralConfig,
  isTargetDomain,
  isDebugMode,
  isReferralTrackingEnabled,
} from '@/config/referral';

/**
 * Интерфейс для параметров URL
 */
export interface ReferralParams {
  [key: string]: string;
}

/**
 * Логирование в консоль (только в debug режиме)
 */
export function log(...args: unknown[]): void {
  if (isDebugMode() && typeof console !== 'undefined' && console.log) {
    console.log('[ReferralTracker]', ...args);
  }
}

/**
 * Проверить, доступен ли sessionStorage
 */
function isSessionStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Захватить все параметры из текущего URL и сохранить в sessionStorage
 *
 * Сохраняются ВСЕ параметры из query string, кроме тех,
 * что указаны в excludedParams конфигурации
 *
 * @returns Объект с захваченными параметрами или null при ошибке
 */
export function captureReferralParams(): ReferralParams | null {
  if (!isReferralTrackingEnabled()) {
    return null;
  }

  if (!isSessionStorageAvailable()) {
    log('sessionStorage недоступен');
    return null;
  }

  try {
    // Логируем исходный URL
    log('🔍 [CAPTURE] Исходный URL:', window.location.href);
    log('🔍 [CAPTURE] Query string:', window.location.search);

    // Читаем все параметры из URL
    const searchParams = new URLSearchParams(window.location.search);
    const params: ReferralParams = {};

    // Перебираем все параметры
    searchParams.forEach((value, key) => {
      // Пропускаем исключённые параметры
      if (!referralConfig.excludedParams.includes(key)) {
        params[key] = value;
        log(`🔍 [CAPTURE] Параметр "${key}":`, {
          value,
          length: value.length,
          encoded: encodeURIComponent(value),
        });
      } else {
        log(`⏭️  [CAPTURE] Пропущен параметр "${key}" (в excludedParams)`);
      }
    });

    // Если есть хотя бы один параметр, сохраняем
    if (Object.keys(params).length > 0) {
      const serialized = JSON.stringify(params);
      log('💾 [CAPTURE] JSON для сохранения:', {
        length: serialized.length,
        preview: serialized.substring(0, 200) + (serialized.length > 200 ? '...' : ''),
      });

      sessionStorage.setItem(
        referralConfig.storageKey,
        serialized
      );
      log('✅ [CAPTURE] Захвачены параметры:', params);
      return params;
    } else {
      log('⚠️  [CAPTURE] Параметров в URL не найдено');
      return null;
    }
  } catch (error) {
    log('❌ [CAPTURE] Ошибка при захвате параметров:', error);
    return null;
  }
}

/**
 * Получить сохранённые реферальные параметры из sessionStorage
 *
 * @returns Объект с параметрами или пустой объект, если параметров нет
 */
export function getReferralParams(): ReferralParams {
  if (!isReferralTrackingEnabled()) {
    return {};
  }

  if (!isSessionStorageAvailable()) {
    return {};
  }

  try {
    const stored = sessionStorage.getItem(referralConfig.storageKey);
    if (stored) {
      log('📦 [GET] Raw из sessionStorage:', {
        length: stored.length,
        preview: stored.substring(0, 200) + (stored.length > 200 ? '...' : ''),
      });

      const params = JSON.parse(stored) as ReferralParams;

      log('📦 [GET] Распарсенные параметры:', params);

      // Детальный вывод каждого параметра
      Object.entries(params).forEach(([key, value]) => {
        log(`📦 [GET] Параметр "${key}":`, {
          value,
          length: value.length,
          startsWidth: value.substring(0, 50),
          endsWidth: value.length > 50 ? '...' + value.substring(value.length - 20) : '',
        });
      });

      return params;
    } else {
      log('📦 [GET] Нет сохранённых параметров в sessionStorage');
    }
  } catch (error) {
    log('❌ [GET] Ошибка при получении параметров:', error);
  }

  return {};
}

/**
 * Очистить сохранённые реферальные параметры
 */
export function clearReferralParams(): void {
  if (!isSessionStorageAvailable()) {
    return;
  }

  try {
    sessionStorage.removeItem(referralConfig.storageKey);
    log('Параметры очищены');
  } catch (error) {
    log('Ошибка при очистке параметров:', error);
  }
}

/**
 * Проверить, нужно ли пропустить данную ссылку
 * (tel:, mailto:, #, javascript:, и т.д.)
 */
export function isSkippableHref(href: string | null | undefined): boolean {
  if (!href) {
    return true;
  }

  return /^(#|tel:|mailto:|javascript:)/i.test(href);
}

/**
 * Построить финальный URL с добавлением реферальных параметров
 *
 * Логика:
 * 1. Проверяет, является ли ссылка целевым доменом
 * 2. Если да, добавляет все сохранённые параметры из sessionStorage
 * 3. Не перезаписывает существующие параметры в ссылке
 *
 * @param href - Исходная ссылка
 * @param baseUrl - Базовый URL для резолва относительных ссылок (обычно location.href)
 * @returns Новый URL с параметрами или null, если изменений не требуется
 */
export function buildUrlWithParams(
  href: string,
  baseUrl?: string
): string | null {
  if (!isReferralTrackingEnabled()) {
    return null;
  }

  // Пропускаем специальные ссылки
  if (isSkippableHref(href)) {
    return null;
  }

  try {
    log('🔗 [BUILD] Начало построения URL');
    log('🔗 [BUILD] Входящий href:', href);
    log('🔗 [BUILD] Base URL:', baseUrl || window.location.href);

    // Парсим URL (поддержка относительных и абсолютных ссылок)
    const url = new URL(href, baseUrl || window.location.href);

    log('🔗 [BUILD] Распарсенный URL:', {
      hostname: url.hostname,
      pathname: url.pathname,
      search: url.search,
      href: url.href,
    });

    // Проверяем, является ли домен целевым
    if (!isTargetDomain(url.hostname)) {
      log('⏭️  [BUILD] Домен не целевой, пропускаем:', url.hostname);
      return null;
    }

    log('✅ [BUILD] Домен целевой:', url.hostname);

    // Получаем сохранённые параметры
    const savedParams = getReferralParams();

    // Если нет сохранённых параметров, ничего не делаем
    if (Object.keys(savedParams).length === 0) {
      log('⚠️  [BUILD] Нет параметров для добавления к ссылке:', href);
      return null;
    }

    log('📝 [BUILD] Будем добавлять параметры:', savedParams);

    let hasChanges = false;
    const addedParams: string[] = [];
    const skippedParams: string[] = [];

    // Добавляем параметры, если их ещё нет в URL
    Object.entries(savedParams).forEach(([key, value]) => {
      if (!url.searchParams.has(key)) {
        log(`➕ [BUILD] Добавляем параметр "${key}":`, {
          value,
          valueLength: value.length,
          beforeSet: url.href.length,
        });

        url.searchParams.set(key, value);

        log(`➕ [BUILD] После добавления "${key}":`, {
          afterSet: url.href.length,
          currentSearch: url.search.substring(0, 200) + (url.search.length > 200 ? '...' : ''),
        });

        addedParams.push(key);
        hasChanges = true;
      } else {
        skippedParams.push(key);
        log(`⏭️  [BUILD] Пропускаем "${key}" (уже есть в URL)`);
      }
    });

    if (hasChanges) {
      const finalUrl = url.toString();

      log('✅ [BUILD] URL успешно построен:', {
        originalLength: href.length,
        finalLength: finalUrl.length,
        addedParams,
        skippedParams,
        finalHref: finalUrl,
      });

      log('🔍 [BUILD] Детальное сравнение:');
      log('   БЫЛО:', href);
      log('   СТАЛО:', finalUrl);

      return finalUrl;
    }

    log('⏭️  [BUILD] Нет изменений, все параметры уже есть');
    return null;
  } catch (error) {
    log('❌ [BUILD] Ошибка при построении URL:', error);
    return null;
  }
}

/**
 * Патчинг одного элемента <a> - добавление параметров к href
 *
 * @param anchor - Элемент <a>
 * @returns true, если ссылка была изменена
 */
export function patchAnchorElement(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute('href');
  if (!href || isSkippableHref(href)) {
    return false;
  }

  log('🔧 [PATCH] Патчинг элемента <a>');
  log('🔧 [PATCH] getAttribute("href"):', href);
  log('🔧 [PATCH] anchor.href (resolved):', anchor.href);

  const finalUrl = buildUrlWithParams(anchor.href);
  if (finalUrl) {
    log('🔧 [PATCH] Устанавливаем новый href:', finalUrl);

    anchor.setAttribute('href', finalUrl);

    // Проверка целостности - читаем обратно
    const verifyHref = anchor.getAttribute('href');
    log('🔧 [PATCH] Проверка: getAttribute после set:', verifyHref);

    if (verifyHref !== finalUrl) {
      log('⚠️  [PATCH] ВНИМАНИЕ! href изменился после setAttribute!');
      log('   Ожидали:', finalUrl);
      log('   Получили:', verifyHref);
      log('   Разница в символах:', finalUrl.length - (verifyHref?.length || 0));
    } else {
      log('✅ [PATCH] Проверка пройдена, href установлен корректно');
    }

    return true;
  } else {
    log('⏭️  [PATCH] buildUrlWithParams вернул null, изменений нет');
  }

  return false;
}

/**
 * Патчинг всех ссылок на странице
 *
 * Полезно для "открыть в новой вкладке" через контекстное меню,
 * так как в этом случае событие click не срабатывает
 *
 * @returns Количество изменённых ссылок
 */
export function patchAllLinks(): number {
  if (!isReferralTrackingEnabled()) {
    return 0;
  }

  let patchedCount = 0;

  document.querySelectorAll('a[href]').forEach((anchor) => {
    if (patchAnchorElement(anchor as HTMLAnchorElement)) {
      patchedCount++;
    }
  });

  if (patchedCount > 0) {
    log(`Обновлено ссылок: ${patchedCount}`);
  }

  return patchedCount;
}

/**
 * Инициализация системы отслеживания реферальных параметров
 *
 * Вызывается при загрузке страницы для захвата параметров из URL
 */
export function initReferralTracking(): void {
  if (!isReferralTrackingEnabled()) {
    log('Система отслеживания отключена в конфигурации');
    return;
  }

  // Захватываем параметры из текущего URL
  captureReferralParams();

  log('Система отслеживания инициализирована', {
    targetDomains: referralConfig.targetDomains,
    storageKey: referralConfig.storageKey,
  });
}
