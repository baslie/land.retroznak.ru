import { ConstructorProvider } from "@/contexts/ConstructorContext";
import { HeroSection } from "./components/HeroSection";
import { ProductCardsSection } from "./components/ProductCardsSection";
import { ConstructorSection } from "./components/ConstructorSection";
import { BenefitsSection } from "./components/BenefitsSection";
import { TimelineSection } from "./components/TimelineSection";
import { SegmentsSection } from "./components/SegmentsSection";
import { ProductionSection } from "./components/ProductionSection";
import { PhotoGallerySection } from "./components/PhotoGallerySection";
import { ReviewsSection } from "./components/ReviewsSection";
import { FAQSection } from "./components/FAQSection";
import { FinalCTASection } from "./components/FinalCTASection";

export default function ConstructorHomePage() {
  return (
    <div className="flex flex-col gap-0">
      <HeroSection />
      <ConstructorProvider>
        <ProductCardsSection />
        <ConstructorSection />
      </ConstructorProvider>
      <BenefitsSection />
      <TimelineSection />
      <SegmentsSection />
      <ProductionSection />
      <PhotoGallerySection />
      <ReviewsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
