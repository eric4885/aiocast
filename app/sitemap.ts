import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const paths = [
    "/",
    "/privacy",
    "/terms",
    "/contact",
    "/help",
    "/pro-toolkit",
    "/ai-podcast-editing-stack",
    "/podcast-to-short-video",
    "/remote-recording-setup",
    "/tools/seo-growth-pack",
    "/my-packs",
    "/resources/pre-flight-checklist",
  ];

  return paths.map((path) => ({
    url: path === "/" ? `${base}/` : `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
