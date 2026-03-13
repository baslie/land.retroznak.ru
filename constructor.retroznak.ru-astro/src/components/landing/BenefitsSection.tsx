"use client";

import { History, Shield, Hammer, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { benefitsContent, type Benefit } from "@/content/benefits";
import { useTypograf } from "@/hooks/useTypograf";
import { typograf } from "@/lib/typograf";
import { cn } from "@/lib/utils";

import { CTAButton } from "./CTAButton";

const iconMap: Record<string, React.ElementType> = {
  History,
  Shield,
  Hammer,
  Zap,
};

function BenefitCard({ item, index }: { item: Benefit; index: number }) {
  const Icon = iconMap[item.icon] || History;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      className={cn(
        "group relative bg-background rounded-2xl p-6 border border-border",
        "transition-all hover:shadow-lg hover:border-brand-orange-500/30"
      )}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange-500/10 text-brand-orange-600 transition-colors group-hover:bg-brand-orange-500 group-hover:text-white">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {typograf(item.title)}
        </h3>
        <p className="text-sm text-muted-foreground">
          {typograf(item.description)}
        </p>
      </div>
    </motion.div>
  );
}

export function BenefitsSection() {
  const typografTitle = useTypograf(benefitsContent.title);
  const typografSubtitle = useTypograf(benefitsContent.subtitle);

  return (
    <section id="benefits" className="border-t border-border/40 py-20 bg-secondary/60">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {typografTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {typografSubtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefitsContent.items.map((item, index) => (
            <BenefitCard key={index} item={item} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <CTAButton
            cta={{
              label: benefitsContent.cta.label,
              targetId: "constructor",
              variant: "primary",
            }}
            size="lg"
          />
        </div>
      </div>
    </section>
  );
}
