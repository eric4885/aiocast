import type { Metadata } from "next";
import { Suspense } from "react";
import { GrowthPackClient } from "./growth-pack-client";
import { rateLimitsDisabled } from "@/lib/rate-limit-config";
import { growthPackPageJsonLd } from "@/lib/growth-pack-page-schema";
import { siteConfig } from "@/lib/data";

const canonical = `${siteConfig.url}/tools/seo-growth-pack`;

export const metadata: Metadata = {
  title: "Podcast SEO growth pack — paste show notes, get blog + social scripts",
  description:
    "Paste podcast show notes or upload audio — generate an SEO blog draft, FAQ blocks, social scripts, SRT subtitles, and a 7-day publish schedule in one pass.",
  alternates: { canonical },
  openGraph: {
    title: "Podcast SEO growth pack generator",
    description:
      "Turn one episode into an SEO article, social scripts, and a publish plan — paste transcript or upload audio.",
    url: canonical,
  },
};

function GrowthPackJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(growthPackPageJsonLd()) }}
    />
  );
}

export default function SeoGrowthPackPage({
  searchParams,
}: {
  searchParams?: { from?: string };
}) {
  const fromRemote = searchParams?.from === "remote";
  return (
    <>
      <GrowthPackJsonLd />
      <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
        <GrowthPackClient fromRemoteSetup={fromRemote} rateLimitsDisabled={rateLimitsDisabled()} />
      </Suspense>
    </>
  );
}
