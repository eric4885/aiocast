import { siteConfig } from "@/lib/data";
import { pricing } from "@/lib/pricing";

/** Homepage JSON-LD — WebSite + Organization live in layout; this adds the product node. */
export function homePageJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");
  const toolUrl = `${base}/tools/seo-growth-pack`;
  const proUrl = `${base}/pro-toolkit`;

  const proOffer = {
    "@type": "Offer",
    name: "Pro — first month introductory",
    price: String(pricing.pro.firstMonthUsd),
    priceCurrency: "USD",
    valueAddedTaxIncluded: false,
    availability: "https://schema.org/InStock",
    url: proUrl,
    description: `Introductory Pro trial, then $${pricing.pro.monthlyUsd}/month — unlimited SEO growth pack generations`,
  };

  const freeOffer = {
    "@type": "Offer",
    name: "Free tier",
    price: "0",
    priceCurrency: "USD",
    valueAddedTaxIncluded: false,
    availability: "https://schema.org/InStock",
    url: toolUrl,
    description: `${pricing.free.ipDailyLimit} pack generations per day per IP — full article, FAQ blocks, and social scripts`,
  };

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
        offers: [proOffer, freeOffer],
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
