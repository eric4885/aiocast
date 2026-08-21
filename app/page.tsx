import type { Metadata } from "next";
import { AnalysisErrorBoundary } from "@/components/AnalysisErrorBoundary";
import { siteConfig } from "@/lib/data";
import { HomeHowItWorks } from "@/components/seo/HomeHowItWorks";
import { HomeLearnMore } from "@/components/seo/HomeLearnMore";
import { HomeSeoIntro } from "@/components/seo/HomeSeoIntro";
import { homePageJsonLd } from "@/lib/home-page-schema";
import { productPromise } from "@/lib/product-copy";
import { HomePageClient } from "./home-client";

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
  title: {
    absolute: productPromise.seoTitle,
  },
  description: productPromise.seoDescription,
  openGraph: {
    url: siteConfig.url,
    title: productPromise.seoTitle,
    description: productPromise.seoDescription,
    images: [{ url: `${siteConfig.url}/opengraph-image` }],
  },
  twitter: {
    card: "summary_large_image",
    title: productPromise.seoTitle,
    description: productPromise.seoDescription,
    images: [`${siteConfig.url}/opengraph-image`],
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
      <HomePageClient />
      <HomeHowItWorks />
      <HomeLearnMore />
    </AnalysisErrorBoundary>
  );
}
