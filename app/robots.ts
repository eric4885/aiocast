import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/results/", "/my-packs", "/unsubscribe", "/tools/highlight-extractor"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
