"use client";

import { useConstructor } from "@/contexts/ConstructorContext";
import {
  priceConfig,
  signTypesConfig,
  defaultRoofColor,
  defaultPlateColor,
  materialNames,
} from "@/content/constructor-config";
import { motion, AnimatePresence } from "framer-motion";

interface PriceLineProps {
  label: string;
  value: number;
  isBase?: boolean;
}

function PriceLine({ label, value, isBase }: PriceLineProps) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={isBase ? "text-foreground font-medium" : "text-muted-foreground"}>
        {label}
      </span>
      <span className={isBase ? "text-foreground font-medium" : "text-muted-foreground"}>
        {isBase ? "" : "+"}{value.toLocaleString("ru-RU")} ₽
      </span>
    </div>
  );
}

export function PriceDisplay() {
  const { state, totalPrice } = useConstructor();

  const basePrice = priceConfig.base[state.signType];
  const signConfig = signTypesConfig[state.signType];

  // Расчёт надбавок
  const materialSurcharge =
    state.material === "regular"
      ? 0
      : state.material === "galvanized"
        ? priceConfig.material.galvanized[state.signType]
        : priceConfig.material.stainless[state.signType];

  const isNonStandardRoof = state.roofColor !== defaultRoofColor;
  const isNonStandardPlate = state.plateColor !== defaultPlateColor;
  const colorSurcharge =
    isNonStandardRoof && isNonStandardPlate
      ? priceConfig.colorSurcharge.twoColors
      : isNonStandardRoof || isNonStandardPlate
        ? priceConfig.colorSurcharge.oneColor
        : 0;

  const reliefSurcharge = state.hasRelief ? priceConfig.options.reliefSymbols : 0;
  const backlightSurcharge = state.hasBacklight ? priceConfig.options.backlight : 0;
  const photoRelaySurcharge = state.hasPhotoRelay ? priceConfig.options.photoRelay : 0;

  return (
    <div className="bg-gradient-to-br from-secondary/50 to-background rounded-2xl border border-border p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Расчёт стоимости</h3>

      <div className="space-y-1.5">
        <PriceLine
          label={`${signConfig.name} (${signConfig.size})`}
          value={basePrice}
          isBase
        />

        {materialSurcharge > 0 && (
          <PriceLine label={materialNames[state.material]} value={materialSurcharge} />
        )}

        {colorSurcharge > 0 && (
          <PriceLine
            label={isNonStandardRoof && isNonStandardPlate ? "Нестандартные цвета (2)" : "Нестандартный цвет"}
            value={colorSurcharge}
          />
        )}

        {reliefSurcharge > 0 && (
          <PriceLine label="Рельефный текст" value={reliefSurcharge} />
        )}

        {backlightSurcharge > 0 && (
          <PriceLine label="Подсветка" value={backlightSurcharge} />
        )}

        {photoRelaySurcharge > 0 && (
          <PriceLine label="Фотореле" value={photoRelaySurcharge} />
        )}
      </div>

      <div className="pt-3 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-foreground">Итого:</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={totalPrice}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-bold text-brand-orange-600"
            >
              {totalPrice.toLocaleString("ru-RU")} ₽
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
