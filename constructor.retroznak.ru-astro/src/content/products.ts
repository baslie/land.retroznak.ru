import type { ProductContent } from "@/types/content";
import { typografContent } from "@/lib/typograf";
import { asset } from "@/lib/base-path";

export const productContent: ProductContent = typografContent({
  title: "Выберите свой ретрознак",
  subtitle:
    "Три модели — от доступного упрощенного решения до премиального исполнения с максимальным сроком службы.",
  variants: [
    {
      id: "leningradsky",
      name: "Ленинградский",
      badge: {
        label: "Премиум",
        tone: "premium" as const,
      },
      description:
        "Самый популярный домовой знак советского времени под названием: «Ленинградский ТИП-1». Внешний вид соответствует оригинальному. Если ваш дом находится во влажном климате или вы хотите получить максимально долговечную продукцию, то выбирайте ретрознаки из нержавеющей стали. Домовой знак покрашен порошковым методом, покрыт полимерной эмалью. Пленки не используются. Действует пожизненная гарантия на корпус ретрознак из нержавеющей стали!",
      priceFrom: "от 7 000 ₽",
      basePrice: 7000,
      leadTime: "1–2 дня",
      size: "52×40 см",
      tabImage: {
        src: asset("/products/tabs/retroznak-3.png"),
        alt: "Ленинградский ретрознак",
      },
      images: [
        {
          src: asset("/products/3-1.png"),
          alt: "Ленинградский ретрознак - вид 1",
        },
        {
          src: asset("/products/3-2.png"),
          alt: "Ленинградский ретрознак - вид 2",
        },
        {
          src: asset("/products/3-3.png"),
          alt: "Ленинградский ретрознак - вид 3",
        },
        {
          src: asset("/products/3-4.png"),
          alt: "Ленинградский ретрознак - вид 4",
        },
        {
          src: asset("/products/3-5.png"),
          alt: "Ленинградский ретрознак - вид 5",
        },
      ],
      features: [
        "Размер 52×40 см",
        "Нержавеющая сталь толщиной 0,8 мм",
        "Покраска порошковым методом",
        "Нанесение текста полимерной эмалью",
        "Стандартные цвета: коричневая крыша, белая тарелка с кремовым оттенком",
      ],
      equipment: [
        "Патрон",
        "Провод",
        "LED лампочка 3,5 Вт",
      ],
      paymentOptions: [
        "Оплата по счёту для юрлиц",
      ],
      upsells: [
        { id: "lighting-none", label: "Без подсветки", price: 0, group: "lighting" as const, isDefault: true },
        { id: "lighting-mains", label: "От сети", price: 300, group: "lighting" as const },
        { id: "lighting-photorelay", label: "От сети с фотореле", price: 1000, group: "lighting" as const },
        { id: "lighting-solar", label: "На солнечных батареях", price: 3000, group: "lighting" as const },
        { id: "text-flat", label: "Плоское нанесение текста", price: 0, group: "text-style" as const, isDefault: true },
        { id: "text-relief", label: "Рельефное нанесение текста", price: 2000, group: "text-style" as const },
        { id: "color-standard", label: "Коричневая крыша / белая тарелка", price: 0, group: "color" as const, isDefault: true },
        { id: "color-roof", label: "Крыша в др. цвет", price: 300, group: "color" as const },
        { id: "color-plate", label: "Тарелка в др. цвет", price: 300, group: "color" as const },
        { id: "color-full", label: "Знак полностью в др. цвет", price: 900, group: "color" as const },
        { id: "extras-address", label: "Нанесение улицы и номера дома", price: 0, group: "extras" as const, isDefault: true },
        { id: "extras-bw", label: "ЧБ рисунок", price: 1000, group: "extras" as const },
        { id: "extras-color", label: "Цветное изображение", price: 1000, group: "extras" as const },
      ],
    },
    {
      id: "petrogradsky",
      name: "Петроградский",
      badge: {
        label: "Хит продаж",
        tone: "highlight" as const,
      },
      description:
        "Уменьшенная копия «Ленинградского» домового знака. Выполнен из стали 0,7 мм, полимерная покраска. В окошках установлены матовые стекла. Домовой знак укомплектован патроном, проводом и светодиодной долговечной лампочкой мощностью 3,5 Вт, 220 В.",
      priceFrom: "от 4 300 ₽",
      basePrice: 4300,
      leadTime: "1–2 дня",
      size: "47×34 см",
      tabImage: {
        src: asset("/products/tabs/retroznak-2.png"),
        alt: "Петроградский ретрознак",
      },
      images: [
        {
          src: asset("/products/2-1.png"),
          alt: "Петроградский ретрознак - вид 1",
        },
        {
          src: asset("/products/2-2.png"),
          alt: "Петроградский ретрознак - вид 2",
        },
        {
          src: asset("/products/2-3.png"),
          alt: "Петроградский ретрознак - вид 3",
        },
        {
          src: asset("/products/2-4.png"),
          alt: "Петроградский ретрознак - вид 4",
        },
        {
          src: asset("/products/2-5.png"),
          alt: "Петроградский ретрознак - вид 5",
        },
      ],
      features: [
        "Размер 47×34 см",
        "Сталь толщиной 0,7 мм",
        "Покраска порошковым методом",
        "Нанесение текста полимерной эмалью",
        "Матовые стекла в окошках",
      ],
      equipment: [
        "Патрон",
        "Провод",
        "LED лампочка 3,5 Вт",
      ],
      paymentOptions: [
        "Оплата по счёту для юрлиц",
      ],
      upsells: [
        { id: "lighting-none", label: "Без подсветки", price: 0, group: "lighting" as const, isDefault: true },
        { id: "lighting-mains", label: "От сети", price: 300, group: "lighting" as const },
        { id: "lighting-photorelay", label: "От сети с фотореле", price: 1000, group: "lighting" as const },
        { id: "lighting-solar", label: "На солнечных батареях", price: 3000, group: "lighting" as const },
        { id: "text-flat", label: "Плоское нанесение текста", price: 0, group: "text-style" as const, isDefault: true },
        { id: "text-relief", label: "Рельефное нанесение текста", price: 2000, group: "text-style" as const },
        { id: "color-standard", label: "Коричневая крыша / белая тарелка", price: 0, group: "color" as const, isDefault: true },
        { id: "color-roof", label: "Крыша в др. цвет", price: 300, group: "color" as const },
        { id: "color-plate", label: "Тарелка в др. цвет", price: 300, group: "color" as const },
        { id: "color-full", label: "Знак полностью в др. цвет", price: 900, group: "color" as const },
        { id: "extras-address", label: "Нанесение улицы и номера дома", price: 0, group: "extras" as const, isDefault: true },
        { id: "extras-bw", label: "ЧБ рисунок", price: 1000, group: "extras" as const },
        { id: "extras-color", label: "Цветное изображение", price: 1000, group: "extras" as const },
      ],
    },
    {
      id: "classic",
      name: "Обычный",
      badge: {
        label: "Доступное решение",
        tone: "default" as const,
      },
      description:
        "Выполнен из листа стали 1 мм. Не имеет объемных элементов. Плоский. Поверхность окрашена порошковым способом в два слоя. Изображение и текст выполнены с помощью УФ-печати (устойчивой к выцветанию). Дополнительно защищен полимерной эмалью.",
      priceFrom: "1 990 ₽",
      basePrice: 1990,
      leadTime: "1–2 дня",
      size: "47×35 см",
      tabImage: {
        src: asset("/products/tabs/retroznak-1.png"),
        alt: "Обычный ретрознак",
      },
      images: [
        {
          src: asset("/products/1-1.jpg"),
          alt: "Обычный ретрознак - вид 1",
        },
        {
          src: asset("/products/1-2.jpg"),
          alt: "Обычный ретрознак - вид 2",
        },
        {
          src: asset("/products/1-3.jpg"),
          alt: "Обычный ретрознак - вид 3",
        },
        {
          src: asset("/products/1-4.png"),
          alt: "Обычный ретрознак - вид 4",
        },
        {
          src: asset("/products/1-5.png"),
          alt: "Обычный ретрознак - вид 5",
        },
      ],
      features: [
        "Размер 47×35 см",
        "Сталь толщиной 1 мм",
        "Покраска порошковым методом в два слоя",
        "УФ-печать (устойчива к выцветанию)",
        "Защита полимерной эмалью",
        "Плоский, без объемных элементов",
      ],
      equipment: [
        "3 отверстия для крепежа",
      ],
      paymentOptions: [
        "Оплата по счёту для юрлиц",
      ],
      upsells: [],
    },
  ],
  comparison: [
    {
      label: "Стоимость",
      values: {
        classic: "1 990 ₽",
        petrogradsky: "от 4 300 ₽",
        leningradsky: "от 7 000 ₽",
      },
    },
    {
      label: "Размеры (В×Ш)",
      values: {
        classic: "47×35 см",
        petrogradsky: "47×34 см",
        leningradsky: "52×40 см",
      },
    },
    {
      label: "Материал",
      values: {
        classic: "Сталь 1 мм",
        petrogradsky: "Сталь 0,7 мм",
        leningradsky: "Сталь 0,7 мм",
      },
    },
    {
      label: "Покраска",
      values: {
        classic: "Порошковая (2 слоя) + УФ-печать",
        petrogradsky: "Порошковая + полимерная эмаль",
        leningradsky: "Порошковая + полимерная эмаль",
      },
    },
    {
      label: "Подсветка",
      values: {
        classic: "Не указана",
        petrogradsky: "LED 220В 3,5 Вт (в комплекте)",
        leningradsky: "LED 220В (опция +300 ₽)",
      },
    },
    {
      label: "Особенности",
      values: {
        classic: "Плоский, УФ-печать",
        petrogradsky: "Матовые стёкла в окошках",
        leningradsky: "Ленинградский ТИП-1, оригинальный вид",
      },
    },
  ],
  cta: {
    label: "Оставить заявку на расчёт",
    targetId: "consultation",
    variant: "primary" as const,
  },
  secondaryCta: {
    label: "Нужна индивидуальная конфигурация?",
    targetId: "custom-project",
    description: "Создадим ретрознак по архивным фотографиям вашего дома.",
    variant: "ghost" as const,
  },
});
