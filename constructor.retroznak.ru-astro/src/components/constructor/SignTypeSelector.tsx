"use client";

import { useConstructor } from "@/contexts/ConstructorContext";
import { useTypograf } from "@/hooks/useTypograf";
import { signTypesConfig } from "@/content/constructor-config";
import type { SignTypeId } from "@/types/constructor";
import { cn } from "@/lib/utils";

const signTypes: { id: SignTypeId; label: string }[] = [
  { id: "len", label: "Ленинградский" },
  { id: "pet", label: "Петроградский" },
  { id: "mini", label: "Мини" },
];

export function SignTypeSelector() {
  const { state, setSignType } = useConstructor();
  const signTypeLabel = useTypograf("Тип домового знака");

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {signTypeLabel}
      </label>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
        {signTypes.map((type) => {
          const config = signTypesConfig[type.id];
          const isSelected = state.signType === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setSignType(type.id)}
              className={cn(
                "flex-1 min-w-[100px] px-4 py-3 rounded-xl border-2 transition-all cursor-pointer",
                "text-sm font-medium text-center",
                isSelected
                  ? "border-brand-orange-500 bg-brand-orange-500/10 text-brand-orange-700 dark:text-brand-orange-400"
                  : "border-border bg-background text-muted-foreground hover:border-foreground"
              )}
            >
              <div className="font-semibold">{type.label}</div>
              <div className="text-xs opacity-70 mt-1">{config.size}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
