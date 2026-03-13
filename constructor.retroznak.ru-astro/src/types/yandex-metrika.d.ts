/**
 * Глобальные типы для Яндекс.Метрики
 */

interface YandexMetrikaCallback {
  (): void;
}

interface Window {
  /**
   * API Яндекс.Метрики
   * @see https://yandex.ru/support/metrica/objects/
   */
  ym: (
    counterId: number,
    method: string,
    ...args: Array<string | Record<string, unknown> | YandexMetrikaCallback>
  ) => void;
}
