import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Podcast FAQ blocks for SEO — how to use them",
  description:
    "How to add FAQ sections from podcast episodes to your site for clearer structure and snippet-friendly content.",
  alternates: { canonical: `${siteConfig.url}/guides/podcast-faq-for-seo` },
  openGraph: {
    title: "Podcast FAQ for SEO",
    url: `${siteConfig.url}/guides/podcast-faq-for-seo`,
  },
};

export default function PodcastFaqSeoGuidePage() {
  return (
    <GuideLayout
      title="Podcast FAQ blocks for SEO"
      description="FAQ sections answer the questions listeners type into search. Here is how to use them honestly — without keyword stuffing."
    >
      <h2>What FAQ blocks are for</h2>
      <p>
        Each episode naturally answers how/what/why questions. Pulling three of those into a FAQ section gives search
        engines a clear Q&amp;A structure and gives skimmers a fast on-ramp before they commit to the full article.
      </p>

      <h2>Where to put them</h2>
      <ul>
        <li>
          <strong>Inside the blog post</strong> — accordion at the bottom, above the conclusion.
        </li>
        <li>
          <strong>On the episode landing page</strong> — if you host show notes on your site, mirror the same FAQ there.
        </li>
        <li>
          <strong>Do not duplicate</strong> the same FAQ verbatim across twenty URLs — one canonical article per topic
          cluster is enough.
        </li>
      </ul>

      <h2>How to write good FAQ pairs</h2>
      <ol>
        <li>Questions should sound like a real search query (&quot;How do I…&quot;, &quot;What is…&quot;).</li>
        <li>Answers should be 2–4 sentences grounded in the episode — not generic podcast advice.</li>
        <li>Skip FAQ entries you cannot defend from the transcript.</li>
      </ol>

      <h2>Optional: FAQ schema (JSON-LD)</h2>
      <p>
        Many CMS SEO plugins can add FAQ schema when you use their FAQ block. If you paste HTML manually, you can add
        JSON-LD separately — validate in Google&apos;s Rich Results Test. Schema does not create rankings by itself; it
        only clarifies structure.
      </p>
      <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/40 p-4 text-xs text-foreground/90">{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Do I need a full transcript for a growth pack?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "No. Polished show notes or a detailed outline work."
    }
  }]
}`}</pre>

      <h2>Generate FAQ drafts from your episode</h2>
      <p>
        The{" "}
        <Link href="/tools/seo-growth-pack" className="text-primary hover:underline">
          SEO growth pack
        </Link>{" "}
        includes three Q&amp;A pairs per run. Edit them before publish. See how they look in our{" "}
        <Link href="/examples/sample-growth-pack" className="text-primary hover:underline">
          public example pack
        </Link>
        .
      </p>
    </GuideLayout>
  );
}
