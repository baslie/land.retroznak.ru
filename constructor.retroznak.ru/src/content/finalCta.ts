import type { FinalCtaContent } from "@/types/content";
import { typografContent } from "@/lib/typograf";

const getCurrentYear = () => new Date().getFullYear();

export const finalCtaContent: FinalCtaContent = typografContent({
  title: "Превратите адрес в часть семейной истории",
  subtitle:
    "Выберите модель онлайн или свяжитесь с нами для индивидуального заказа.",
  triggers: [
    {
      id: "guarantee",
      title: "Пожизненная гарантия",
      description: "На корпус Ленинградского знака из нержавеющей стали.",
    },
    {
      id: "speed",
      title: "Производство — 2 дня",
      description: "Максимально быстрый цикл без потери качества.",
    },
    {
      id: "delivery",
      title: "Доставка по России",
      description: "Отправляем через проверенных партнёров и страхуем груз.",
    },
    {
      id: "example",
      title: "Примеры установленных знаков",
      description: "Покажем, как ретрознак выглядит на фасадах клиентов.",
    },
  ],
  primaryCta: {
    label: "Заказать ретрознак",
    targetId: "constructor",
    variant: "primary" as const,
  },
  secondaryCta: {
    label: "Получить консультацию",
    targetId: "jivo-chat",
    variant: "outline" as const,
    description: "Откроется окно чата для быстрой связи с нами.",
  },
  messengers: [
    {
      platform: "max" as const,
      label: "MAX",
      href: "https://max.ru/u/f9LHodD0cOIEbD_OdC-W2plmBZXw9TBsnOkjLHduOoV7V04iu37eGsdGMmQ",
      description: "",
      qrCodeImage: "/qr/max.svg",
    },
    {
      platform: "telegram" as const,
      label: "Telegram",
      href: "https://t.me/retroznakrf",
      description: "",
      qrCodeImage: "/qr/telegram.svg",
    },
  ],
  resources: [
    {
      label: "Чем отличаются ретрознаки?",
      href: "https://xn--80ajgnnembr.xn--p1ai/news/chem-otlichayutsya-retroznaki/",
      type: "article" as const,
    },
    {
      label: "Как приобрести ретрознак со скидкой?",
      href: "https://xn--80ajgnnembr.xn--p1ai/news/kak-priobresti-znak-so-skidkoj/",
      type: "article" as const,
    },
    {
      label: "Устройство знака и несколько советов по установке",
      href: "https://xn--80ajgnnembr.xn--p1ai/news/ustrojstvo-znaka-i-neskolko-sovetov-po-ustanovke/",
      type: "article" as const,
    },
    {
      label: "Наши новости",
      href: "https://xn--80ajgnnembr.xn--p1ai/news",
      type: "news" as const,
    },
  ],
  socials: [
    {
      platform: "vk" as const,
      label: "ВКонтакте",
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
  legalNotice: "ООО «Три Кита» · ОГРН 1177746670000 · Москва, ул. Ретрофасадная, 12",
  copyright: `© 2017–${getCurrentYear()} ООО «Три Кита». Все права защищены.`,
});
