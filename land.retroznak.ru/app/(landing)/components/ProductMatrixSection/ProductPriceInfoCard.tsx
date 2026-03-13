"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { typograf } from "@/lib/typograf";
import { getPriceCardStyles } from "@/lib/tones";

export interface ProductPriceInfoCardProps {
  priceFrom?: string;
  leadTime?: string;
}

export function ProductPriceInfoCard({ priceFrom, leadTime }: ProductPriceInfoCardProps) {
  if (!priceFrom && !leadTime) {
    return null;
  }

  const styles = getPriceCardStyles();

  return (
    <div className={`space-y-3 sm:space-y-4 rounded-3xl border border-border ${styles.gradient} p-4 sm:p-5 shadow-sm`}>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {priceFrom && (
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />
            {typograf(priceFrom)}
          </span>
        )}
        {leadTime && (
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4 text-primary" aria-hidden />
            {typograf(leadTime)}
          </span>
        )}
      </div>
    </div>
  );
}
