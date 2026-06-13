import type { Metadata } from "next";
import Link from "next/link";
import { PublicPackPreview } from "@/components/examples/PublicPackPreview";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sample SEO growth pack output — podcast to blog example",
  description:
    "See a full example SEO article, FAQ blocks, social scripts, and 7-day publish plan from one podcast episode — before you generate your own.",
  alternates: { canonical: `${siteConfig.url}/examples/sample-growth-pack` },
  openGraph: {
    title: "Sample podcast SEO growth pack",
    description: "Example article, FAQ, social scripts, and publish schedule from AioCast.com.",
    url: `${siteConfig.url}/examples/sample-growth-pack`,
  },
};

function ExampleArticleJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");
  const payload = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How Indie Podcasters Turn One Episode Into a Week of SEO Content",
    description:
      "Example SEO article draft from the AioCast growth pack — illustrative output for podcast-to-blog repurposing.",
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name, url: base },
    mainEntityOfPage: `${base}/examples/sample-growth-pack`,
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}

export default function SampleGrowthPackExamplePage() {
  return (
    <>
      <ExampleArticleJsonLd />
      <div className="border-b border-border bg-gradient-hero bg-grid-subtle">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            {" · "}
            <Link href="/tools/seo-growth-pack" className="text-primary hover:underline">
              Generate SEO pack
            </Link>
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">Public example</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Sample SEO growth pack output</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            This is a static demo of what the free tool delivers — not a live user pack. Generate your own from your
            transcript or show notes; always edit before publishing.
          </p>
          <PublicPackPreview />
        </div>
      </div>
    </>
  );
}
