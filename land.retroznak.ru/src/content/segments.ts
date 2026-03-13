import type { SegmentsContent } from "@/types/content";
import { typografContent } from "@/lib/typograf";

export const segmentsContent: SegmentsContent = typografContent({
  title: "Ретрознаки подойдут практически всем",
  subtitle: "Создаём решения для частных проектов, коммерческих пространств и городских инициатив.",
  segments: [
    {
      id: "private-homes",
      title: "Частные дома и дачи",
      description: "Семейная история на фасаде и удобная навигация для гостей и служб доставки.",
      icon: "home",
    },
    {
      id: "restaurants",
      title: "Рестораны и кафе",
      description: "Ретрознак как рекламный носитель, притягивает внимание, усиливает концепцию и становится частью фотозон.",
      icon: "utensils",
    },
    {
      id: "museums",
      title: "Исторические здания и музеи",
      description: "Соответствие охранным требованиям и бережное восстановление городского кода.",
      icon: "landmark",
    },
    {
      id: "developers",
      title: "Коттеджные поселки",
      description: "Оформление навигации в едином стиле.",
      icon: "building",
    },
  ],
  cta: {
    label: "Получить подборку примеров",
    targetId: "callback",
    variant: "primary" as const,
  },
});
