"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquareQuote, Stamp } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { timelineContent } from "@/content/timeline";
import { commonTexts } from "@/content/common";
import { useTypograf } from "@/hooks/useTypograf";
import { typograf } from "@/lib/typograf";

import { CTAButton } from "./CTAButton";
import LightboxImage from "./LightboxImage";

export function TimelineSection() {
  const { title, subtitle, items, expertQuote, cta } = timelineContent;

  const typografTitle = useTypograf(title);
  const typografSubtitle = useTypograf(subtitle);
  const typografExpertText = useTypograf(expertQuote.text);
  const typografExpertName = useTypograf(expertQuote.name);
  const typografExpertRole = useTypograf(expertQuote.role);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const slides = [
    ...items.map((item) => ({
      src: item.image.src,
      alt: item.image.alt,
      width: 1200,
      height: 800,
    })),
    ...(expertQuote.image ? [{
      src: expertQuote.image,
      alt: expertQuote.name,
      width: 800,
      height: 800,
    }] : [])
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="timeline" className="border-t border-border/40 bg-background py-20">
      <div className="container space-y-8">
        <div className="max-w-3xl space-y-4">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Stamp className="h-4 w-4" aria-hidden />
            {commonTexts.archivalStories}
          </motion.span>
          <motion.h2
            className="text-3xl font-semibold text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ delay: 0.05, duration: 0.6, ease: "easeOut" }}
          >
            {typografTitle}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          >
            {typografSubtitle}
          </motion.p>
        </div>

        <div className="md:hidden -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <Swiper
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              observer={true}
              observeParents={false}
              className="!pb-10"
            >
              {items.map((item) => {
                const typografPeriod = typograf(item.period);
                const typografItemTitle = typograf(item.title);
                const typografItemDescription = typograf(item.description);

                return (
                  <SwiperSlide key={item.id}>
                    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
                      <div className="relative h-60 w-full cursor-pointer" onClick={() => openLightbox(items.indexOf(item))}>
                        <Image src={item.image.src} alt={item.image.alt} fill className="object-cover" sizes="90vw" />
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-6">
                        <span className="text-xs font-semibold text-primary">{typografPeriod}</span>
                        <h3 className="text-xl font-semibold text-card-foreground">{typografItemTitle}</h3>
                        <p className="text-sm text-muted-foreground">{typografItemDescription}</p>
                      </div>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>

        <div className="hidden md:grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const typografPeriod = typograf(item.period);
            const typografItemTitle = typograf(item.title);
            const typografItemDescription = typograf(item.description);

            return (
              <motion.article
                key={item.id}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              >
                <div className="relative h-60 w-full cursor-pointer" onClick={() => openLightbox(index)}>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 360px, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span className="text-xs font-semibold text-primary">{typografPeriod}</span>
                  <h3 className="text-xl font-semibold text-card-foreground">{typografItemTitle}</h3>
                  <p className="text-sm text-muted-foreground">{typografItemDescription}</p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="w-full">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Блок с цитатой эксперта - ~60% */}
            <motion.div
              className="flex flex-col items-center gap-8 rounded-3xl border border-border bg-card p-8 md:flex-row md:items-start lg:basis-[60%]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {expertQuote.image && (
                <div
                  className="relative h-40 w-40 sm:h-44 sm:w-44 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-full border-2 border-primary/30 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => openLightbox(items.length)}
                >
                  <Image
                    src={expertQuote.image}
                    alt={typografExpertName}
                    fill
                    className="object-cover scale-[1.10]"
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, 128px"
                  />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <p className="flex gap-3 text-base text-muted-foreground md:text-lg">
                  <MessageSquareQuote className="hidden h-6 w-6 shrink-0 text-primary md:block" aria-hidden />
                  <span>{typografExpertText}</span>
                </p>
                <p className="mt-4 text-sm font-semibold text-card-foreground">
                  {typografExpertName}
                  <span className="ml-2 block font-normal text-muted-foreground sm:inline">{typografExpertRole}</span>
                </p>
              </div>
            </motion.div>

            {/* Блок CTA - ~40% */}
            <motion.div
              className="flex flex-col items-start justify-center gap-4 rounded-3xl border border-border bg-card p-8 lg:basis-[40%]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold text-card-foreground">{commonTexts.ctaReady}</h3>
                <p className="text-sm text-muted-foreground">{commonTexts.ctaArchive}</p>
              </div>
              <CTAButton cta={cta} size="md" />
            </motion.div>
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        render={{ slide: LightboxImage }}
        controller={{ closeOnBackdropClick: true }}
      />
    </section>
  );
}
