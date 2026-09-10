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
  title: { absolute: "Free Podcast Title Generator (No Login)" },
  description:
    "Free podcast title generator: enter a topic, get SEO episode title ideas and a clarity check. Then draft your article with the growth pack.",
  alternates: { canonical },
  openGraph: {
    title: "Free Podcast Title Generator (No Login)",
    description:
      "Episode title ideas with searchable angles and a quick wording check — free, no credit card.",
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

      <section className="mx-auto max-w-2xl px-4 pb-10 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">How to write SEO podcast titles</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            A strong podcast episode title names <strong className="text-foreground">who it is for</strong> and{" "}
            <strong className="text-foreground">what problem it solves</strong> — not &quot;Ep.47 with Jane.&quot; Lead
            with the outcome or question listeners type into Google or Apple Podcasts search. Keep the title under
            roughly 60 characters when you can, put the keyword near the front, and save inside jokes for the cold open.
          </p>
          <p>
            Use this free podcast title generator after you have a topic phrase or rough working title. Enter the angle,
            review the suggested headlines and clarity checks, then pick one searchable promise for the episode. That
            same angle should later become your blog post H1 and title tag so the audio episode and the written SEO pack
            stay aligned.
          </p>
          <p>
            Titles alone do not create indexable pages. When the episode notes or transcript are ready, paste them into
            the{" "}
            <Link
              href="/tools/seo-growth-pack#pack-transcript-only"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              publish-ready SEO pack
            </Link>{" "}
            (or the{" "}
            <Link
              href="/tools/free-show-notes-generator"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              free paste-notes → draft tool
            </Link>
            ) to get an article draft, FAQ blocks, and social scripts for your own domain. Rankings are never guaranteed —
            publish on your site, then run the{" "}
            <Link
              href="/resources/podcast-to-blog-seo-checklist"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              podcast to blog SEO checklist
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-10 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">Podcast title ideas (by episode type)</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Stuck on <strong className="text-foreground">podcast title ideas</strong>? Use a formula, then swap in your
            niche. A solid <strong className="text-foreground">podcast episode title generator</strong> workflow is:
            pick the formula → draft 3 variants → run the tool above for clarity and keyword angles → lock one promise
            before you record.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">How-to:</strong> &quot;How Solo Podcasters Write Show Notes in 20
              Minutes&quot;
            </li>
            <li>
              <strong className="text-foreground">Mistake / myth:</strong> &quot;Why Episode Numbers Kill Your Podcast
              SEO&quot;
            </li>
            <li>
              <strong className="text-foreground">Numbered list:</strong> &quot;7 Podcast Title Ideas That Actually Get
              Clicked&quot;
            </li>
            <li>
              <strong className="text-foreground">Audience + outcome:</strong> &quot;For Indie Hosts: Turn Notes Into a
              Blog Draft&quot;
            </li>
            <li>
              <strong className="text-foreground">Question:</strong> &quot;Do You Need a Transcript to Rank Podcast
              Episodes?&quot;
            </li>
            <li>
              <strong className="text-foreground">Interview:</strong> &quot;Guest Name on [Specific Result Listeners
              Want]&quot;
            </li>
            <li>
              <strong className="text-foreground">Case study:</strong> &quot;How We Grew Episode Pages Without Buying
              Ads&quot;
            </li>
            <li>
              <strong className="text-foreground">Checklist:</strong> &quot;Pre-Publish SEO Checklist for Podcast Blog
              Posts&quot;
            </li>
          </ul>
          <p>
            Prefer more ideas for your exact topic? Enter it in the generator at the top of this page — free, no login —
            then paste your show notes into the{" "}
            <Link
              href="/tools/seo-growth-pack#pack-transcript-only"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              SEO growth pack
            </Link>{" "}
            when you are ready to publish on your domain.
          </p>
        </div>
      </section>

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
            Turn a podcast into a blog post
          </Link>
        </p>
      </section>
    </div>
  );
}
