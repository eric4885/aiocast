import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

const DISALLOW = ["/results/", "/my-packs", "/unsubscribe", "/tools/highlight-extractor"];

/** AI retrieval / answer bots — allow public tools and guides (GEO + search visibility). */
const AI_RETRIEVAL_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
] as const;

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_RETRIEVAL_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
