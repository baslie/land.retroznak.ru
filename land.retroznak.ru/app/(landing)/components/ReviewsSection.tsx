"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MessageSquare } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { reviewsContent } from "@/content/reviews";
import { useTypograf } from "@/hooks/useTypograf";
import { typograf } from "@/lib/typograf";
import { useTheme } from "@/components/providers/ThemeProvider";

import { CTAButton } from "./CTAButton";
import LightboxImage from "./LightboxImage";

export function ReviewsSection() {
  const { title, subtitle, subtitleLink, reviews, cta, moreCta } = reviewsContent;
  const { theme } = useTheme();

  const typografTitle = useTypograf(title);

  // Применяем типограф к полному тексту, затем разбиваем по маркерам
  const typografSubtitleFull = useTypograf(subtitle);
  const subtitleParts = typografSubtitleFull.split(/\{\{link\}\}|\{\{\/link\}\}/);
  const subtitleBeforeLink = subtitleParts[0] || "";
  const subtitleLinkText = subtitleParts[1] || subtitleLink?.text || "";
  const subtitleAfterLink = subtitleParts[2] || "";

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<Array<{ src: string; alt: string; width: number; height: number }>>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const openLightbox = (photos: string[], index: number) => {
    const slides = photos.map((photo) => ({
      src: photo,
      alt: `Фото ${index + 1}`,
      width: 1200,
      height: 800,
    }));
    setLightboxSlides(slides);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const isTextLong = (text: string) => {
    const lines = text.split("\n");
    return lines.length > 4 || text.length > 280;
  };

  return (
    <section id="reviews" className="border-t border-border/60 bg-secondary/25 py-20">
      <div className="container space-y-12">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
              <MessageSquare className="h-4 w-4" aria-hidden />
              {typograf("Отзывы")}
            </span>
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{typografTitle}</h2>
            <p className="text-lg text-muted-foreground">
              {subtitleBeforeLink}
              {subtitleLink && (
                <a
                  href={subtitleLink.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="underline"
                >
                  {subtitleLinkText}
                </a>
              )}
              {subtitleAfterLink}
            </p>
          </div>
          <div className="flex-shrink-0">
            <iframe
              src={`https://yandex.ru/sprav/widget/rating-badge/44307431220?type=rating${theme === 'light' ? '&theme=dark' : ''}`}
              width="150"
              height="50"
              style={{ border: 0 }}
              title="Рейтинг Яндекс.Бизнес"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => {
            const typografName = typograf(review.name);
            const typografText = typograf(review.text);

            return (
              <article key={review.id} className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 min-h-14 min-w-14 overflow-hidden rounded-full border border-border bg-secondary">
                    {review.image ? (
                      <Image src={review.image} alt={typografName} fill className="object-cover" sizes="56px" />
                    ) : null}
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-card-foreground">{typografName}</p>
                    {review.date && <p className="text-muted-foreground">{review.date}</p>}
                    <div className="flex items-center gap-1 text-brand-orange-500" aria-hidden>
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm text-muted-foreground whitespace-pre-line ${
                      !expandedReviews.has(review.id) && isTextLong(review.text) ? "line-clamp-4" : ""
                    }`}
                  >
                    {typografText}
                  </p>
                  {isTextLong(review.text) && (
                    <button
                      onClick={() => toggleReviewExpansion(review.id)}
                      className="mt-2 text-sm text-primary hover:underline focus:outline-none"
                    >
                      {expandedReviews.has(review.id) ? typograf("Свернуть") : typograf("Читать далее")}
                    </button>
                  )}
                </div>
                {review.photos && review.photos.length > 0 && (
                  <div className="mt-2 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {review.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-xl border border-border/60 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openLightbox(review.photos!, index)}
                      >
                        <Image src={photo} alt={`Фото ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {moreCta && (
          <div className="flex justify-center">
            <a
              href={moreCta.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {moreCta.label}
            </a>
          </div>
        )}

        <div className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">{typograf("Хотите стать следующим героем истории?")}</h3>
            <p className="text-sm text-muted-foreground">{typograf("Подберём комплектацию и покажем фото похожих проектов.")}</p>
          </div>
          <CTAButton cta={cta} />
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
