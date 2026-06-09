import type { Metadata } from "next";
import { PodcastShortVideoView } from "./podcast-short-video-view";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Podcast to social scripts — growth copy from one episode",
  description:
    "Generate multi-platform social scripts from podcast audio: X thread, LinkedIn draft, newsletter lead, and CTA variants.",
  alternates: { canonical: `${siteConfig.url}/podcast-to-short-video` },
  openGraph: {
    title: "Podcast audio -> social script workflow",
    description:
      "Turn episode insights into ready-to-edit growth scripts instead of manual post writing.",
    url: `${siteConfig.url}/podcast-to-short-video`,
  },
};

export default function PodcastToShortVideoPage() {
  return <PodcastShortVideoView />;
}
