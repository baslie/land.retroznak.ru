import { useMemo } from "react";
import { typograf } from "@/lib/typograf";

/**
 * React хук для типографирования текста
 *
 * Автоматически применяет правила типографики к переданному тексту:
 * - неразрывные пробелы
 * - правильные кавычки
 * - тире вместо дефисов
 * - исправление опечаток
 *
 * Результат мемоизируется для оптимизации производительности.
 *
 * @param text - Исходный текст для типографирования
 * @returns Типографированный текст
 *
 * @example
 * const Hero = () => {
 *   const title = useTypograf('Домовые знаки - это красиво!');
 *   return <h1>{title}</h1>;
 * }
 */
export function useTypograf(text: string | undefined | null): string {
  return useMemo(() => {
    if (!text) return "";
    return typograf(text);
  }, [text]);
}
