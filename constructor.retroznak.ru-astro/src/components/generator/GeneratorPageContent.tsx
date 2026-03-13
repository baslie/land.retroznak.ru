"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { ConstructorProvider } from "@/contexts/ConstructorContext";
import { CanvasRenderer, ConstructorPanel, OrderModal } from "@/components/constructor";
import { useTypograf } from "@/hooks/useTypograf";
import { Button } from "@/components/ui/button";

function ConstructorContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobileLayoutRef = useRef<HTMLDivElement>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsSmallMobile(window.innerWidth < 480);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mobileLayoutRef,
    offset: ["start start", "start -100px"],
  });

  const scaleValue = useTransform(scrollYProgress, [0, 1], [1, 0.75]);

  const handleOrder = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <div ref={mobileLayoutRef} className="flex flex-col gap-4 lg:hidden">
        <div className="sticky top-[73px] z-30 min-[480px]:static min-[480px]:z-auto">
          <motion.div
            style={isSmallMobile ? { scale: scaleValue } : undefined}
            className="origin-top bg-gradient-to-br from-secondary/80 to-secondary/90 dark:from-secondary/50 dark:to-secondary rounded-xl p-3 border border-border shadow-lg backdrop-blur-sm"
          >
            <CanvasRenderer canvasRef={canvasRef} />
          </motion.div>
        </div>

        <div className="bg-background rounded-2xl p-4 border border-border shadow-sm">
          <ConstructorPanel canvasRef={canvasRef} onOrder={handleOrder} />
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12">
        <div className="sticky top-20 self-start">
          <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-2xl p-6 border border-border">
            <CanvasRenderer canvasRef={canvasRef} />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Предварительный просмотр. Финальный вид может незначительно отличаться.
          </p>
        </div>

        <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
          <ConstructorPanel canvasRef={canvasRef} onOrder={handleOrder} />
        </div>
      </div>

      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </>
  );
}

export default function GeneratorPageContent() {
  const typografTitle = useTypograf("Соберите свой ретрознак за 2 минуты");
  const typografSubtitleLine1 = useTypograf("Настройте внешний вид адресного указателя и скачайте картинку.");
  const typografSubtitleLine2 = useTypograf("Посмотрите, как будет смотреться советский знак с вашим адресом.");
  const typografCTAButton = useTypograf("Узнать подробнее про ретрознаки");

  return (
    <ConstructorProvider>
      <section className="py-10 sm:py-16 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              {typografTitle}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {typografSubtitleLine1}
              <br />
              {typografSubtitleLine2}
            </p>
          </div>

          <ConstructorContent />

          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="default" className="group">
              <a href="/">
                {typografCTAButton}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </ConstructorProvider>
  );
}
