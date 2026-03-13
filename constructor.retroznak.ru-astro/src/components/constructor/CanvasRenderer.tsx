"use client";

import { useEffect } from "react";
import { useConstructor } from "@/contexts/ConstructorContext";
import { useCanvasRenderer } from "./useCanvasRenderer";
import { canvasDimensions } from "@/content/constructor-config";
import { Loader2 } from "lucide-react";

interface CanvasRendererProps {
  className?: string;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export function CanvasRenderer({ className = "", canvasRef: externalRef }: CanvasRendererProps) {
  const { state, totalPrice } = useConstructor();
  const { canvasRef: internalRef, isLoading, fontsLoaded } = useCanvasRenderer({
    state,
    totalPrice,
  });

  // Синхронизируем внешний ref с внутренним
  useEffect(() => {
    if (externalRef && internalRef.current) {
      (externalRef as React.MutableRefObject<HTMLCanvasElement | null>).current = internalRef.current;
    }
  }, [externalRef, internalRef]);

  const canvasRef = internalRef;

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        className="w-full h-auto max-w-full rounded-lg shadow-lg"
      />

      {/* Индикатор загрузки */}
      {(isLoading || !fontsLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-brand-orange-500" />
            <span className="text-sm text-muted-foreground">
              {!fontsLoaded ? "Загрузка шрифтов..." : "Рендеринг..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
