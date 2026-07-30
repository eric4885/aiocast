import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** Stable ISO date — update when the page content materially changes */
  lastModified: string;
};

/** Indexable URLs only. Keep in sync with page-level robots metadata. */
const entries: SitemapEntry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", lastModified: "2026-07-29" },
  { path: "/tools/seo-growth-pack", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-07-29" },
  { path: "/guides/podcast-to-blog-post", priority: 0.95, changeFrequency: "weekly", lastModified: "2026-07-29" },
  { path: "/tools/free-podcast-title-generator", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-07-20" },
  { path: "/guides/show-notes-template", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-07-20" },
  { path: "/examples/sample-growth-pack", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-07-20" },
  { path: "/tools/show-notes-to-html", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-07-20" },
  { path: "/guides/podcast-faq-for-seo", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-07-30" },
  { path: "/resources", priority: 0.75, changeFrequency: "monthly", lastModified: "2026-07-29" },
  { path: "/resources/pre-flight-checklist", priority: 0.75, changeFrequency: "monthly", lastModified: "2026-07-20" },
  { path: "/pro-toolkit", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-07-15" },
  { path: "/ai-podcast-editing-stack", priority: 0.65, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/remote-recording-setup", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-07-10" },
  { path: "/help", priority: 0.5, changeFrequency: "monthly", lastModified: "2026-07-15" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly", lastModified: "2026-06-01" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-06-01" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-06-01" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");

  return entries.map((entry) => ({
    url: entry.path === "/" ? `${base}/` : `${base}${entry.path}`,
    lastModified: new Date(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
