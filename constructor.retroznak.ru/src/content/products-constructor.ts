/**
 * Карточки продуктов для конструктора
 * 3 модели: Ленинградский, Петроградский, Мини
 */

import { typografContent } from "@/lib/typograf";
import type { SignTypeId } from "@/types/constructor";

export interface ProductCard {
  id: SignTypeId;
  name: string;
  size: string;
  priceFrom: string;
  basePrice: number;
  image: string;
  badge?: {
    label: string;
    tone: "premium" | "highlight" | "default";
  };
  features: string[];
  ctaLabel: string;
}

export const productsConstructorContent = typografContent({
  title: "Три модели знаков",
  subtitle: "Выберите подходящий размер для вашего фасада",
  cards: [
    {
      id: "len" as SignTypeId,
      name: "Ленинградский",
      size: "52×40 см",
      priceFrom: "от 4 500 ₽",
      basePrice: 4500,
      image: "/products/tabs/retroznak-3.png",
      badge: {
        label: "Премиум",
        tone: "premium" as const,
      },
      features: [
        "Нержавеющая сталь 0,8 мм",
        "Оригинальный советский размер",
        "Пожизненная гарантия на корпус",
      ],
      ctaLabel: "Создать →",
    },
    {
      id: "pet" as SignTypeId,
      name: "Петроградский",
      size: "47×34 см",
      priceFrom: "от 4 300 ₽",
      basePrice: 4300,
      image: "/products/tabs/retroznak-2.png",
      badge: {
        label: "Хит продаж",
        tone: "highlight" as const,
      },
      features: [
        "Сталь 0,7 мм с порошковой покраской",
        "Матовые стёкла в окошках",
        "Оптимальное соотношение цена/размер",
      ],
      ctaLabel: "Создать →",
    },
    {
      id: "mini" as SignTypeId,
      name: "Мини",
      size: "28×20 см",
      priceFrom: "от 4 100 ₽",
      basePrice: 4100,
      image: "/products/tabs/retroznak-1.png",
      features: [
        "Компактный размер",
        "Идеален для интерьера и декора",
        "Подходит для ограниченного пространства",
      ],
      ctaLabel: "Создать →",
    },
  ] as ProductCard[],
});
