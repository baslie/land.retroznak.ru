import type { FooterContent } from "@/types/content";
import { typografContent } from "@/lib/typograf";

const getCurrentYear = () => new Date().getFullYear();

export const footerContent: FooterContent = typografContent({
  menu: [
    {
      title: "Навигация",
      links: [
        { label: "Каталог", href: "#products" },
        { label: "История", href: "#timeline" },
        { label: "Производство", href: "#production" },
        { label: "Фото", href: "#gallery" },
        { label: "Отзывы", href: "#reviews" },
        { label: "FAQ", href: "#faq" },
        { label: "Контакты", href: "#final-cta" },
      ],
    },
  ],
  contacts: [
    {
      label: "Офис Томск",
      value: "+7 (983) 232-22-06",
      href: "tel:+79832322206",
    },
    {
      label: "Директор",
      value: "+7 (913) 816-47-15",
      href: "tel:+79138164715",
    },
    {
      label: "Email",
      value: "***REMOVED***",
      href: "mailto:***REMOVED***",
    },
    {
      label: "Адрес",
      value: "634041, г. Томск, ул. Енисейская, д. 32б",
    },
    {
      label: "Режим работы",
      value: "ПН-ПТ: 09:00-18:00, СБ-ВС: выходной",
    },
  ],
  messengers: [
    {
      platform: "max" as const,
      label: "MAX",
      href: "https://max.ru/u/f9LHodD0cOIEbD_OdC-W2plmBZXw9TBsnOkjLHduOoV7V04iu37eGsdGMmQ",
      description: "Ответим за 10 минут",
    },
    {
      platform: "telegram" as const,
      label: "Telegram",
      href: "https://t.me/retroznakrf",
      description: "Менеджер онлайн 10:00–22:00",
    },
  ],
  socials: [
    {
      platform: "vk" as const,
      label: "VK",
      href: "https://vk.com/retroznak",
    },
    {
      platform: "youtube" as const,
      label: "YouTube",
      href: "https://www.youtube.com/channel/UC_GB2X_FmuwWrwNfqUGrTCw",
    },
    {
      platform: "telegram" as const,
      label: "Telegram",
      href: "https://t.me/Rznak",
    },
  ],
  legal: "ООО «Три Кита» · ОГРН 1097017011079",
  copyright: `© 2017–${getCurrentYear()} ООО «Три Кита». Все права защищены.`,
});
