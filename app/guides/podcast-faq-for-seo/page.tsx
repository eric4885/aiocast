import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { siteConfig } from "@/lib/data";

const faq = [
  {
    q: "What are podcast FAQ blocks for SEO?",
    a: "FAQ blocks are short Q&A pairs pulled from an episode that mirror how listeners search. Placed in a blog post or episode page, they give crawlers clear structure and give skimmers a fast on-ramp before the full article.",
  },
  {
    q: "Where should I put FAQ sections from a podcast episode?",
    a: "Put them inside the canonical blog post (accordion near the end) or on the episode landing page with show notes. Do not paste the same FAQ verbatim across dozens of URLs — one strong page per topic cluster is enough.",
  },
  {
    q: "Do I need FAQ schema JSON-LD to rank?",
    a: "No. Schema clarifies structure for rich results; it does not create rankings by itself. Write honest answers grounded in the episode first, then add FAQ schema via your CMS plugin or a validated JSON-LD block.",
  },
  {
    q: "How do I generate FAQ drafts from a podcast?",
    a: "Paste a transcript or structured show notes into the AioCast SEO growth pack. Each run includes three Q&A pairs — edit them for voice and accuracy before publishing.",
  },
] as const;

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
  title: "Podcast FAQ blocks for SEO — how to use them",
  description:
    "How to add FAQ sections from podcast episodes to your site for clearer structure and snippet-friendly content.",
  alternates: { canonical: `${siteConfig.url}/guides/podcast-faq-for-seo` },
  openGraph: {
    title: "Podcast FAQ for SEO",
    description:
      "Write honest podcast FAQ blocks for search and skimmers — placement tips, writing rules, and optional JSON-LD.",
    url: `${siteConfig.url}/guides/podcast-faq-for-seo`,
  },
};

export default function PodcastFaqSeoGuidePage() {
  return (
    <>
      <FaqJsonLd />
      <GuideLayout
        title="Podcast FAQ blocks for SEO"
        description="FAQ sections answer the questions listeners type into search. Here is how to use them honestly — without keyword stuffing."
        path="/guides/podcast-faq-for-seo"
        datePublished="2026-06-20"
        dateModified="2026-07-30"
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

        <h2>Common questions</h2>
        <dl className="space-y-4">
          {faq.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-foreground">{item.q}</dt>
              <dd className="mt-1">{item.a}</dd>
            </div>
          ))}
        </dl>

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
          , or follow the full{" "}
          <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
            podcast to blog
          </Link>{" "}
          workflow.
        </p>
      </GuideLayout>
    </>
  );
}
