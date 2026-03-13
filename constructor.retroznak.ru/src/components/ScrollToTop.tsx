"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/**
 * Кнопка "Наверх" с плавным скроллом
 * Появляется после прокрутки страницы на 300px
 */
export function ScrollToTop() {
  const { scrollToTop, getScroll } = useSmoothScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = getScroll();
      setIsVisible(currentScroll > 300);
    };

    // Проверяем позицию скролла каждые 100мс
    const interval = setInterval(handleScroll, 100);

    return () => clearInterval(interval);
  }, [getScroll]);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => scrollToTop({ duration: 1.5 })}
      className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl"
      aria-label="Прокрутить наверх"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
