"use client";

import { FileText, CheckCircle2, Clock, Wallet, CreditCard, HandCoins } from "lucide-react";
import { typograf } from "@/lib/typograf";
import { getCardToneStyles } from "@/lib/tones";

export interface ProductDescriptionCardProps {
  description: string;
  priceFrom?: string;
  leadTime?: string;
  variantTone?: "default" | "highlight" | "premium";
  paymentOptions?: string[];
}

function getPaymentIcon(paymentOption: string) {
  const option = paymentOption.toLowerCase();
  if (option.includes("предоплата") || option.includes("безналичный")) {
    return CreditCard;
  }
  if (option.includes("рассрочка")) {
    return Wallet;
  }
  if (option.includes("оплата при получении") || option.includes("персональный")) {
    return HandCoins;
  }
  return CreditCard;
}

export function ProductDescriptionCard({ description, priceFrom, leadTime, variantTone, paymentOptions }: ProductDescriptionCardProps) {
  if (!description) {
    return null;
  }

  const styles = getCardToneStyles(variantTone);

  return (
    <div className={`space-y-3 sm:space-y-4 rounded-3xl border border-border ${styles.gradient} p-4 sm:p-5`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`flex aspect-square h-8 sm:h-9 items-center justify-center rounded-full ${styles.icon} text-white shadow-sm`}>
          <FileText className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
          {typograf("Описание")}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {typograf(description)}
      </p>
      {(priceFrom || leadTime || (paymentOptions && paymentOptions.length > 0)) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {priceFrom && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden />
              {typograf(priceFrom)}
            </span>
          )}
          {leadTime && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" aria-hidden />
              {typograf(leadTime)}
            </span>
          )}
          {paymentOptions && paymentOptions.map((option) => {
            const Icon = getPaymentIcon(option);
            return (
              <span key={option} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground">
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                {typograf(option)}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
