/**
 * Навигация для конструктора
 */

import { typografContent } from "@/lib/typograf";

export const navigationConstructorContent = typografContent({
  items: [
    { label: "Модели", href: "#models" },
    { label: "Конструктор", href: "#constructor" },
    { label: "Примеры", href: "#gallery" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Контакты", href: "#contacts" },
  ],
  cta: {
    label: "Создать знак",
    href: "#constructor",
  },
});
