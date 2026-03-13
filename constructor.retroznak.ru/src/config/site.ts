export interface SiteMetadata {
  name: string;
  brand: string;
  title: string;
  description: string;
  siteUrl: string;
  locale: string;
  keywords: string[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialImage: string;
  socialImageAlt: string;
  telegramUrl: string;
  maxUrl: string;
  organization: string;
}

export const siteMetadata: SiteMetadata = {
  name: "Ретрознаки — домовые знаки с подсветкой",
  brand: "Ретрознаки",
  title: "Домовые ретрознаки — знаки из нержавеющей стали с подсветкой",
  description:
    "Домовые знаки, которые прослужат 20+ лет. Ленинградские, Петроградские и другие ретрознаки из нержавеющей стали с подсветкой. Точные копии советских образцов 1930–50-х годов. От 4 100 руб.",
  siteUrl: "https://land.retroznak.ru",
  locale: "ru_RU",
  keywords: [
    "домовые знаки",
    "ретрознак",
    "ленинградский знак",
    "петроградский знак",
    "нержавеющая сталь",
    "подсветка",
    "адресная табличка",
    "номер дома",
  ],
  contactEmail: "***REMOVED***",
  contactPhone: "+7 (983) 232-22-06",
  address: "634041, г. Томск, ул. Енисейская, д. 32б",
  socialImage: "/hero.jpg",
  socialImageAlt: "Домовые ретрознаки — знаки из нержавеющей стали с подсветкой",
  telegramUrl: "https://t.me/retroznakrf",
  maxUrl: "https://max.ru/u/f9LHodD0cOIEbD_OdC-W2plmBZXw9TBsnOkjLHduOoV7V04iu37eGsdGMmQ",
  organization: "ООО \"Три Кита\"",
};
