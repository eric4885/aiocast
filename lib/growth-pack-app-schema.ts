import { siteConfig } from "@/lib/data";
import { pricing } from "@/lib/pricing";

export function growthPackAppJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");
  const toolUrl = `${base}/tools/seo-growth-pack`;
  const proUrl = `${base}/pro-toolkit`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AioCast SEO Growth Pack",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Paste podcast show notes or upload short audio to generate an SEO article draft, FAQ blocks, social scripts, SRT subtitles, and a 7-day publish plan.",
    url: toolUrl,
    offers: [
      {
        "@type": "Offer",
        name: "Pro — first month introductory",
        price: String(pricing.pro.firstMonthUsd),
        priceCurrency: "USD",
        valueAddedTaxIncluded: false,
        availability: "https://schema.org/InStock",
        url: proUrl,
        description: `Introductory Pro trial, then $${pricing.pro.monthlyUsd}/month`,
      },
      {
        "@type": "Offer",
        name: "Free tier",
        price: "0",
        priceCurrency: "USD",
        valueAddedTaxIncluded: false,
        availability: "https://schema.org/InStock",
        url: toolUrl,
      },
    ],
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: base,
    },
  };
}
