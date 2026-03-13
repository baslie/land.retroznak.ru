"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calculator } from "lucide-react";
import Masonry from "react-masonry-css";
import type { ProductUpsellOption, UpsellGroup, Cta } from "@/types/content";
import { typograf } from "@/lib/typograf";
import { useProductOptions } from "@/contexts/ProductOptionsContext";
import { CTAButton } from "../CTAButton";
import { getCardToneStyles, getUpsellToneStyles } from "@/lib/tones";

export interface ProductUpsellsCardProps {
  basePrice: number;
  upsells: ProductUpsellOption[];
  cta?: Cta;
  customTitle?: string;
  showIcon?: boolean;
  variantTone?: "default" | "highlight" | "premium";
  productId: string;
  productName: string;
}

const GROUP_LABELS: Record<UpsellGroup, string> = {
  lighting: "Подсветка",
  "text-style": "Стиль текста",
  steel: "Сталь",
  color: "Цвет",
  extras: "Дополнительно",
};

export function ProductUpsellsCard({ basePrice, upsells, cta, customTitle, showIcon = true, variantTone, productId, productName }: ProductUpsellsCardProps) {
  const iconStyles = getCardToneStyles(variantTone);
  const styles = getUpsellToneStyles(variantTone);
  const { setProductOptions } = useProductOptions();

  // Initialize state with default options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    upsells.forEach((option) => {
      if (option.isDefault) {
        defaults[option.group] = option.id;
      }
    });
    return defaults;
  });

  // Define group order for masonry layout
  const groupOrder: UpsellGroup[] = ["lighting", "color", "text-style", "extras", "steel"];

  // Group options by category
  const groupedOptions = useMemo(() => {
    const grouped: Record<UpsellGroup, ProductUpsellOption[]> = {
      lighting: [],
      "text-style": [],
      steel: [],
      color: [],
      extras: [],
    };
    upsells.forEach((option) => {
      grouped[option.group].push(option);
    });
    return grouped;
  }, [upsells]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    let total = basePrice;
    Object.values(selectedOptions).forEach((optionId) => {
      const option = upsells.find((u) => u.id === optionId);
      if (option) {
        total += option.price;
      }
    });
    return total;
  }, [basePrice, selectedOptions, upsells]);

  const handleOptionChange = (group: UpsellGroup, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [group]: optionId,
    }));
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("ru-RU")} ₽`;
  };

  // Update context whenever options or total price changes
  useEffect(() => {
    const selectedProductOptions = Object.values(selectedOptions).map((optionId) => {
      const option = upsells.find((u) => u.id === optionId);
      return option ? {
        id: option.id,
        label: option.label,
        price: option.price,
        group: option.group,
      } : null;
    }).filter((option): option is NonNullable<typeof option> => option !== null);

    setProductOptions({
      productId,
      productName,
      basePrice,
      selectedOptions: selectedProductOptions,
      totalPrice,
    });
  }, [selectedOptions, totalPrice, productId, productName, basePrice, upsells, setProductOptions]);

  if (upsells.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4 rounded-3xl border border-border bg-gradient-to-br from-brand-amber-50/30 via-brand-yellow-50/20 to-brand-amber-50/30 dark:from-brand-amber-950/20 dark:via-brand-yellow-950/10 dark:to-brand-amber-950/20 p-4 sm:p-5 shadow-lg shadow-brand-amber-50/20 dark:shadow-brand-amber-900/10">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`flex aspect-square h-8 sm:h-9 items-center justify-center rounded-full ${iconStyles.icon} text-white shadow-sm`}>
          {showIcon ? (
            <Plus className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden />
          ) : (
            <Calculator className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden />
          )}
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
          {typograf(customTitle || "Дополнительные опции")}
        </h3>
      </div>

      {/* Sticky Price Summary - Compact Horizontal */}
      <div className="sticky top-4 z-10 rounded-xl border border-brand-amber-400/50 dark:border-brand-amber-800/30 bg-white/80 dark:bg-black/40 backdrop-blur-sm p-3 sm:p-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>База:</span>
            <span className="font-medium text-card-foreground">{formatPrice(basePrice)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calculator className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-amber-600 dark:text-brand-amber-400" aria-hidden />
            <span className="text-xs sm:text-sm font-semibold text-card-foreground">Итого:</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={totalPrice}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-base sm:text-lg font-bold bg-gradient-to-r from-brand-amber-600 to-brand-yellow-600 dark:from-brand-amber-400 dark:to-brand-yellow-400 bg-clip-text text-transparent"
              >
                {formatPrice(totalPrice)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Options - Masonry Layout with Group Headers */}
      <Masonry
        breakpointCols={{
          default: 2,
          639: 1,
        }}
        className="flex w-auto -ml-3 sm:-ml-4"
        columnClassName="pl-3 sm:pl-4 bg-clip-padding"
      >
        {groupOrder.map((group) => {
          const options = groupedOptions[group];
          if (options.length === 0) return null;

          return (
            <Fragment key={group}>
              {/* Group Header */}
              <h4 className="text-xs sm:text-sm font-semibold text-card-foreground/80 px-1 mb-2 w-full">
                {typograf(GROUP_LABELS[group])}
              </h4>

              {/* Group Options */}
              {options.map((option) => {
                const isSelected = selectedOptions[group] === option.id;
                const showPrice = option.price !== 0;

                return (
                  <label
                    key={option.id}
                    className={`
                      flex items-center gap-2 rounded-lg border p-2 sm:p-2.5 cursor-pointer transition-all duration-200 mb-3 sm:mb-4
                      ${
                        isSelected
                          ? `${styles.borderSelected} ${styles.bgSelected} shadow-sm`
                          : `border-border ${styles.borderHover} ${styles.bgHover}`
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={`option-${group}`}
                      value={option.id}
                      checked={isSelected}
                      onChange={() => handleOptionChange(group, option.id)}
                      className={`h-3.5 w-3.5 ${styles.radio} ${styles.radioFocus} focus:ring-offset-0`}
                    />
                    <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
                      <span className={`text-xs sm:text-sm ${isSelected ? "font-medium text-card-foreground" : "text-muted-foreground"}`}>
                        {typograf(option.label)}
                      </span>
                      {showPrice && (
                        <span className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${isSelected ? styles.textSelected : "text-muted-foreground"}`}>
                          +{formatPrice(option.price)}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </Fragment>
          );
        })}
      </Masonry>

      <p className="text-[10px] sm:text-xs text-muted-foreground/70 pt-2 border-t border-brand-amber-400/30 dark:border-brand-amber-800/20">
        {typograf("Выберите нужные опции — итоговая стоимость обновится автоматически")}
      </p>

      {/* CTA Button */}
      {cta && (
        <div className="pt-2">
          <CTAButton cta={cta} className="w-full justify-center" />
        </div>
      )}
    </div>
  );
}
