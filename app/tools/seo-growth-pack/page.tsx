import type { Metadata } from "next";
import { Suspense } from "react";
import { GrowthPackClient } from "./growth-pack-client";
import { rateLimitsDisabled } from "@/lib/rate-limit-config";
import { growthPackPageJsonLd } from "@/lib/growth-pack-page-schema";
import { siteConfig } from "@/lib/data";

const canonical = `${siteConfig.url}/tools/seo-growth-pack`;

export const metadata: Metadata = {
  title: "Paste show notes, get an SEO blog draft — free podcast tool",
  description:
    "For solo podcasters without an editor: paste show notes or upload audio, get a free SEO blog draft for your own site. FAQ and social scripts included.",
  alternates: { canonical },
  openGraph: {
    title: "Paste show notes. Get an SEO blog draft.",
    description:
      "Free SEO blog draft from one episode — built for indie hosts. Edit and publish on your domain.",
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
