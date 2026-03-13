import { ConstructorProvider } from "@/contexts/ConstructorContext";
import { ProductCardsSection } from "./ProductCardsSection";
import { ConstructorSection } from "./ConstructorSection";

export default function ProductConstructorIsland() {
  return (
    <ConstructorProvider>
      <ProductCardsSection />
      <ConstructorSection />
    </ConstructorProvider>
  );
}
