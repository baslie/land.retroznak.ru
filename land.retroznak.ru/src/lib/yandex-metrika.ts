/**
 * Утилита для работы с Яндекс.Метрикой
 * Обеспечивает безопасную отправку событий в счетчик метрики
 */

// ID счетчика Яндекс.Метрики
const METRIKA_COUNTER_ID = 66944668;

/**
 * Проверяет доступность API Яндекс.Метрики
 */
function isMetrikaAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.ym === "function";
}

/**
 * Отправляет событие достижения цели в Яндекс.Метрику
 *
 * @param goalName - Идентификатор цели (должен быть настроен в интерфейсе Метрики)
 * @param params - Дополнительные параметры события
 *
 * @example
 * sendMetrikaGoal('form_submitted', { contactReason: 'callback' })
 */
export function sendMetrikaGoal(goalName: string, params?: Record<string, unknown>): void {
  if (!isMetrikaAvailable()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Yandex Metrika] ym() is not available. Event not sent:", goalName, params);
    }
    return;
  }

  try {
    if (params) {
      window.ym(METRIKA_COUNTER_ID, "reachGoal", goalName, params);
    } else {
      window.ym(METRIKA_COUNTER_ID, "reachGoal", goalName);
    }

    if (process.env.NODE_ENV !== "production") {
      console.info(`[Yandex Metrika] Goal "${goalName}" sent`, params);
    }
  } catch (error) {
    console.error("[Yandex Metrika] Error sending goal:", error);
  }
}

/**
 * Формирует уникальное имя цели для формы на основе contactReason
 *
 * @param contactReason - Причина обращения (тип формы)
 * @returns Имя цели для метрики
 *
 * @example
 * getFormGoalName('callback') // returns 'callback_form_submitted'
 */
export function getFormGoalName(contactReason: string): string {
  return `${contactReason}_form_submitted`;
}
