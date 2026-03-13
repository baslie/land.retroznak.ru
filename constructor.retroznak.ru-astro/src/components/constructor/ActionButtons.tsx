"use client";

import { useState } from "react";
import { useConstructor } from "@/contexts/ConstructorContext";
import { Button } from "@/components/ui/button";
import { Download, ShoppingCart, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onOrder?: () => void;
}

export function ActionButtons({ canvasRef, onOrder }: ActionButtonsProps) {
  const { state, totalPrice } = useConstructor();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `retroznak-${state.signType}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Ошибка при сохранении изображения:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOrder = () => {
    if (onOrder) {
      onOrder();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="outline"
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full sm:flex-1 gap-2 rounded-xl border-2 border-border hover:border-foreground hover:bg-secondary"
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Сохранить PNG
      </Button>

      <Button
        onClick={handleOrder}
        className="w-full sm:flex-1 gap-2 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-semibold"
      >
        <ShoppingCart className="h-4 w-4" />
        Заказать за {totalPrice.toLocaleString("ru-RU")} ₽
      </Button>
    </div>
  );
}
