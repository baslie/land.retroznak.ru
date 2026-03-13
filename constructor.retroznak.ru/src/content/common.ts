import { typograf } from "@/lib/typograf";

/**
 * Централизованный словарь часто используемых фраз
 * Все тексты обработаны типографом для единообразия
 */
export const commonTexts = {
  // Навигация
  backToHome: typograf("Назад на главную"),
  documents: typograf("Документы"),
  contacts: typograf("Контакты"),
  openMenu: typograf("Открыть меню"),
  closeMenu: typograf("Закрыть меню"),
  mainNavigation: typograf("Основная навигация"),
  quickNavigation: typograf("Быстрая навигация по разделам"),

  // Кнопки и действия
  submit: typograf("Отправить"),
  sending: typograf("Отправляем..."),
  sent: typograf("Отправлено!"),
  cancel: typograf("Отменить"),
  close: typograf("Закрыть"),
  readMore: typograf("Читать далее"),
  readLess: typograf("Свернуть"),
  ok: typograf("Понятно"),

  // Разделы сайта
  catalog: typograf("Каталог"),
  faq: typograf("FAQ"),
  reviews: typograf("Отзывы"),
  photoGallery: typograf("Фотогалерея"),
  ourWorkshop: typograf("Мастерская"),
  archivalStories: typograf("Архивные истории"),
  howWeWork: typograf("Как мы работаем"),
  readyToStart: typograf("Готовы к старту"),
  whoAreSuitable: typograf("Кому подойдут"),

  // Формы
  formErrorMessage: typograf(
    "Не удалось отправить заявку. Попробуйте ещё раз.",
  ),
  formSuccessTitle: typograf("Заявка отправлена!"),
  formSuccessRedirect: typograf("Перенаправляем на страницу благодарности..."),
  formConsentLabel: typograf(
    "Я подтверждаю ознакомление и даю согласие на обработку моих персональных данных",
  ),

  // Контакты и время работы
  workingHours: typograf("На связи в будни с 05:00 до 14:00 по Москве."),

  // CTA блоки
  ctaReady: typograf("Готовы вернуть историю вашему дому?"),
  ctaArchive: typograf(
    "Расскажем, как воспроизвести оригинальный знак по архивам.",
  ),
  ctaQuestion: typograf("Остались вопросы?"),
  ctaQuestionDesc: typograf(
    "Мы ответим в удобном формате и отправим дополнительные материалы.",
  ),
  ctaNextHero: typograf("Хотите стать следующим героем истории?"),
  ctaExamples: typograf(
    "Подберём комплектацию и покажем фото похожих проектов.",
  ),
  ctaWantExamples: typograf("Хотите примеры именно для вас?"),
  ctaWillSelect: typograf(
    "Подберём реализованные проекты и предложим идеи для фасада.",
  ),

  // Разное
  usefulMaterials: typograf("Полезные материалы"),
  connectViaMessengers: typograf("Связаться через мессенджеры"),
  weAreInSocials: typograf("Мы на связи в соцсетях"),
  paymentMethods: typograf("Способы оплаты:"),
  step: typograf("Шаг"),
} as const;

export type CommonTexts = typeof commonTexts;
