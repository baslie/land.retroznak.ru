"use client";

import { SignTypeSelector } from "./SignTypeSelector";
import { TextInputs } from "./TextInputs";
import { MaterialSelector } from "./MaterialSelector";
import { ColorPicker } from "./ColorPicker";
import { OptionsPanel } from "./OptionsPanel";
import { PriceDisplay } from "./PriceDisplay";
import { ActionButtons } from "./ActionButtons";

interface ConstructorPanelProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onOrder?: () => void;
}

export function ConstructorPanel({ canvasRef, onOrder }: ConstructorPanelProps) {
  return (
    <div className="space-y-6">
      {/* Тип знака */}
      <SignTypeSelector />

      {/* Текст */}
      <TextInputs />

      {/* Материал */}
      <MaterialSelector />

      {/* Цвета */}
      <ColorPicker />

      {/* Опции */}
      <OptionsPanel />

      {/* Цена */}
      <PriceDisplay />

      {/* Кнопки */}
      <ActionButtons canvasRef={canvasRef} onOrder={onOrder} />
    </div>
  );
}
