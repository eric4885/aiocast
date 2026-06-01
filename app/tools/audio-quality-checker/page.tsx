import type { Metadata } from "next";
import { Suspense } from "react";
import { AudioQualityClient } from "./audio-quality-client";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Audio quality + SEO prep checker",
  description:
    "Paste a transcript to generate an SEO article draft, FAQs, social scripts, and a 7-day schedule. Optional audio validates clip length on the free tier.",
  openGraph: {
    title: "Audio quality + SEO prep checker",
    description:
      "Benchmark input quality before generating SEO article and social script outputs.",
    url: `${siteConfig.url}/tools/audio-quality-checker`,
  },
};

export default function AudioQualityCheckerPage({
  searchParams,
}: {
  searchParams?: { from?: string };
}) {
  const fromRemote = searchParams?.from === "remote";
  return (
    <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
      <AudioQualityClient fromRemoteSetup={fromRemote} />
    </Suspense>
  );
}
