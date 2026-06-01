import type { Metadata } from "next";
import { Suspense } from "react";
import { AudioQualityClient } from "./audio-quality-client";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Generate your podcast SEO growth pack",
  description:
    "Paste show notes or upload audio for automatic transcription, then generate an SEO article, FAQs, social scripts, and a 7-day schedule.",
  openGraph: {
    title: "Generate your podcast SEO growth pack",
    description:
      "Paste transcript or upload audio — get SEO article drafts, social scripts, and a publish plan.",
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
