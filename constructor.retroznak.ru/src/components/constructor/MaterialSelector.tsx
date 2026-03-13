"use client";

import { useConstructor } from "@/contexts/ConstructorContext";
import { priceConfig } from "@/content/constructor-config";
import type { MaterialType } from "@/types/constructor";
import { cn } from "@/lib/utils";

const materials: { id: MaterialType; label: string }[] = [
  { id: "regular", label: "Обычная сталь" },
  { id: "galvanized", label: "Оцинкованная сталь" },
  { id: "stainless", label: "Нержавеющая сталь" },
];

export function MaterialSelector() {
  const { state, setMaterial } = useConstructor();

  const getSurcharge = (materialId: MaterialType): number => {
    if (materialId === "regular") return 0;
    if (materialId === "galvanized") {
      return priceConfig.material.galvanized[state.signType];
    }
    return priceConfig.material.stainless[state.signType];
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Материал
      </label>
      <div className="space-y-2">
        {materials.map((material) => {
          const isSelected = state.material === material.id;
          const surcharge = getSurcharge(material.id);

          return (
            <button
              key={material.id}
              type="button"
              onClick={() => setMaterial(material.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all cursor-pointer",
                "text-sm text-left",
                isSelected
                  ? "border-brand-orange-500 bg-brand-orange-500/10"
                  : "border-border bg-background hover:border-foreground"
              )}
            >
              <span className={isSelected ? "text-brand-orange-700 dark:text-brand-orange-400 font-medium" : "text-muted-foreground"}>
                {material.label}
              </span>
              {surcharge > 0 && (
                <span className={cn(
                  "text-xs",
                  isSelected ? "text-brand-orange-600 dark:text-brand-orange-400" : "text-muted-foreground"
                )}>
                  +{surcharge.toLocaleString("ru-RU")} ₽
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
