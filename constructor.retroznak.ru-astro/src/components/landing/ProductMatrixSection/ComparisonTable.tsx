"use client";

import type { ProductComparisonRow, ProductVariant } from "@/types/content";
import { typograf } from "@/lib/typograf";

export interface ComparisonTableProps {
  rows: ProductComparisonRow[];
  variants: ProductVariant[];
}

export function ComparisonTable({ rows, variants }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative overflow-auto">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead className="bg-secondary text-muted-foreground">
            <tr>
              <th className="px-6 py-4 text-left font-medium">{typograf("Критерий")}</th>
              {variants.map((variant) => (
                <th key={variant.id} className="px-6 py-4 text-left font-medium text-card-foreground">
                  <div className="flex items-center gap-2">
                    {variant.tabImage && (
                      <img
                        src={variant.tabImage.src}
                        alt={variant.tabImage.alt}
                        width={16}
                        height={16}
                        className="h-auto w-4 object-contain"
                      />
                    )}
                    <span>{typograf(variant.name)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <th className="bg-secondary/50 px-6 py-4 text-left text-muted-foreground">{typograf(row.label)}</th>
                {variants.map((variant) => (
                  <td key={variant.id} className="px-6 py-4 text-card-foreground">
                    {typograf(row.values[variant.id])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
