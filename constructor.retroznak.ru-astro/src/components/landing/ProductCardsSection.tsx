"use client";


import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { priceConfig } from "@/content/constructor-config";
import { useConstructor } from "@/contexts/ConstructorContext";
import { useSmoothScrollTo } from "@/hooks/useSmoothScrollTo";
import { useTypograf } from "@/hooks/useTypograf";
import { cn } from "@/lib/utils";
import type { SignTypeId } from "@/types/constructor";

import { asset } from "@/lib/base-path";
import { CTAButton } from "./CTAButton";

const productCards = [
  {
    id: "len",
    name: "Ленинградский",
    badge: "520×400 мм",
    badgeTone: "premium",
    description: "Самый популярный домовой знак советского времени. Оригинальный вид «Ленинградский ТИП-1».",
    image: asset("/products/tabs/retroznak-3.png"),
  },
  {
    id: "pet",
    name: "Петроградский",
    badge: "470×340 мм",
    badgeTone: "highlight",
    description: "Уменьшенная копия Ленинградского знака. Компактный размер, матовые стёкла.",
    image: asset("/products/tabs/retroznak-2.png"),
  },
  {
    id: "mini",
    name: "Мини",
    badge: "280×200 мм",
    badgeTone: "default",
    description: "Компактный домовой знак для небольших зданий и дачных домов.",
    image: asset("/products/tabs/retroznak-1.png"),
  },
] as const;

const badgeToneClasses: Record<string, string> = {
  premium: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  highlight: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400",
  default: "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400",
};

export function ProductCardsSection() {
  const { setSignType } = useConstructor();
  const scrollTo = useSmoothScrollTo();
  const typografTitle = useTypograf("Три модели на выбор");
  const typografSubtitle = useTypograf(
    "Выберите подходящий размер и откройте конструктор для настройки цвета и опций."
  );

  const handleSelectProduct = (productId: SignTypeId) => {
    setSignType(productId);
    scrollTo("constructor");
  };

  return (
    <section id="products" className="py-20 bg-secondary/60">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {typografTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {typografSubtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {productCards.map((product, index) => {
            const basePrice = priceConfig.base[product.id as keyof typeof priceConfig.base];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                className="group relative flex flex-col bg-background rounded-2xl border border-border overflow-hidden transition-all hover:shadow-lg hover:border-brand-orange-500/30"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
                      badgeToneClasses[product.badgeTone]
                    )}
                  >
                    {product.badge}
                  </span>
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-b from-secondary/50 to-secondary">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain p-6 transition-transform group-hover:scale-105 absolute inset-0 w-full h-full"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 gap-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    {product.name}
                  </h3>

                  <p className="text-sm text-muted-foreground flex-1">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">от</span>
                      <span className="text-2xl font-bold text-brand-orange-600 ml-1">
                        {basePrice.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  </div>

                  <CTAButton
                    cta={{
                      label: "Настроить в конструкторе",
                      variant: "primary",
                    }}
                    size="md"
                    className="w-full"
                    onClick={() => handleSelectProduct(product.id as SignTypeId)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span>Настроить</span>
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </CTAButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
