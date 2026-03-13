import type { OrderProcessContent } from "@/types/content";
import { typografContent } from "@/lib/typograf";

export const orderProcessContent: OrderProcessContent = typografContent({
  title: "Как получить свой ретрознак за 1–2 недели?",
  subtitle: "Прозрачный процесс от заявки до монтажа — мы сопровождаем на каждом шаге.",
  steps: [
    {
      id: "submit",
      title: "Оставляете заявку",
      description: "Указываете контакты и фасад, а мы уточняем детали и назначаем менеджера.",
      icon: "form",
    },
    {
      id: "design",
      title: "Получаете макет",
      description: "В течение 2 часов отправляем варианты и согласовываем правки.",
      icon: "design",
    },
    {
      id: "approve",
      title: "Согласовываете",
      description: "Фиксируем материалы, цвет и сроки производства.",
      icon: "approval",
    },
    {
      id: "production",
      title: "Производство",
      description: "Изготавливаем знак 3–7 дней и показываем фото готовности.",
      icon: "factory",
    },
    {
      id: "delivery",
      title: "Доставка",
      description: "Отправляем через СДЭК, Почту России или выбранную ТК, отслеживание предоставляем.",
      icon: "delivery",
    },
    {
      id: "install",
      title: "Монтаж",
      description: "Присылаем PDF-инструкцию и поддерживаем мастера дистанционно.",
      icon: "tools",
    },
  ],
  cta: {
    label: "Оставить заявку",
    targetId: "consultation",
    variant: "primary" as const,
  },
});
