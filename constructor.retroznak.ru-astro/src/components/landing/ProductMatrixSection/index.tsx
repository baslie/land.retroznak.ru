"use client";

import { useMemo, useState } from "react";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";

import { productContent } from "@/content/products";
import { useTypograf } from "@/hooks/useTypograf";
import { typograf } from "@/lib/typograf";

import { ComparisonTable } from "./ComparisonTable";
import { ProductTabs } from "./Tabs";
import { ProductDescriptionCard } from "./ProductDescriptionCard";
import { ProductEquipmentCard } from "./ProductEquipmentCard";
import { ProductFeaturesCard } from "./ProductFeaturesCard";
import { ProductUpsellsCard } from "./ProductUpsellsCard";
import { ProductCTACard } from "./ProductCTACard";
import LightboxImage from "../LightboxImage";

export function ProductMatrixSection() {
  const { title, subtitle, variants, comparison, cta } = productContent;
  const [activeId, setActiveId] = useState<string>(variants[0]?.id ?? "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const titleTypo = useTypograf(title);
  const subtitleTypo = useTypograf(subtitle);

  const activeVariant = useMemo(
    () => variants.find((variant) => variant.id === activeId) ?? variants[0],
    [activeId, variants],
  );

  if (!activeVariant) {
    return null;
  }

  const lightboxSlides = activeVariant.images.map((image) => ({
    src: image.src,
    alt: image.alt,
    width: 1200,
    height: 900,
  }));

  return (
    <section id="products" className="border-t border-border/60 bg-secondary/20 py-20">
      <div className="container">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
            <ShoppingBag className="h-4 w-4" aria-hidden />
            {typograf("Каталог")}
          </span>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{titleTypo}</h2>
          <p className="text-lg text-muted-foreground">{subtitleTypo}</p>
        </div>

        <div className="mt-4 md:mt-6 lg:mt-8 space-y-8 md:space-y-10 lg:space-y-12">
          <div className="lg:sticky lg:top-4 lg:z-20 lg:pb-2">
          <ProductTabs items={variants} activeId={activeVariant.id} onSelect={setActiveId} />
        </div>

        {/* Conditional Layout based on variant */}
        {activeVariant.id === "classic" ? (
          /* Layout for "Обычный" (Classic): All blocks with equal spacing */
          <div className="space-y-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0 lg:items-start">
            {/* Image Slider - spans 2 columns (50%) */}
            <motion.div
              key={activeVariant.id}
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="rounded-3xl border border-border bg-white overflow-hidden h-full">
                <Swiper
                  pagination={{ clickable: true }}
                  navigation={true}
                  loop={true}
                  modules={[Pagination, Navigation]}
                  observer={true}
                  observeParents={false}
                  className="!m-0 !p-0 pb-10 h-full"
                >
                  {activeVariant.images.map((image, index) => (
                    <SwiperSlide key={image.src} className="!m-0 !p-0">
                      <div
                        className="relative w-full aspect-square cursor-pointer hover:opacity-90 transition-opacity bg-white"
                        onClick={() => {
                          setLightboxIndex(index);
                          setLightboxOpen(true);
                        }}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="object-cover absolute inset-0 w-full h-full"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </motion.div>

            {/* Features Card - spans 1 column (25%) */}
            {activeVariant.features.length > 0 && (
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <ProductFeaturesCard features={activeVariant.features} variantTone={activeVariant.badge?.tone} />
              </motion.div>
            )}

            {/* Equipment Card - spans 1 column (25%) */}
            {activeVariant.equipment.length > 0 && (
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <ProductEquipmentCard equipment={activeVariant.equipment} variantTone={activeVariant.badge?.tone} />
              </motion.div>
            )}

            {/* Description Card - full width */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ProductDescriptionCard
                description={activeVariant.description}
                priceFrom={activeVariant.priceFrom}
                leadTime={activeVariant.leadTime}
                variantTone={activeVariant.badge?.tone}
                paymentOptions={activeVariant.paymentOptions}
              />
            </motion.div>

            {/* CTA Card - full width */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <ProductCTACard cta={cta} variantTone={activeVariant.badge?.tone} />
            </motion.div>
          </div>
        ) : (
          /* Layout for Premium variants (Petrogradsky & Leningradsky): All blocks with equal spacing */
          <div className="space-y-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0 lg:items-start">
            {/* Image Slider - spans 2 columns (50%) */}
            <motion.div
              key={activeVariant.id}
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="rounded-3xl border border-border bg-white overflow-hidden h-full">
                <Swiper
                  pagination={{ clickable: true }}
                  navigation={true}
                  loop={true}
                  modules={[Pagination, Navigation]}
                  observer={true}
                  observeParents={false}
                  className="!m-0 !p-0 pb-10 h-full"
                >
                  {activeVariant.images.map((image, index) => (
                    <SwiperSlide key={image.src} className="!m-0 !p-0">
                      <div
                        className="relative w-full aspect-square cursor-pointer hover:opacity-90 transition-opacity bg-white"
                        onClick={() => {
                          setLightboxIndex(index);
                          setLightboxOpen(true);
                        }}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="object-cover absolute inset-0 w-full h-full"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </motion.div>

            {/* Features Card - spans 1 column (25%) */}
            {activeVariant.features.length > 0 && (
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <ProductFeaturesCard features={activeVariant.features} variantTone={activeVariant.badge?.tone} />
              </motion.div>
            )}

            {/* Equipment Card - spans 1 column (25%) */}
            {activeVariant.equipment.length > 0 && (
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <ProductEquipmentCard equipment={activeVariant.equipment} variantTone={activeVariant.badge?.tone} />
              </motion.div>
            )}

            {/* Description Card - full width */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ProductDescriptionCard
                description={activeVariant.description}
                priceFrom={activeVariant.priceFrom}
                leadTime={activeVariant.leadTime}
                variantTone={activeVariant.badge?.tone}
                paymentOptions={activeVariant.paymentOptions}
              />
            </motion.div>

            {/* Upsells/CTA Card - full width */}
            {activeVariant.upsells.length > 0 && activeVariant.basePrice && (
              <motion.div
                key={`${activeVariant.id}-upsells`}
                className="lg:col-span-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
              >
                <ProductUpsellsCard
                  productId={activeVariant.id}
                  productName={activeVariant.name}
                  basePrice={activeVariant.basePrice}
                  upsells={activeVariant.upsells}
                  cta={cta}
                  customTitle="Оставить заявку на расчёт"
                  showIcon={false}
                  variantTone={activeVariant.badge?.tone}
                />
              </motion.div>
            )}
          </div>
        )}
        </div>

        <div className="mt-8 md:mt-10 lg:mt-12">
          <ComparisonTable rows={comparison} variants={variants} />
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
        render={{ slide: LightboxImage }}
      />
    </section>
  );
}
