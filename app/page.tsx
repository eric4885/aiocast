import type { Metadata } from "next";
import { Suspense } from "react";
import { AnalysisErrorBoundary } from "@/components/AnalysisErrorBoundary";
import { siteConfig } from "@/lib/data";
import { HomeLearnMore } from "@/components/seo/HomeLearnMore";
import { HomeSeoIntro } from "@/components/seo/HomeSeoIntro";
import { HomePageClient } from "./home-client";

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
  title: "Paste show notes → podcast SEO article & social scripts",
  description:
    "Free podcast repurposing tool: paste transcript or show notes, get an SEO blog draft, FAQ blocks, social scripts, and a 7-day schedule.",
  openGraph: {
    url: siteConfig.url,
    title: "Paste show notes → podcast SEO growth pack",
    description:
      "Turn one podcast episode into search-ready content — blog draft, social scripts, and publish plan.",
  },
};

export default function HomePage() {
  return (
    <AnalysisErrorBoundary>
      <HomeSeoIntro />
      <Suspense fallback={<div className="min-h-[40vh] bg-background" aria-hidden />}>
        <HomePageClient />
        <HomeLearnMore />
      </Suspense>
    </AnalysisErrorBoundary>
  );
}
