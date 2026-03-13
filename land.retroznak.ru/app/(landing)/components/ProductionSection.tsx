"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Hammer,
  PenTool,
  ShieldCheck,
  Truck,
  Users2,
  Factory,
  type LucideIcon,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { productionContent } from "@/content/production";
import { useTypograf } from "@/hooks/useTypograf";
import { typograf } from "@/lib/typograf";
import LightboxImage from "./LightboxImage";

const iconMap: Record<string, LucideIcon> = {
  pen: PenTool,
  manufacturing: Hammer,
  hammer: Hammer,
  shield: ShieldCheck,
  truck: Truck,
};

export function ProductionSection() {
  const { title, subtitle, steps, team, metrics } = productionContent;

  const typografTitle = useTypograf(title);
  const typografSubtitle = useTypograf(subtitle);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<Array<{ src: string; alt: string; width: number; height: number }>>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (image: string, name: string, role: string) => {
    const slides = [{
      src: image,
      alt: `${name} — ${role}`,
      width: 520,
      height: 640,
    }];
    setLightboxSlides(slides);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  return (
    <section id="production" className="py-20">
      <div className="container space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
            <Factory className="h-4 w-4" aria-hidden />
            Мастерская
          </span>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{typografTitle}</h2>
          <p className="text-lg text-muted-foreground">{typografSubtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ol className="space-y-4 rounded-3xl border border-border bg-secondary/50 p-6">
            {steps.map((step, index) => {
              const Icon = iconMap[step.icon ?? ""] ?? Users2;
              const typografStepTitle = typograf(step.title);
              const typografStepDescription = typograf(step.description);

              return (
                <li key={step.id} className="flex gap-4 rounded-2xl bg-card p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground">Шаг {index + 1}</span>
                    <h3 className="text-lg font-semibold text-card-foreground">{typografStepTitle}</h3>
                    <p className="text-sm text-muted-foreground">{typografStepDescription}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {team.map((member) => {
                const typografMemberName = typograf(member.name);
                const typografMemberRole = typograf(member.role);
                const typografMemberExperience = typograf(member.experience);

                return (
                  <article
                    key={member.id}
                    className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-6"
                  >
                    <div
                      className="relative h-40 w-40 sm:h-44 sm:w-44 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-full border-2 border-primary/30 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => member.image && openLightbox(member.image, typografMemberName, typografMemberRole)}
                    >
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={`${typografMemberName} — ${typografMemberRole}`}
                          fill
                          className="object-cover scale-[1.20]"
                          sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, 128px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-secondary text-primary">
                          <Users2 className="h-8 w-8" aria-hidden />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-center">
                      <h3 className="text-base font-semibold text-card-foreground">{typografMemberName}</h3>
                      <p className="text-muted-foreground">{typografMemberRole}</p>
                      <p className="text-xs text-muted-foreground">{typografMemberExperience}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex flex-col gap-1 text-center">
                  <span className="text-3xl font-semibold text-card-foreground">{metric.label}</span>
                  <span className="text-sm font-semibold text-primary">{metric.value}</span>
                  {metric.description ? (
                    <span className="text-xs text-muted-foreground">{metric.description}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        render={{ slide: LightboxImage }}
        controller={{ closeOnBackdropClick: true }}
      />
    </section>
  );
}
