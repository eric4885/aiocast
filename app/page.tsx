import type { Metadata } from "next";
import { Suspense } from "react";
import { AnalysisErrorBoundary } from "@/components/AnalysisErrorBoundary";
import { siteConfig } from "@/lib/data";
import { HomePageClient } from "./home-client";

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    url: siteConfig.url,
  },
};

export default function HomePage() {
  return (
    <AnalysisErrorBoundary>
      <Suspense fallback={<div className="min-h-[40vh] bg-background" aria-hidden />}>
        <HomePageClient />
      </Suspense>
    </AnalysisErrorBoundary>
  );
}
