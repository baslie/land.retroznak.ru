/**
 * Централизованная система тонов (цветовых схем) для компонентов сайта
 *
 * Все цвета управляются через CSS-переменные в tailwind.css
 * Изменяя переменные в одном месте, вы меняете цвета по всему сайту
 */

export type ToneType = "default" | "highlight" | "premium";

export interface ToneStyles {
  /** Градиентный фон карточки */
  gradient: string;
  /** Тень карточки */
  shadow: string;
  /** Тень при hover */
  hoverShadow: string;
  /** Ring (обводка) для активного состояния */
  ring: string;
  /** Цвета badge (лейбл) */
  badge: string;
  /** Градиент для иконки */
  icon: string;
  /** Цвет bullet point (маркер списка) */
  bullet: string;
  /** Цвет radio button */
  radio: string;
  /** Focus ring для radio button */
  radioFocus: string;
  /** Border цвет для выбранного элемента */
  borderSelected: string;
  /** Background для выбранного элемента */
  bgSelected: string;
  /** Border цвет при hover */
  borderHover: string;
  /** Background при hover */
  bgHover: string;
  /** Цвет текста для выбранного элемента */
  textSelected: string;
}

/**
 * Получить стили для заданного тона
 *
 * @param tone - Тип тона ("default", "highlight", "premium")
 * @returns Объект со всеми стилями для данного тона
 *
 * @example
 * const styles = getToneStyles("premium");
 * <div className={`${styles.gradient} ${styles.shadow}`}>...</div>
 */
export function getToneStyles(tone?: ToneType): ToneStyles {
  switch (tone) {
    case "highlight":
      return {
        gradient: "bg-gradient-to-br from-tone-highlight-50/80 via-tone-highlight-50/60 to-tone-highlight-50/80 dark:from-tone-highlight-950/30 dark:via-tone-highlight-950/20 dark:to-tone-highlight-950/30",
        shadow: "shadow-md shadow-tone-highlight-100/50 dark:shadow-tone-highlight-900/20",
        hoverShadow: "hover:shadow-xl hover:shadow-tone-highlight-200/60 dark:hover:shadow-tone-highlight-800/30",
        ring: "ring-2 ring-tone-highlight-300/60 dark:ring-tone-highlight-500/40",
        badge: "border-tone-highlight-400/50 bg-tone-highlight-100/80 text-tone-highlight-700 dark:border-tone-highlight-500/40 dark:bg-tone-highlight-900/40 dark:text-tone-highlight-300",
        icon: "bg-gradient-to-br from-tone-highlight-500 to-tone-highlight-600",
        bullet: "bg-tone-highlight-600 dark:bg-tone-highlight-400",
        radio: "accent-tone-highlight-600",
        radioFocus: "focus:ring-tone-highlight-500",
        borderSelected: "border-tone-highlight-400 dark:border-tone-highlight-600",
        bgSelected: "bg-tone-highlight-50/50 dark:bg-tone-highlight-950/30",
        borderHover: "hover:border-tone-highlight-300 dark:hover:border-tone-highlight-700",
        bgHover: "hover:bg-tone-highlight-50/30 dark:hover:bg-tone-highlight-950/20",
        textSelected: "text-tone-highlight-700 dark:text-tone-highlight-400",
      };

    case "premium":
      return {
        gradient: "bg-gradient-to-br from-tone-premium-50/80 via-brand-amber-50/60 to-tone-premium-50/80 dark:from-tone-premium-950/30 dark:via-brand-amber-950/20 dark:to-tone-premium-950/30",
        shadow: "shadow-md shadow-tone-premium-100/50 dark:shadow-tone-premium-900/20",
        hoverShadow: "hover:shadow-xl hover:shadow-tone-premium-200/60 dark:hover:shadow-tone-premium-800/30",
        ring: "ring-2 ring-tone-premium-300/60 dark:ring-tone-premium-500/40",
        badge: "border-tone-premium-400/50 bg-tone-premium-100/80 text-tone-premium-700 dark:border-tone-premium-500/40 dark:bg-tone-premium-900/40 dark:text-tone-premium-300",
        icon: "bg-gradient-to-br from-brand-orange-500 to-brand-amber-600",
        bullet: "bg-brand-orange-600 dark:bg-tone-premium-400",
        radio: "accent-brand-orange-600",
        radioFocus: "focus:ring-brand-orange-500",
        borderSelected: "border-tone-premium-400 dark:border-brand-orange-600",
        bgSelected: "bg-tone-premium-50/50 dark:bg-tone-premium-950/30",
        borderHover: "hover:border-tone-premium-300 dark:hover:border-tone-premium-700",
        bgHover: "hover:bg-tone-premium-50/30 dark:hover:bg-tone-premium-950/20",
        textSelected: "text-tone-premium-700 dark:text-tone-premium-400",
      };

    default:
      return {
        gradient: "bg-gradient-to-br from-tone-default-50/80 via-tone-default-50/60 to-tone-default-50/80 dark:from-tone-default-950/30 dark:via-tone-default-950/20 dark:to-tone-default-950/30",
        shadow: "shadow-md shadow-tone-default-100/50 dark:shadow-tone-default-900/20",
        hoverShadow: "hover:shadow-xl hover:shadow-tone-default-200/60 dark:hover:shadow-tone-default-800/30",
        ring: "ring-2 ring-tone-default-300/60 dark:ring-tone-default-500/40",
        badge: "border-tone-default-400/50 bg-tone-default-100/80 text-tone-default-700 dark:border-tone-default-500/40 dark:bg-tone-default-900/40 dark:text-tone-default-300",
        icon: "bg-gradient-to-br from-tone-default-500 to-tone-default-600",
        bullet: "bg-tone-default-600 dark:bg-tone-default-400",
        radio: "accent-brand-amber-600",
        radioFocus: "focus:ring-brand-amber-500",
        borderSelected: "border-brand-amber-400 dark:border-brand-amber-600",
        bgSelected: "bg-brand-amber-50/50 dark:bg-brand-amber-950/30",
        borderHover: "hover:border-brand-amber-300 dark:hover:border-brand-amber-700",
        bgHover: "hover:bg-brand-amber-50/30 dark:hover:bg-brand-amber-950/20",
        textSelected: "text-brand-amber-700 dark:text-brand-amber-400",
      };
  }
}

