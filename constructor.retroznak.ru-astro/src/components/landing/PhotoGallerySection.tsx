"use client";

import { useState } from "react";

import { Camera } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { galleryContent } from "@/content/gallery";
import { commonTexts } from "@/content/common";
import { useTypograf } from "@/hooks/useTypograf";
import LightboxImage from "./LightboxImage";

export function PhotoGallerySection() {
  const { title, subtitle, images } = galleryContent;

  const typografTitle = useTypograf(title);
  const typografSubtitle = useTypograf(subtitle);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxSlides = images.map((image) => ({
    src: image.src,
    alt: image.alt,
    width: image.width,
    height: image.height,
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="border-t border-retro-ivory/20 dark:border-[rgb(230,220,215)] bg-retro-charcoal dark:bg-[rgb(252,250,248)] py-20">
      <div className="container space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-retro-ivory/20 dark:border-[rgb(230,220,215)] bg-retro-smoke/80 dark:bg-white px-4 py-2 text-sm font-medium text-retro-ivory dark:text-[rgb(70,55,50)]">
            <Camera className="h-4 w-4" aria-hidden />
            {commonTexts.photoGallery}
          </span>
          <h2 className="text-3xl font-semibold text-retro-ivory dark:text-[rgb(70,55,50)] sm:text-4xl">{typografTitle}</h2>
          <p className="text-lg text-retro-ivory/80 dark:text-[rgb(113,113,122)]">{typografSubtitle}</p>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {images.map((image, index) => (
            <figure
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-retro-ivory/20 dark:border-[rgb(230,220,215)]/60 bg-retro-smoke/40 dark:bg-[rgb(248,245,242)] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-retro-ivory/60 dark:hover:border-[rgb(70,55,50)]/40"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-105 absolute inset-0 w-full h-full"
              />
            </figure>
          ))}
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
