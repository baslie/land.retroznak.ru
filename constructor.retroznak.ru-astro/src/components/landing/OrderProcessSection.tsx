"use client";

import {
  CheckCheck,
  Factory,
  FileSignature,
  PenTool,
  Truck,
  Wrench,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import { orderProcessContent } from "@/content/orderProcess";
import { useTypograf } from "@/hooks/useTypograf";
import { typograf } from "@/lib/typograf";

import { CTAButton } from "./CTAButton";

const iconMap: Record<string, LucideIcon> = {
  form: FileSignature,
  design: PenTool,
  approval: CheckCheck,
  production: Factory,
  delivery: Truck,
  install: Wrench,
};

export function OrderProcessSection() {
  const { title, subtitle, steps, cta } = orderProcessContent;

  const typografTitle = useTypograf(title);
  const typografSubtitle = useTypograf(subtitle);
  const typografBadge = useTypograf("Как мы работаем");
  const typografCtaTitle = useTypograf("Готовы начать?");
  const typografCtaDesc = useTypograf(
    "Заполните форму заявки, и мы подготовим макет в течение двух часов, а затем согласуем сроки производства."
  );

  return (
    <section id="order-process" className="py-20">
      <div className="container space-y-12">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-retro-charcoal/80 px-4 py-2 text-sm text-white">
            <ClipboardList className="h-4 w-4" aria-hidden />
            {typografBadge}
          </span>
          <h2 className="text-3xl font-semibold text-retro-ivory sm:text-4xl">{typografTitle}</h2>
          <p className="text-lg text-muted-foreground">{typografSubtitle}</p>
        </div>
        <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon ?? ""] ?? CheckCheck;
            // Показывать стрелку только между шагами: 0->1, 1->2, 3->4, 4->5
            const showArrow = index === 0 || index === 1 || index === 3 || index === 4;
            const typografStepTitle = typograf(step.title);
            const typografStepDesc = typograf(step.description);
            const typografStepLabel = typograf(`Шаг ${index + 1}`);
            return (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <span className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border/70 bg-retro-charcoal/80 text-accent-platinum">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span className="mb-2 text-xs font-semibold text-muted-foreground/70">{typografStepLabel}</span>
                <h3 className="mb-2 text-base font-semibold text-retro-ivory">{typografStepTitle}</h3>
                <p className="text-sm text-muted-foreground">{typografStepDesc}</p>
                {showArrow && (
                  <div className="absolute left-[calc(50%+12px)] top-8 hidden w-[calc(100%-24px)] items-center justify-center sm:flex sm:left-full sm:w-12 sm:-translate-x-6 lg:w-12" aria-hidden>
                    <svg width="100%" height="16" viewBox="0 0 96 16" fill="none" className="text-accent-platinum" preserveAspectRatio="none">
                      <line x1="0" y1="8" x2="86" y2="8" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                      <path d="M86 8L94 8M94 8L90 5M94 8L90 11" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="miter" fill="none" />
                    </svg>
                  </div>
                )}
              </motion.li>
            );
          })}
        </ol>

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-border/70 bg-retro-charcoal/85 p-8 text-center">
          <h3 className="text-xl font-semibold text-retro-ivory">{typografCtaTitle}</h3>
          <p className="text-sm text-muted-foreground">{typografCtaDesc}</p>
          <CTAButton cta={cta} />
        </div>
      </div>
    </section>
  );
}
