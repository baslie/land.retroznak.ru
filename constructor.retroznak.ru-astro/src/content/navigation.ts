import type { NavigationContent } from "@/types/content";
import { typografContent } from "@/lib/typograf";

export const navigationContent: NavigationContent = typografContent({
  menuItems: [
    { id: "catalog", label: "Каталог", targetId: "products" },
    { id: "history", label: "История", targetId: "timeline" },
    { id: "production", label: "Производство", targetId: "production" },
    { id: "gallery", label: "Фото", targetId: "gallery" },
    { id: "reviews", label: "Отзывы", targetId: "reviews" },
    { id: "faq", label: "FAQ", targetId: "faq" },
    { id: "contacts", label: "Контакты", targetId: "final-cta" },
  ],
  cta: {
    label: "Задать вопрос",
    targetId: "question",
    variant: "secondary" as const,
  },
  messengers: [
    {
      platform: "max" as const,
      label: "MAX",
      href: "https://max.ru/u/f9LHodD0cOIEbD_OdC-W2plmBZXw9TBsnOkjLHduOoV7V04iu37eGsdGMmQ",
      description: "Напишите нам в MAX",
    },
    {
      platform: "telegram" as const,
      label: "Telegram",
      href: "https://t.me/retroznakrf",
      description: "Быстрые ответы и фото примеров",
    },
  ],
});
