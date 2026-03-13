"use client";

import { useConstructor } from "@/contexts/ConstructorContext";
import { useTypograf } from "@/hooks/useTypograf";
import { Input } from "@/components/ui/input";
import { inputLimits } from "@/content/constructor-config";

export function TextInputs() {
  const { state, setStreet, setHouseNumber } = useConstructor();
  const streetHint = useTypograf("Введите название улицы с сокращением (ул., пер., просп.)");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="street"
          className="block text-sm font-medium text-foreground"
        >
          Улица
        </label>
        <Input
          id="street"
          type="text"
          placeholder="Например: ул. Пушкина"
          value={state.street}
          onChange={(e) => setStreet(e.target.value)}
          maxLength={inputLimits.streetMaxLength}
          className="rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          {streetHint}
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="houseNumber"
          className="block text-sm font-medium text-foreground"
        >
          Номер дома
        </label>
        <Input
          id="houseNumber"
          type="text"
          placeholder="10"
          value={state.houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
          maxLength={inputLimits.houseMaxLength}
          className="rounded-xl w-32"
        />
      </div>
    </div>
  );
}
