import type { Metadata } from "next";
import { Suspense } from "react";
import { AnalysisErrorBoundary } from "@/components/AnalysisErrorBoundary";
import { siteConfig } from "@/lib/data";
import { HomeLearnMore } from "@/components/seo/HomeLearnMore";
import { HomeSeoIntro } from "@/components/seo/HomeSeoIntro";
import { homePageJsonLd } from "@/lib/home-page-schema";
import { HomePageClient } from "./home-client";

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
  title: "Turn podcast into SEO blog posts in minutes — free draft pack",
  description:
    "Paste transcript or show notes — get an SEO article draft, FAQ blocks, and social scripts in minutes. Free tier, no credit card.",
  openGraph: {
    url: siteConfig.url,
    title: "Turn your podcast into SEO blog posts in minutes",
    description:
      "Stop wasting traffic in podcast apps. Paste notes or transcript for an SEO draft, FAQ blocks, and social scripts.",
  },
};

function HomePageJsonLd() {
  const payload = homePageJsonLd();
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}

export default function HomePage() {
  return (
    <AnalysisErrorBoundary>
      <HomePageJsonLd />
      <HomeSeoIntro />
      <Suspense fallback={<div className="min-h-[40vh] bg-background" aria-hidden />}>
        <HomePageClient />
        <HomeLearnMore />
      </Suspense>
    </AnalysisErrorBoundary>
  );
}
