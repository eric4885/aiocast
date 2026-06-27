import { siteConfig } from "@/lib/data";
import { pricing } from "@/lib/pricing";

/** Homepage JSON-LD — WebSite + Organization live in layout; this adds the product node. */
export function homePageJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");
  const toolUrl = `${base}/tools/seo-growth-pack`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${base}/#software`,
        name: "AioCast",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: toolUrl,
        description:
          "AI-powered tool that converts podcast transcripts and show notes into structured, search-optimized SEO blog posts, FAQ blocks, and social scripts.",
        offers: [
          {
            "@type": "Offer",
            name: "Free tier",
            price: "0",
            priceCurrency: "USD",
            url: toolUrl,
          },
          {
            "@type": "Offer",
            name: "Pro — first month",
            price: String(pricing.pro.firstMonthUsd),
            priceCurrency: "USD",
            url: `${base}/pro-toolkit`,
            description: `Then $${pricing.pro.monthlyUsd}/month — unlimited pack generations`,
          },
        ],
        provider: {
          "@type": "Organization",
          "@id": `${base}/#organization`,
          name: siteConfig.name,
          url: base,
        },
      },
    ],
  };
}
