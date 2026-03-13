"use client";


import { Users } from "lucide-react";

import { segmentsContent } from "@/content/segments";
import { useTypograf } from "@/hooks/useTypograf";
import { typograf } from "@/lib/typograf";

import { asset } from "@/lib/base-path";
import { CTAButton } from "./CTAButton";

export function SegmentsSection() {
  const { title, subtitle, segments, cta } = segmentsContent;

  const typografTitle = useTypograf(title);
  const typografSubtitle = useTypograf(subtitle);

  return (
    <section
      id="segments"
      className="relative py-20"
      style={{
        backgroundImage: `url(${asset('/segments/for-whom-bg.jpg')})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Затемняющий overlay для лучшей читаемости */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <div className="container relative z-10 space-y-12">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <Users className="h-4 w-4" aria-hidden />
            Кому подойдут
          </span>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{typografTitle}</h2>
          <p className="text-lg text-white/90">{typografSubtitle}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {segments.map((segment, index) => {
            const typografSegmentTitle = typograf(segment.title);
            const typografSegmentDescription = typograf(segment.description);
            const imageMap: Record<number, string> = {
              0: asset("/segments/for-whom-1.jpg"),
              1: asset("/segments/for-whom-3.jpg"),
              2: asset("/segments/for-whom-2.jpg"),
              3: asset("/segments/for-whom-4.jpg"),
            };

            return (
              <article
                key={segment.id}
                className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm transition hover:border-white/40"
                style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.5rem", padding: "1.5rem" }}
              >
                <div className="relative aspect-square w-25">
                  <img
                    src={imageMap[index]}
                    alt={segment.title}
                    className="rounded-2xl border border-white/20 object-cover absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-2">
                  <h3 className="text-xl font-semibold text-white">{typografSegmentTitle}</h3>
                  <p className="text-sm text-white/80">{typografSegmentDescription}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Хотите примеры именно для вас?</h3>
            <p className="text-sm text-white/80">Подберём реализованные проекты и предложим идеи для фасада.</p>
          </div>
          <CTAButton cta={cta} size="md" />
        </div>
      </div>
    </section>
  );
}
