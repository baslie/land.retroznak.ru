import type { ProductionContent } from "@/types/content";
import { typografContent } from "@/lib/typograf";

export const productionContent: ProductionContent = typografContent({
  title: "От эскиза до готового знака",
  subtitle:
    "Полный цикл создания ретрознаков в одной мастерской — от создания эскиза, до упаковки и доставки.",
  steps: [
    {
      id: "design",
      title: "Разрабатываем макет",
      description: "Дизайнер Кристина нанесет ваш адрес на знак. Менеджер Мария пришлет вам эскиз на согласование. (1 рабочий день)",
      icon: "pen",
    },
    {
      id: "manufacturing",
      title: "Изготавливаем вручную",
      description: "Мастер Денис отштампует форму знака. Маляр Саныч покрасит. Мастер Иван нанесет текст и соберет электрику. (1 рабочий день)",
      icon: "hammer",
    },
    {
      id: "quality",
      title: "Проверяем качество",
      description: "Менеджер Маша проверит качество, сделает фотоотчет, пришлет вам фото (0,5 рабочего дня)",
      icon: "shield",
    },
    {
      id: "delivery",
      title: "Упаковываем и доставляем",
      description: "Упаковщик Саша завернет знак в пленку, проложит толстым пенопластом и упакует в коробку. Водитель Дима увезет на почту.",
      icon: "truck",
    },
  ],
  team: [
    {
      id: "kristina",
      name: "Кристина",
      role: "Дизайнер",
      experience: "Опыт — 7 лет",
      image: "/team/kristina.jpg",
    },
    {
      id: "maria",
      name: "Мария",
      role: "Менеджер",
      experience: "Координирует заказы",
      image: "/team/maria.jpg",
    },
    {
      id: "denis",
      name: "Денис",
      role: "Начальник производства",
      experience: "Контролирует процесс",
      image: "/team/denis.jpg",
    },
  ],
  metrics: [
    {
      id: "monthly",
      label: "100-200",
      value: "знаков в месяц",
      description: "Производим без потери качества и сроков",
    },
    {
      id: "returning",
      label: "60%",
      value: "заказов поступает от соседей",
      description: "где установлен наш ретрознак",
    },
    {
      id: "claims",
      label: "0",
      value: "рекламаций",
      description: "за 2025 год",
    },
  ],
});
