/**
 * Hero секция для конструктора
 */

import { typografContent } from "@/lib/typograf";

export const heroConstructorContent = typografContent({
  badge: {
    label: "Онлайн-конструктор",
    tone: "highlight" as const,
  },
  title: "Создайте свой ретрознак",
  subtitle: "онлайн",
  description:
    "Интерактивный конструктор домовых знаков в советском стиле. Выберите тип, введите адрес и увидите результат мгновенно.",
  priceFrom: "от 4 100 ₽",
  leadTime: "Изготовление 1-2 дня",
  primaryCta: {
    label: "Открыть конструктор",
    href: "#constructor",
  },
  secondaryCta: {
    label: "Смотреть модели",
    href: "#models",
  },
  features: [
    "Визуализация в реальном времени",
    "Выбор цветов и материалов",
    "Расчёт стоимости онлайн",
  ],
});
