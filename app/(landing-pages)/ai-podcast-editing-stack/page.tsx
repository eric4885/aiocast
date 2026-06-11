import type { Metadata } from "next";
import { EditingStackView } from "./editing-stack-view";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Podcast to SEO article — one episode, full growth pack",
  description:
    "Paste show notes or upload audio — get an SEO article draft, FAQ blocks, social scripts, SRT, and a 7-day publish plan from one episode.",
  alternates: { canonical: `${siteConfig.url}/ai-podcast-editing-stack` },
  keywords: [
    "podcast to SEO article",
    "audio to blog generator",
    "podcast social scripts",
    "podcast content repurposing",
  ],
  openGraph: {
    title: "Podcast to SEO article workflow",
    description:
      "One episode in — SEO draft, FAQ blocks, social scripts, and publish plan out.",
    url: `${siteConfig.url}/ai-podcast-editing-stack`,
  },
};

export default function AiPodcastEditingStackPage() {
  return <EditingStackView />;
}
