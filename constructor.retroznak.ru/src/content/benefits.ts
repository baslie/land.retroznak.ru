/**
 * Преимущества ретрознаков
 */

import { typografContent } from "@/lib/typograf";

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export const benefitsContent = typografContent({
  title: "Почему выбирают наши ретрознаки",
  subtitle: "Качество, которое прослужит поколениям.",
  items: [
    {
      icon: "History",
      title: "По архивным чертежам",
      description:
        "Создаём вручную по оригинальным чертежам 1930–50-х годов. Точные копии советских образцов.",
    },
    {
      icon: "Shield",
      title: "Прослужат 20+ лет",
      description:
        "Нержавеющая сталь 0,8 мм, порошковая покраска, УФ-печать. Пожизненная гарантия на корпус.",
    },
    {
      icon: "Hammer",
      title: "Каждый знак — уникален",
      description:
        "Полный цикл производства в одной мастерской. Мастера с опытом более 8 лет.",
    },
    {
      icon: "Zap",
      title: "Готово за 2 дня",
      description:
        "Макет за 2 часа, производство за 2 дня. Доставка по всей России 3–7 дней.",
    },
  ] as Benefit[],
  cta: {
    label: "Выбрать ретрознак",
    href: "#constructor",
  },
});
