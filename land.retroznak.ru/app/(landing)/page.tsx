import { HeroSection } from "./components/HeroSection";
import { TimelineSection } from "./components/TimelineSection";
import { SegmentsSection } from "./components/SegmentsSection";
import { ProductMatrixSection } from "./components/ProductMatrixSection";
import { ProductionSection } from "./components/ProductionSection";
import { PhotoGallerySection } from "./components/PhotoGallerySection";
import { ReviewsSection } from "./components/ReviewsSection";
// import { OrderProcessSection } from "./components/OrderProcessSection"; // Временно скрыт - дублирует блок "Мастерской"
import { FAQSection } from "./components/FAQSection";
import { FinalCTASection } from "./components/FinalCTASection";
import { CallbackModal } from "./components/Forms/CallbackModal";
import { ConsultationModal } from "./components/Forms/ConsultationModal";
import { QuestionModal } from "./components/Forms/QuestionModal";

export default function MarketingHomePage() {
  return (
    <>
      <div className="flex flex-col gap-0">
        <HeroSection />
        <TimelineSection />
        <SegmentsSection />
        <ProductMatrixSection />
        <ProductionSection />
        <PhotoGallerySection />
        <ReviewsSection />
        {/* <OrderProcessSection /> */} {/* Временно скрыт - дублирует блок "Мастерской" */}
        <FAQSection />
        <FinalCTASection />
      </div>
      <CallbackModal />
      <ConsultationModal />
      <QuestionModal />
    </>
  );
}
