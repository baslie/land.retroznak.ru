"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

import { heroContent } from "@/content/hero";
import { useTypograf } from "@/hooks/useTypograf";

import { CTAButton } from "./CTAButton";

export function HeroSection() {
  const { eyebrow, title, subtitle, primaryCta, visual } = heroContent;

  const typografEyebrow = useTypograf(eyebrow);
  const typografTitle = useTypograf(title);
  const typografSubtitle = useTypograf(subtitle);
  const typografBadgeTitle = useTypograf(visual.badge.title);
  const typografBadgeDescription = useTypograf(visual.badge.description);

  return (
    <section id="hero" className="relative overflow-hidden min-h-screen pb-32 pt-32">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero/video-preview.jpg"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/hero/video.webm" type="video/webm" />
        <source src="/hero/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video dimming overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/20 dark:bg-black/20" aria-hidden />

      <div className="container relative z-20 grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {typografEyebrow}
          </span>
          <div className="space-y-5 text-balance">
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-[3.25rem]">
              {typografTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white mx-auto lg:mx-0">
              {typografSubtitle}
            </p>
          </div>
          <CTAButton cta={primaryCta} size="lg" className="shadow-glow">
            <span className="inline-flex items-center gap-2">
              <span>{primaryCta.label}</span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </CTAButton>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-md overflow-visible">
            {/* Spherical Ambilight Effect - Four Vibrant Corner Orbs */}
            <div className="absolute top-0 left-0 right-0 aspect-square z-0 pointer-events-none">
              {/* Top-left orb - Light Yellow */}
              <div
                className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-brand-yellow-300/60 blur-3xl animate-pulse"
                style={{ top: '0', left: '0', transform: 'translate(calc(-50% + 135px), calc(-50% + 135px))', animationDuration: '4s', animationDelay: '0s' }}
              />

              {/* Top-right orb - Yellow-Orange */}
              <div
                className="absolute w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-brand-yellow-500/55 blur-3xl animate-pulse"
                style={{ top: '0', right: '0', transform: 'translate(calc(50% - 135px), calc(-50% + 135px))', animationDuration: '5.5s', animationDelay: '1.2s' }}
              />

              {/* Bottom-left orb - Medium Orange */}
              <div
                className="absolute w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-brand-orange-400/50 blur-3xl animate-pulse"
                style={{ bottom: '0', left: '0', transform: 'translate(calc(-50% + 135px), calc(50% - 135px))', animationDuration: '6.8s', animationDelay: '2.5s' }}
              />

              {/* Bottom-right orb - Deep Orange */}
              <div
                className="absolute w-44 h-44 md:w-60 md:h-60 lg:w-68 lg:h-68 rounded-full bg-brand-orange-600/65 blur-3xl animate-pulse"
                style={{ bottom: '0', right: '0', transform: 'translate(calc(50% - 135px), calc(50% - 135px))', animationDuration: '3.2s', animationDelay: '0.8s' }}
              />
            </div>

            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-4xl z-10">
              <Image
                src={visual.image}
                alt={visual.alt}
                fill
                className="object-contain"
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 480px, (min-width: 768px) 70vw, 90vw"
              />
            </div>
            <div className="text-sm text-center mx-auto max-w-md border border-white/20 bg-black/30 backdrop-blur-sm rounded-xl px-4 py-3">
              <p className="font-semibold text-white mb-2">{typografBadgeTitle}</p>
              <p className="text-white">{typografBadgeDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
