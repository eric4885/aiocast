import { siteConfig } from "@/lib/data";

export function growthPackAppJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");
  const toolUrl = `${base}/tools/seo-growth-pack`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AioCast SEO Growth Pack",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Paste podcast show notes or upload short audio to generate an SEO article draft, FAQ blocks, social scripts, SRT subtitles, and a 7-day publish plan.",
    url: toolUrl,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: base,
    },
  };
}
