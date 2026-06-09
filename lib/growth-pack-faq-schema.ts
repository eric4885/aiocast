import { siteConfig } from "@/lib/data";

export const growthPackFaqs = [
  {
    q: "Do I need a full transcript to generate a podcast SEO growth pack?",
    a: "No. Polished show notes or a detailed outline work. You can also upload up to 5 minutes of audio on the free plan and we transcribe it automatically.",
  },
  {
    q: "How long does it take to generate an SEO article and social scripts?",
    a: "Pasted text usually completes in under a minute. A short audio clip typically takes 30–90 seconds to transcribe and package.",
  },
  {
    q: "What is included in the free SEO growth pack?",
    a: "An SEO article draft, FAQ blocks, social scripts for X, LinkedIn, and Substack, quote highlights, an estimated-timestamp SRT file, and a 7-day publish schedule.",
  },
  {
    q: "Can I paste show notes instead of uploading podcast audio?",
    a: "Yes. Paste your transcript or show notes directly — that is the fastest path to a blog-ready draft and distribution scripts.",
  },
] as const;

export function growthPackFaqJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: growthPackFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
    url: `${base}/tools/seo-growth-pack`,
  };
}
