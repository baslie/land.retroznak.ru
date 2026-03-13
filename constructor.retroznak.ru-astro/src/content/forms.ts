import type { ContactFormDefinition } from "@/types/forms";
import { typografContent } from "@/lib/typograf";

const messengerOptions: ContactFormDefinition["fields"][number]["options"] = [
  { label: "MAX", value: "max" },
  { label: "Telegram", value: "telegram" },
  { label: "Телефон", value: "phone" },
];

export const contactFormsContent = typografContent({
  eyebrow: "Связаться с нами",
  title: "Оставьте заявку на ретрознак",
  description:
    "Ответим на вопросы, подготовим подборку примеров и пришлём бесплатный макет в течение рабочего дня.",
  forms: {
    callback: {
      id: "callback",
      title: "Заказать обратный звонок",
      description:
        "Мы перезвоним в течение 15 минут в рабочее время и подберём примеры реализованных проектов.",
      submitLabel: "Жду звонка",
      successMessage: "Спасибо! Мы свяжемся с вами в течение рабочего времени.",
      contactReason: "callback",
      fields: [
        {
          name: "name",
          label: "Ваше имя",
          placeholder: "Как к вам обращаться",
          type: "text",
          required: true,
          autoComplete: "name",
        },
        {
          name: "phone",
          label: "Телефон",
          placeholder: "+7 (___) ___-__-__",
          type: "tel",
          required: true,
          autoComplete: "tel",
          inputMode: "tel",
        },
        {
          name: "comment",
          label: "Комментарий",
          placeholder: "Расскажите, что вас интересует",
          type: "textarea",
          rows: 3,
        },
        {
          name: "consent",
          label: "Я подтверждаю ознакомление и даю согласие на обработку моих персональных данных",
          type: "checkbox",
          required: true,
        },
      ],
    } satisfies ContactFormDefinition,
    consultation: {
      id: "consultation",
      title: "Получить расчёт и макет",
      description: "Подготовим расчёт и макет в течение 2 часов.",
      submitLabel: "Отправить заявку",
      successMessage: "Спасибо! Мы подготовим расчёт и ответим в ближайшее время.",
      contactReason: "consultation",
      aliasTargetIds: ["timeline-form", "custom-project"],
      fields: [
        {
          name: "name",
          label: "Ваше имя",
          placeholder: "Как к вам обращаться",
          type: "text",
          required: true,
          autoComplete: "name",
        },
        {
          name: "phone",
          label: "Телефон",
          placeholder: "+7 (___) ___-__-__",
          type: "tel",
          required: true,
          autoComplete: "tel",
          inputMode: "tel",
        },
        {
          name: "address",
          label: "Адрес (населенный пункт, улица, дом)",
          placeholder: "Город, улица, дом или описание объекта",
          type: "text",
          required: false,
          autoComplete: "street-address",
        },
        {
          name: "messenger",
          label: "Как связаться",
          placeholder: "Выберите вариант",
          type: "select",
          required: true,
          options: messengerOptions,
        },
        {
          name: "comment",
          label: "Комментарий",
          placeholder: "Расскажите про проект, размеры или пожелания",
          type: "textarea",
          rows: 2,
        },
        {
          name: "consent",
          label: "Я подтверждаю ознакомление и даю согласие на обработку моих персональных данных",
          type: "checkbox",
          required: true,
        },
      ],
    } satisfies ContactFormDefinition,
    question: {
      id: "question",
      title: "Задать вопрос",
      description:
        "Ответим на любой вопрос о материалах, доставке или индивидуальном изготовлении ретрознаков.",
      submitLabel: "Отправить",
      successMessage: "Спасибо! Мы подготовим ответ и свяжемся с вами.",
      contactReason: "question",
      fields: [
        {
          name: "name",
          label: "Ваше имя",
          placeholder: "Как к вам обращаться",
          type: "text",
          required: true,
          autoComplete: "name",
        },
        {
          name: "phone",
          label: "Телефон",
          placeholder: "+7 (___) ___-__-__",
          type: "tel",
          required: true,
          autoComplete: "tel",
          inputMode: "tel",
        },
        {
          name: "comment",
          label: "Ваш вопрос",
          placeholder: "Опишите, что вы хотите уточнить",
          type: "textarea",
          rows: 4,
          required: true,
        },
        {
          name: "consent",
          label: "Я подтверждаю ознакомление и даю согласие на обработку моих персональных данных",
          type: "checkbox",
          required: true,
        },
      ],
    } satisfies ContactFormDefinition,
  },
});

export type ContactFormContent = typeof contactFormsContent;
