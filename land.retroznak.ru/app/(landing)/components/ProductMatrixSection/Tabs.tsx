"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";

import type { ProductVariant } from "@/types/content";
import { typograf } from "@/lib/typograf";
import { getTabToneStyles } from "@/lib/tones";

export interface ProductTabsProps {
  items: ProductVariant[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function ProductTabs({ items, activeId, onSelect }: ProductTabsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
      {items.map((variant) => {
        const isActive = activeId === variant.id;
        const styles = getTabToneStyles(variant.badge?.tone);

        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant.id)}
            className={`
              group relative overflow-hidden rounded-2xl border border-border
              ${styles.gradient} ${styles.shadow} ${styles.hoverShadow}
              px-3 py-3 sm:px-5 sm:py-4 text-left text-sm
              transition-all duration-300 ease-out
              hover:scale-[1.02] hover:-translate-y-0.5
              cursor-pointer backdrop-blur-md
              ${isActive ? styles.ring : ""}
            `}
          >
            {isActive ? (
              <motion.span
                layoutId="product-tab-highlight"
                className={`absolute inset-0 rounded-2xl ${styles.ring} bg-gradient-to-br from-white/20 to-white/5 dark:from-white/5 dark:to-white/0`}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                aria-hidden
              />
            ) : null}
            {variant.tabImage ? (
              <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-[130%] w-auto aspect-square pointer-events-none z-0">
                <Image
                  src={variant.tabImage.src}
                  alt={variant.tabImage.alt}
                  fill
                  sizes="(min-width: 640px) 200px, 150px"
                  className="object-contain"
                />
              </div>
            ) : null}
            <span className="relative z-10 flex flex-col gap-1.5 sm:gap-2">
              <span className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-semibold text-card-foreground">
                {typograf(variant.name)}
                {variant.badge ? (
                  <span
                    className={`rounded-full border px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] font-semibold ${styles.badge}`}
                  >
                    {typograf(variant.badge.label)}
                  </span>
                ) : null}
              </span>
              {(variant.priceFrom || variant.size) ? (
                <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-card-foreground/80">
                  {variant.priceFrom ? <span>{typograf(variant.priceFrom)}</span> : null}
                  {variant.priceFrom && variant.size ? <span className="opacity-50">•</span> : null}
                  {variant.size ? (
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3 w-3 opacity-60" />
                      <span>{typograf(variant.size)}</span>
                    </span>
                  ) : null}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
