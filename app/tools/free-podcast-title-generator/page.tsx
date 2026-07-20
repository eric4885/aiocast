import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { siteConfig } from "@/lib/data";
import { pricing } from "@/lib/pricing";
import { TitleGeneratorClient } from "./title-generator-client";

const canonical = `${siteConfig.url}/tools/free-podcast-title-generator`;

const faq = [
  {
    q: "What makes a good SEO podcast episode title?",
    a: "A searchable title names who the episode is for and what problem it solves — not just 'Episode 47 with Jane.' Lead with the outcome or question listeners type into Google, keep it under roughly 60 characters when you can, and save inside jokes for the intro, not the headline.",
  },
  {
    q: "How is this different from the SEO growth pack?",
    a: "This tool focuses on episode headlines and keyword angles before you record. The growth pack turns your transcript or show notes into a full SEO article draft, FAQ blocks, social scripts, and a 7-day publish plan. Use both when you want titles and body content aligned to the same search intent.",
  },
  {
    q: "Do I need a full transcript to use the title generator?",
    a: "No. Enter your episode topic or a rough working title — the tool suggests searchable angles and audits clarity. When you are ready for the article and distribution assets, paste your transcript or show notes into the growth pack.",
  },
  {
    q: "Can I use these titles for my blog post too?",
    a: "Yes — the best episode titles often become your blog post H1 after light editing. Record with the episode title, then adapt the same angle when you publish the written version on your domain.",
  },
  {
    q: "Is the podcast title generator free?",
    a: `Yes. No credit card required. The growth pack includes ${pricing.free.ipDailyLimit} free runs per IP per day and ${pricing.free.emailMonthlyLimit} per email per month when you add an address for backup delivery.`,
  },
];

function FaqJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}

export const metadata: Metadata = {
  title: "Free podcast title generator online — episode title ideas & checker",
  description:
    "Free episode title generator online: enter your topic, get searchable podcast title ideas, keyword angles, and a rules-based clarity check. No credit card — then draft your SEO article with the growth pack.",
  alternates: { canonical },
  openGraph: {
    title: "Free podcast title generator online",
    description:
      "Episode title generator with searchable angles and a quick wording check — free in your browser.",
    url: canonical,
  },
};

export default function FreePodcastTitleGeneratorPage() {
  return (
    <div className="bg-background">
      <FaqJsonLd />
      <div className="mx-auto max-w-4xl px-4 pb-4 pt-8 text-center sm:px-6 sm:pt-10">
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Free podcast title generator
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Sharpen your episode headline before you record. For the SEO article, FAQ blocks, and social scripts, use{" "}
          <Link
            href="/tools/seo-growth-pack#pack-transcript-only"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Generate Draft Pack
          </Link>
          .
        </p>
      </div>
      <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
        <TitleGeneratorClient />
      </Suspense>

      <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">Common questions</h2>
        <dl className="mt-4 space-y-4">
          {faq.map((item) => (
            <div key={item.q}>
              <dt className="text-sm font-semibold text-foreground">{item.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Ready for the full workflow?{" "}
          <Link
            href="/tools/seo-growth-pack#pack-transcript-only"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Generate SEO growth pack
          </Link>
          {" · "}
          <Link href="/guides/podcast-to-blog-post" className="font-medium text-primary underline-offset-4 hover:underline">
            Podcast to blog guide
          </Link>
        </p>
      </section>
    </div>
  );
}
