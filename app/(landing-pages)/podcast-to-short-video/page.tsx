import type { Metadata } from "next";
import { PodcastShortVideoView } from "./podcast-short-video-view";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: { absolute: "Podcast to Social Scripts — Preview" },
  description:
    "Social script workflow preview — X, LinkedIn, and Substack copy ship inside the free SEO growth pack.",
  alternates: { canonical: `${siteConfig.url}/podcast-to-short-video` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Podcast audio -> social script workflow",
    description:
      "Preview page for podcast social scripts — full pack available now; standalone workflow coming soon.",
    url: `${siteConfig.url}/podcast-to-short-video`,
  },
};

export default function PodcastToShortVideoPage() {
  return <PodcastShortVideoView />;
}
