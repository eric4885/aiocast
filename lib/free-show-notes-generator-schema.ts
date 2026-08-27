import { siteConfig } from "@/lib/data";
import { pricing } from "@/lib/pricing";

const base = siteConfig.url.replace(/\/$/, "");
const pageUrl = `${base}/tools/free-show-notes-generator`;
const toolUrl = `${base}/tools/seo-growth-pack`;

export function freeShowNotesGeneratorPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: "AioCast Free AI Show Notes Generator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description:
          "Input: paste podcast show notes or transcript text. Output: an SEO blog article draft, FAQ blocks, and social scripts for your own website — not traditional timestamped show notes from audio upload. No login required for the free daily limit.",
        offers: {
          "@type": "Offer",
          name: "Free tier",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: toolUrl,
          description: `${pricing.free.ipDailyLimit} generations per day per IP — no account required`,
        },
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: base,
        },
      },
      {
        "@type": "HowTo",
        name: "How to generate podcast show notes and a blog draft with AioCast",
        description:
          "Paste show notes or transcript text, generate a structured SEO draft, edit, and publish on your own site.",
        totalTime: "PT5M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Paste show notes or transcript",
            text: "Copy your episode outline, bullet show notes, or transcript into the free generator. No login required for the daily free limit.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Generate your draft pack",
            text: "AioCast returns an SEO article draft, FAQ blocks, and social scripts in one pass.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Edit and publish on your domain",
            text: "Verify facts, match your voice, add the FAQ to your post, and publish on your own website.",
          },
        ],
      },
    ],
  };
}
