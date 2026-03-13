'use client';

/**
 * Компонент для автоматического отслеживания и проброса реферальных параметров
 *
 * Функциональность:
 * 1. Захват всех URL-параметров при загрузке страницы
 * 2. Автоматическое добавление параметров к ссылкам на целевой домен (ретрознак.рф)
 * 3. Перехват кликов для обработки навигации
 * 4. Отслеживание динамически добавляемых ссылок через MutationObserver
 *
 * Режим работы: SESSION
 * - Параметры хранятся в sessionStorage
 * - Живут только в рамках текущей сессии браузера
 *
 * Использование:
 * Просто добавьте компонент в layout:
 * <ReferralTracker />
 */

import { useEffect } from 'react';
import {
  initReferralTracking,
  patchAllLinks,
  patchAnchorElement,
  buildUrlWithParams,
  isSkippableHref,
  log,
} from '@/lib/referral-tracking';
import { isReferralTrackingEnabled } from '@/config/referral';

export default function ReferralTracker() {
  useEffect(() => {
    log('🚀 [INIT] ==========================================');
    log('🚀 [INIT] ReferralTracker useEffect запущен');
    log('🚀 [INIT] Время:', new Date().toISOString());
    log('🚀 [INIT] ==========================================');

    // Проверяем, включена ли система
    if (!isReferralTrackingEnabled()) {
      log('⚠️  [INIT] ReferralTracker: система отключена в конфигурации');
      return;
    }

    log('✅ [INIT] Система включена, начинаем инициализацию');

    // Инициализируем систему (захватываем параметры из URL)
    initReferralTracking();

    // Патчим все существующие ссылки на странице
    // Это важно для "Открыть в новой вкладке" через контекстное меню
    log('🔧 [INIT] Патчинг всех существующих ссылок...');
    const initialPatchedCount = patchAllLinks();
    log(`✅ [INIT] Начальный патчинг завершен. Обновлено ссылок: ${initialPatchedCount}`);

    // Обработчик кликов на ссылки
    const handleClick = (event: MouseEvent) => {
      log('👆 [CLICK] Событие клика зарегистрировано');

      // Находим ближайший элемент <a>
      const target = event.target as HTMLElement;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;

      if (!anchor) {
        log('👆 [CLICK] Нет элемента <a>, пропускаем');
        return;
      }

      const href = anchor.getAttribute('href');
      log('👆 [CLICK] Найден <a>, href:', href);

      if (!href || isSkippableHref(href)) {
        log('👆 [CLICK] Ссылка пропускается (пустая или специальная)');
        return;
      }

      log('👆 [CLICK] anchor.href (resolved):', anchor.href);

      // Строим финальный URL с параметрами
      const finalUrl = buildUrlWithParams(anchor.href);

      if (!finalUrl) {
        // Это не целевой домен или нет параметров для добавления
        log('👆 [CLICK] buildUrlWithParams вернул null, это не целевой домен или нет параметров');
        return;
      }

      log('👆 [CLICK] Построен финальный URL:', finalUrl);

      // Проверяем модификаторы (новая вкладка/окно)
      const isNewTab =
        event.metaKey || // Cmd на Mac
        event.ctrlKey || // Ctrl на Windows/Linux
        event.shiftKey || // Shift (новое окно)
        event.button === 1 || // Средняя кнопка мыши
        anchor.target === '_blank'; // target="_blank"

      log('👆 [CLICK] Модификаторы клика:', {
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        button: event.button,
        target: anchor.target,
        isNewTab,
      });

      if (isNewTab) {
        // Для новой вкладки просто обновляем href и даём браузеру открыть её
        log('👆 [CLICK] Режим "новая вкладка" - обновляем href и отпускаем событие');
        log('👆 [CLICK] ПЕРЕД setAttribute:', anchor.getAttribute('href'));

        anchor.setAttribute('href', finalUrl);

        // Проверка целостности - критически важна!
        const verifyHref = anchor.getAttribute('href');
        log('👆 [CLICK] ПОСЛЕ setAttribute:', verifyHref);

        if (verifyHref !== finalUrl) {
          log('🚨 [CLICK] КРИТИЧЕСКАЯ ОШИБКА! href изменился после setAttribute!');
          log('   Устанавливали:', finalUrl);
          log('   Прочитали:', verifyHref);
          log('   Длина установленного:', finalUrl.length);
          log('   Длина прочитанного:', verifyHref?.length || 0);
          log('   Разница:', finalUrl.length - (verifyHref?.length || 0), 'символов');

          // Пытаемся установить еще раз
          log('👆 [CLICK] Попытка повторной установки...');
          anchor.href = finalUrl; // Используем свойство вместо setAttribute
          const secondVerify = anchor.getAttribute('href');
          log('👆 [CLICK] После повторной установки:', secondVerify);
        } else {
          log('✅ [CLICK] Проверка целостности пройдена для новой вкладки');
        }

        return;
      }

      // Обычный клик: берём управление, чтобы другие скрипты
      // (например, Яндекс.Метрика, Roistat) не переписали нашу ссылку
      log('👆 [CLICK] Обычный клик - перехватываем навигацию');
      event.preventDefault();
      event.stopImmediatePropagation();

      log('👆 [CLICK] Выполняем навигацию через location.assign:', finalUrl);
      window.location.assign(finalUrl);
    };

    // Навешиваем обработчик в capture-фазе, чтобы сработать раньше других
    log('🎯 [INIT] Регистрируем обработчик кликов (capture phase)');
    document.addEventListener('click', handleClick, true);
    log('✅ [INIT] Обработчик кликов зарегистрирован');

    // MutationObserver для отслеживания динамически добавляемых ссылок
    // (например, при подгрузке контента через AJAX, модальные окна и т.д.)
    const observer = new MutationObserver((mutations) => {
      log('🔍 [OBSERVER] Обнаружены изменения DOM, проверяем добавленные узлы');

      let patchedCount = 0;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          // Пропускаем текстовые узлы и комментарии
          if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
          }

          const element = node as HTMLElement;

          // Если сам узел - это ссылка
          if (element.matches && element.matches('a[href]')) {
            log('🔍 [OBSERVER] Найдена добавленная ссылка:', element.getAttribute('href'));
            if (patchAnchorElement(element as HTMLAnchorElement)) {
              patchedCount++;
            }
          }

          // Ищем ссылки внутри добавленного узла
          if (element.querySelectorAll) {
            const anchors = element.querySelectorAll('a[href]');
            if (anchors.length > 0) {
              log(`🔍 [OBSERVER] Найдено ${anchors.length} ссылок внутри добавленного узла`);
              anchors.forEach((anchor) => {
                if (patchAnchorElement(anchor as HTMLAnchorElement)) {
                  patchedCount++;
                }
              });
            }
          }
        });
      });

      if (patchedCount > 0) {
        log(`✅ [OBSERVER] Обновлено ссылок: ${patchedCount}`);
      }
    });

    // Запускаем наблюдение за изменениями в DOM
    log('👁️  [INIT] Запускаем MutationObserver...');
    observer.observe(document.body, {
      childList: true, // Следим за добавлением/удалением узлов
      subtree: true, // Следим за всем поддеревом
    });
    log('✅ [INIT] MutationObserver запущен');

    log('🎉 [INIT] ==========================================');
    log('🎉 [INIT] ReferralTracker ПОЛНОСТЬЮ инициализирован');
    log('🎉 [INIT] ==========================================');

    // Cleanup при размонтировании компонента
    return () => {
      log('🛑 [CLEANUP] Размонтирование ReferralTracker...');
      document.removeEventListener('click', handleClick, true);
      observer.disconnect();
      log('✅ [CLEANUP] ReferralTracker остановлен');
    };
  }, []);

  // Компонент ничего не рендерит
  return null;
}
