"use client";

import { useConstructor } from "@/contexts/ConstructorContext";
import { useTypograf } from "@/hooks/useTypograf";
import {
  roofColorOptions,
  plateColorOptions,
  ralColorsCatalog,
  defaultRoofColor,
  defaultPlateColor,
  priceConfig,
} from "@/content/constructor-config";
import { cn } from "@/lib/utils";

interface ColorButtonProps {
  colorCode: string;
  isSelected: boolean;
  isDefault: boolean;
  onClick: () => void;
}

function ColorButton({ colorCode, isSelected, isDefault, onClick }: ColorButtonProps) {
  const color = ralColorsCatalog[colorCode];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-10 h-10 rounded-lg border-2 transition-all relative cursor-pointer",
        isSelected
          ? "border-brand-orange-500 ring-2 ring-brand-orange-300 ring-offset-1 ring-offset-background"
          : "border-border hover:border-foreground"
      )}
      style={{ backgroundColor: color?.colorInfo || "#ccc" }}
      title={`RAL ${colorCode}`}
    >
      {isDefault && !isSelected && (
        <span
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"
          title="Цвет по умолчанию (без надбавки)"
        />
      )}
    </button>
  );
}

export function ColorPicker() {
  const { state, setRoofColor, setPlateColor } = useConstructor();
  const colorSurchargeText = useTypograf("Нестандартный цвет:");

  const isNonStandardRoof = state.roofColor !== defaultRoofColor;
  const isNonStandardPlate = state.plateColor !== defaultPlateColor;
  const colorSurcharge =
    isNonStandardRoof && isNonStandardPlate
      ? priceConfig.colorSurcharge.twoColors
      : isNonStandardRoof || isNonStandardPlate
        ? priceConfig.colorSurcharge.oneColor
        : 0;

  return (
    <div className="space-y-6">
      {/* Цвет крыши */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Цвет крыши
          <span className="text-xs text-muted-foreground ml-2">RAL {state.roofColor}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {roofColorOptions.map((colorCode) => (
            <ColorButton
              key={colorCode}
              colorCode={colorCode}
              isSelected={state.roofColor === colorCode}
              isDefault={colorCode === defaultRoofColor}
              onClick={() => setRoofColor(colorCode)}
            />
          ))}
        </div>
      </div>

      {/* Цвет тарелки */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Цвет тарелки
          <span className="text-xs text-muted-foreground ml-2">RAL {state.plateColor}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {plateColorOptions.map((colorCode) => (
            <ColorButton
              key={colorCode}
              colorCode={colorCode}
              isSelected={state.plateColor === colorCode}
              isDefault={colorCode === defaultPlateColor}
              onClick={() => setPlateColor(colorCode)}
            />
          ))}
        </div>
      </div>

      {/* Информация о надбавке */}
      {colorSurcharge > 0 && (
        <div className="text-xs text-brand-orange-600 dark:text-brand-orange-400 bg-brand-orange-500/10 px-3 py-2 rounded-lg">
          {colorSurchargeText} +{colorSurcharge.toLocaleString("ru-RU")} ₽
        </div>
      )}
    </div>
  );
}
