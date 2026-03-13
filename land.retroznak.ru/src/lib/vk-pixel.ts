/**
 * Утилита для работы с VK Pixel (Top.Mail.Ru)
 * Обеспечивает безопасную отправку событий в пиксель
 */

// ID счетчика VK Pixel
const VK_PIXEL_ID = 3729731;

// Расширяем типы window для _tmr
declare global {
  interface Window {
    _tmr?: Array<Record<string, unknown>>;
  }
}

/**
 * Проверяет доступность API VK Pixel
 */
function isVKPixelAvailable(): boolean {
  return typeof window !== "undefined" && Array.isArray(window._tmr);
}

/**
 * Отправляет событие достижения цели в VK Pixel
 *
 * @param goalName - Идентификатор цели
 *
 * @example
 * sendVKPixelGoal('form_submitted')
 */
export function sendVKPixelGoal(goalName: string): void {
  if (!isVKPixelAvailable()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[VK Pixel] _tmr is not available. Event not sent:", goalName);
    }
    return;
  }

  try {
    window._tmr!.push({
      type: "reachGoal",
      id: VK_PIXEL_ID,
      goal: goalName,
    });

    if (process.env.NODE_ENV !== "production") {
      console.info(`[VK Pixel] Goal "${goalName}" sent`);
    }
  } catch (error) {
    console.error("[VK Pixel] Error sending goal:", error);
  }
}
