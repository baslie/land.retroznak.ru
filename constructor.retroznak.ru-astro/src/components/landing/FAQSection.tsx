"use client";

import { ChevronDown, HelpCircle } from "lucide-react";

import { faqContent } from "@/content/faq";
import { commonTexts } from "@/content/common";
import { useTypograf } from "@/hooks/useTypograf";
import { typograf } from "@/lib/typograf";
import { typografSafe } from "@/lib/sanitize";

import { asset } from "@/lib/base-path";
import { CTAButton } from "./CTAButton";

export function FAQSection() {
  const { title, subtitle, items, cta } = faqContent;

  const typografTitle = useTypograf(title);
  const typografSubtitle = useTypograf(subtitle);

  return (
    <section
      id="faq"
      className="relative py-20"
      style={{
        backgroundImage: `url(${asset('/faq/faq-bg.jpg')})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Затемняющий overlay для лучшей читаемости */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <div className="container relative z-10 space-y-12">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <HelpCircle className="h-4 w-4" aria-hidden />
            {commonTexts.faq}
          </span>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{typografTitle}</h2>
          <p className="text-lg !text-white/90">{typografSubtitle}</p>
        </div>
        <div className="space-y-4">
          {items.map((item) => {
            const typografCategory = typograf(item.category);
            const typografQuestion = typograf(item.question);
            const typografAnswer = typografSafe(item.answer);

            return (
              <details
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-white/20 bg-black/30 backdrop-blur-sm"
                suppressHydrationWarning
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-white">
                  <div>
                    <p className="text-xs font-semibold !text-white/70">{typografCategory}</p>
                    <p className="mt-2 text-lg !text-white">{typografQuestion}</p>
                  </div>
                  <ChevronDown className="h-5 w-5 transition group-open:rotate-180" aria-hidden />
                </summary>
                <div className="px-6 pb-6 text-sm text-white">
                  <p className="!text-white" dangerouslySetInnerHTML={{ __html: typografAnswer }} />
                </div>
              </details>
            );
          })}
          <div className="flex flex-col items-start gap-4 rounded-3xl border border-white/20 bg-black/30 backdrop-blur-sm p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{commonTexts.ctaQuestion}</h3>
              <p className="text-sm !text-white/95">{commonTexts.ctaQuestionDesc}</p>
            </div>
            <CTAButton cta={cta} />
          </div>
        </div>
      </div>
    </section>
  );
}
