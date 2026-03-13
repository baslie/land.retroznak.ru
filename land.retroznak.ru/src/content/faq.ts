import type { FaqContent } from "@/types/content";
import { typografContent } from "@/lib/typograf";

export const faqContent: FaqContent = typografContent({
  title: "Ответы на главные вопросы",
  subtitle: "Собрали информацию, которую чаще всего задают перед заказом.",
  items: [
    {
      id: "pricing",
      category: "Цена и оплата",
      question: "Сколько стоит ретрознак и можно ли оформить рассрочку?",
      answer:
        "Базовые модели начинаются от 1 990 ₽. Макет бесплатный. Доступна оплата по счёту для юрлиц.",
    },
    {
      id: "timing",
      category: "Сроки производства",
      question: "Когда я получу готовый знак?",
      answer:
        "Макет подготавливаем за 2 часа, производство занимает 2 дня. Доставка по России в среднем 3–7 дней, международные отправления уточняем индивидуально.",
    },
    {
      id: "delivery",
      category: "Доставка и монтаж",
      question: "Как происходит доставка и можно ли установить самостоятельно?",
      answer:
        "Отправляем через СДЭК, Почту России или транспортную компанию. Инструкцию по монтажу можно найти <a href=\"https://ретрознак.рф/news/ustrojstvo-znaka-i-neskolko-sovetov-po-ustanovke/\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-white underline decoration-white/60 hover:decoration-white transition-colors\">здесь</a>.",
    },
    {
      id: "customization",
      category: "Индивидуализация",
      question: "Можно ли изменить цвет, форму или добавить элементы?",
      answer:
        "Да, подбираем палитру по RAL и NCS, добавляем рельефные элементы и кастомный шрифт. Индивидуальные решения рассчитываем отдельно.",
    },
    {
      id: "warranty",
      category: "Гарантии и сервис",
      question: "Что если знак повредится или подсветка перестанет работать?",
      answer:
        "На стальную основу действует пожизненная гарантия. Подсветка и покрытие защищены гарантией до 5 лет, в случае повреждений помогаем с ремонтом.",
    },
  ],
  cta: {
    label: "Не нашли ответ — задайте вопрос",
    targetId: "question",
    variant: "primary" as const,
  },
});
