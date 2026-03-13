"use client";

import { Calculator } from "lucide-react";
import type { Cta } from "@/types/content";
import { typograf } from "@/lib/typograf";
import { CTAButton } from "../CTAButton";
import { getCardToneStyles } from "@/lib/tones";

export interface ProductCTACardProps {
  cta: Cta;
  className?: string;
  paymentOptions?: string[];
  variantTone?: "default" | "highlight" | "premium";
}

export function ProductCTACard({ cta, className = "", paymentOptions, variantTone }: ProductCTACardProps) {
  const styles = getCardToneStyles(variantTone);

  return (
    <div className={`space-y-4 sm:space-y-6 rounded-3xl border border-border bg-card p-4 sm:p-6 max-w-full overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`flex aspect-square h-8 sm:h-9 items-center justify-center rounded-full ${styles.icon} text-white shadow-sm`}>
          <Calculator className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground break-words">
          {typograf("Оставить заявку на расчёт")}
        </h3>
      </div>
      <CTAButton cta={cta} className="w-full justify-center" />
      <p className="text-[11px] sm:text-xs text-muted-foreground/80 break-words">
        {typograf("После выбора модели оставьте заявку через форму ниже — менеджер подготовит расчёт и пришлёт примеры.")}
      </p>
      {paymentOptions && paymentOptions.length > 0 && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs font-medium text-card-foreground mb-2">
            {typograf("Способы оплаты:")}
          </p>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {paymentOptions.map((option) => (
              <li key={option} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary flex-shrink-0" aria-hidden />
                <span>{typograf(option)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
