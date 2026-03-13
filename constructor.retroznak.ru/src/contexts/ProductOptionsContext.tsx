"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { SelectedProductOptions } from "@/types/forms";

interface ProductOptionsContextType {
  productOptions: SelectedProductOptions | null;
  setProductOptions: (options: SelectedProductOptions | null) => void;
}

const ProductOptionsContext = createContext<ProductOptionsContextType | undefined>(undefined);

export function ProductOptionsProvider({ children }: { children: ReactNode }) {
  const [productOptions, setProductOptions] = useState<SelectedProductOptions | null>(null);

  return (
    <ProductOptionsContext.Provider value={{ productOptions, setProductOptions }}>
      {children}
    </ProductOptionsContext.Provider>
  );
}

export function useProductOptions() {
  const context = useContext(ProductOptionsContext);
  if (context === undefined) {
    throw new Error("useProductOptions must be used within a ProductOptionsProvider");
  }
  return context;
}
