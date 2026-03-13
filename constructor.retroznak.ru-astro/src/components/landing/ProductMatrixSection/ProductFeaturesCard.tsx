"use client";

import { PackageOpen } from "lucide-react";
import { typograf } from "@/lib/typograf";
import { getCardToneStyles } from "@/lib/tones";

export interface ProductFeaturesCardProps {
  features: string[];
  variantTone?: "default" | "highlight" | "premium";
}

export function ProductFeaturesCard({ features, variantTone }: ProductFeaturesCardProps) {
  if (features.length === 0) {
    return null;
  }

  const styles = getCardToneStyles(variantTone);

  return (
    <div className={`space-y-3 sm:space-y-4 rounded-3xl border border-border ${styles.gradient} p-4 sm:p-5`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`flex aspect-square h-8 sm:h-9 items-center justify-center rounded-full ${styles.icon} text-white shadow-sm`}>
          <PackageOpen className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
          {typograf("Особенности")}
        </h3>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {features.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${styles.bullet} flex-shrink-0`} aria-hidden />
            <span>{typograf(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
