"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { CanvasRenderer, ConstructorPanel, OrderModal } from "@/components/constructor";
import { useTypograf } from "@/hooks/useTypograf";

function ConstructorContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobileLayoutRef = useRef<HTMLDivElement>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  // Определяем маленький мобильный экран (<480px)
  useEffect(() => {
    const checkSize = () => setIsSmallMobile(window.innerWidth < 480);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Отслеживание скролла для уменьшения превью (только на маленьких экранах)
  const { scrollYProgress } = useScroll({
    target: mobileLayoutRef,
    offset: ["start start", "start -100px"],
  });

  // Масштаб: 100% → 75% при скролле (только <480px)
  const scaleValue = useTransform(scrollYProgress, [0, 1], [1, 0.75]);

  const handleOrder = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <>
      {/* Мобильный лейаут - flex column для работы sticky */}
      <div ref={mobileLayoutRef} className="flex flex-col gap-4 lg:hidden">
        {/* Canvas Preview - sticky только на маленьких экранах (<480px), на планшетах (480-1024px) статичное */}
        <div className="sticky top-2 z-30 min-[480px]:static min-[480px]:z-auto">
          <motion.div
            style={isSmallMobile ? { scale: scaleValue } : undefined}
            className="origin-top bg-gradient-to-br from-secondary/80 to-secondary/90 dark:from-secondary/50 dark:to-secondary rounded-xl p-3 border border-border shadow-lg backdrop-blur-sm"
          >
            <CanvasRenderer canvasRef={canvasRef} />
          </motion.div>
        </div>

        {/* Controls Panel */}
        <div className="bg-background rounded-2xl p-4 border border-border shadow-sm">
          <ConstructorPanel canvasRef={canvasRef} onOrder={handleOrder} />
        </div>
      </div>

      {/* Десктопный лейаут - grid для двух колонок */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Canvas Preview - sticky на десктопе */}
        <div className="sticky top-4 self-start">
            <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-2xl p-6 border border-border">
              <CanvasRenderer canvasRef={canvasRef} />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Предварительный просмотр. Финальный вид может незначительно отличаться.
            </p>
        </div>

        {/* Controls Panel */}
        <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
          <ConstructorPanel canvasRef={canvasRef} onOrder={handleOrder} />
        </div>
      </div>

      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </>
  );
}

export function ConstructorSection() {
  const typografTitle = useTypograf("Конструктор ретрознака");
  const typografSubtitleLine1 = useTypograf("Настройте внешний вид знака, выберите материал и опции.");
  const typografSubtitleLine2 = useTypograf("Цена рассчитывается автоматически.");

  return (
    <section id="constructor" className="py-20 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {typografTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {typografSubtitleLine1}
            <br />
            {typografSubtitleLine2}
          </p>
        </div>

        <ConstructorContent />
      </div>
    </section>
  );
}
