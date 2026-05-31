import type { Metadata } from "next";
import { EditingStackView } from "./editing-stack-view";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Audio to SEO Content OS — one episode, full growth pack",
  description:
    "Generate a publish-ready SEO content bundle from podcast audio: article draft, blog version, social scripts, summaries, and localized schedule.",
  keywords: [
    "podcast to SEO article",
    "audio to blog generator",
    "podcast social scripts",
    "localized content schedule",
  ],
  openGraph: {
    title: "Audio to SEO Content OS",
    description:
      "One audio in, complete SEO and social distribution assets out.",
    url: `${siteConfig.url}/ai-podcast-editing-stack`,
  },
};

export default function AiPodcastEditingStackPage() {
  return <EditingStackView />;
}