/**
 * Упрощенная версия getToneStyles для компонентов,
 * которым нужны только базовые стили (gradient, icon, bullet)
 */
export function getCardToneStyles(tone?: ToneType) {
  const styles = getToneStyles(tone);
  return {
    gradient: styles.gradient,
    icon: styles.icon,
    bullet: styles.bullet,
  };
}

/**
 * Получить стили для tab компонентов
 */
export function getTabToneStyles(tone?: ToneType) {
  const styles = getToneStyles(tone);
  return {
    gradient: styles.gradient,
    shadow: styles.shadow,
    hoverShadow: styles.hoverShadow,
    ring: styles.ring,
    badge: styles.badge,
  };
}

/**
 * Получить стили для upsells компонентов (radio buttons)
 */
export function getUpsellToneStyles(tone?: ToneType) {
  const styles = getToneStyles(tone);
  return {
    icon: styles.icon,
    radio: styles.radio,
    radioFocus: styles.radioFocus,
    borderSelected: styles.borderSelected,
    bgSelected: styles.bgSelected,
    borderHover: styles.borderHover,
    bgHover: styles.bgHover,
    textSelected: styles.textSelected,
  };
}

/**
 * Получить стили для Payment Card (purple/violet цвета)
 */
export function getPaymentCardStyles() {
  return {
    gradient: "bg-gradient-to-br from-accent-payment-purple-50/20 via-accent-payment-violet-50/10 to-accent-payment-purple-50/20 dark:from-accent-payment-purple-950/10 dark:via-accent-payment-violet-950/5 dark:to-accent-payment-purple-950/10",
    icon: "bg-gradient-to-br from-accent-payment-purple-500 to-accent-payment-violet-600",
    bullet: "bg-accent-payment-purple-600 dark:bg-accent-payment-purple-400",
  };
}

/**
 * Получить стили для Price Info Card (green/emerald цвета)
 */
export function getPriceCardStyles() {
  return {
    gradient: "bg-gradient-to-br from-accent-price-green-50/20 via-accent-price-emerald-50/10 to-accent-price-green-50/20 dark:from-accent-price-green-950/10 dark:via-accent-price-emerald-950/5 dark:to-accent-price-green-950/10",
  };
}
