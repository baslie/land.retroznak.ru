"use client";

import type { ReactNode } from "react";
import { GeneratorHeader } from "./components/GeneratorHeader";
import { GeneratorFooter } from "./components/GeneratorFooter";

export default function GeneratorLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <GeneratorHeader />
      <main className="flex-1">{children}</main>
      <GeneratorFooter />
    </div>
  );
}
