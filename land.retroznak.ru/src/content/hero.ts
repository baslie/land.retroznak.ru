import type { HeroContent } from "@/types/content";
import { typografContent } from "@/lib/typograf";

const heroVisualImage = "/hero/evelina-hero.webp";

export const heroContent: HeroContent = typografContent({
  eyebrow: "Проектируем и создаём",
  title: "Домовые знаки советской эпохи",
  subtitle:
    "Создаём душевные адресные указатели из металла с подсветкой. От 1\u00A0990\u00A0₽. Доставка в любую точку страны.",
  description:
    "Каждый ретрознак мы создаём вручную по архивным чертежам, сохраняя эстетику 1930–50-х и добавляя современную защиту.",
  primaryCta: {
    label: "Выбрать модель",
    targetId: "products",
    variant: "primary" as const,
  },
  secondaryCta: {
    label: "Заказать бесплатный макет",
    targetId: "consultation",
    variant: "secondary" as const,
  },
  visual: {
    image: heroVisualImage,
    alt: "Девушка демонстрирует ретрознак советской эпохи с подсветкой",
    badge: {
      title: "Ретрознаки, популярные в 1930–50 гг.",
      description:
        "Именно такие адресные указатели вы видели в советских фильмах и на старых фотографиях.",
    },
  },
});
