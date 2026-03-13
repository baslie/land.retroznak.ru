"use client";

import { useConstructor } from "@/contexts/ConstructorContext";
import { useTypograf } from "@/hooks/useTypograf";
import { priceConfig } from "@/content/constructor-config";
import { cn } from "@/lib/utils";

interface OptionItemProps {
  id: string;
  label: string;
  description: string;
  price: number;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function OptionItem({ id, label, description, price, checked, onChange, disabled }: OptionItemProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
        checked
          ? "border-brand-orange-500 bg-brand-orange-500/10"
          : "border-border bg-background hover:border-foreground",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 rounded border-border text-brand-orange-500 focus:ring-brand-orange-500"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            "text-sm font-medium",
            checked ? "text-brand-orange-700 dark:text-brand-orange-400" : "text-foreground"
          )}>
            {label}
          </span>
          <span className={cn(
            "text-xs whitespace-nowrap",
            checked ? "text-brand-orange-600 dark:text-brand-orange-400" : "text-muted-foreground"
          )}>
            +{price.toLocaleString("ru-RU")} ₽
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </label>
  );
}

export function OptionsPanel() {
  const { state, toggleRelief, toggleBacklight, togglePhotoRelay } = useConstructor();
  const photoRelayHint = useTypograf("Фотореле доступно только при выборе подсветки");

  const options = [
    {
      id: "relief",
      label: "Рельефный текст",
      description: "Объёмные буквы и цифры для лучшей читаемости",
      price: priceConfig.options.reliefSymbols,
      checked: state.hasRelief,
      onChange: toggleRelief,
    },
    {
      id: "backlight",
      label: "Подсветка",
      description: "LED-подсветка для видимости в тёмное время",
      price: priceConfig.options.backlight,
      checked: state.hasBacklight,
      onChange: toggleBacklight,
    },
    {
      id: "photoRelay",
      label: "Фотореле",
      description: "Автоматическое включение подсветки при наступлении темноты",
      price: priceConfig.options.photoRelay,
      checked: state.hasPhotoRelay,
      onChange: togglePhotoRelay,
      disabled: !state.hasBacklight,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Дополнительные опции
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <OptionItem key={option.id} {...option} />
        ))}
      </div>
      {!state.hasBacklight && state.hasPhotoRelay && (
        <p className="text-xs text-amber-600">
          {photoRelayHint}
        </p>
      )}
    </div>
  );
}
