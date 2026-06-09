import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pro toolkit — Audio to SEO growth assets",
  description:
    "Convert one episode into AIO long-form content, FAQ search blocks, social script matrix, and highlight assets.",
  alternates: { canonical: `${siteConfig.url}/pro-toolkit` },
  openGraph: {
    title: "AioCast.com growth asset toolkit",
    description:
      "From podcast audio to searchable growth assets.",
    url: `${siteConfig.url}/pro-toolkit`,
  },
};

const perks = [
  "1 long-form blog post (2,000+ words) + 3 Q&A blocks to capture Google featured snippets",
  "Ready-to-post scripts for X, LinkedIn & Substack — just copy and publish",
  "Best quote highlights from your episode + subtitle file for YouTube/video reuse",
  "Localized publishing strategy by region and timezone",
];

export default function ProToolkitPage() {
  return (
    <div className="border-b border-border bg-gradient-hero bg-grid-subtle">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          MVP Toolkit
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Podcast to Search Growth Engine
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Turn episodes into long-form articles built for search, snippet-ready FAQs,
          and ready-to-post social copy — so listeners find you before they find a competitor. Today&apos;s free pack
          runs on text you paste (transcript or show notes); paid tiers may add deeper automation later.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-primary/40 bg-secondary/70">
            <CardContent className="space-y-6 p-8">
              <div>
                <p className="text-sm text-muted-foreground line-through">$79</p>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-5xl font-bold">$39</span>
                  <span className="text-sm font-semibold text-success">Planned launch price</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Checkout is not live yet — the same outputs are available now via the free growth pack when you paste a
                  transcript.
                </p>
              </div>
              <ul className="space-y-4">
                {perks.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/tools/seo-growth-pack">
                    Start free — generate my pack
                  </Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  No payment on this preview. Use the free tool to ship drafts today; we&apos;ll email when paid checkout
                  opens.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="space-y-4 p-8 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Growth preview</p>
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Google Search (illustrative)</p>
                <p className="mt-2 text-xs text-primary">YourPodcast.com/ep-42-ai-tools</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Ep 42: The AI tools that cut my editing time in half (full breakdown)
                </p>
                <p className="mt-1 text-xs">
                  AI-optimized long-form write-up + FAQ blocks derived from your episode — shown here as if it lived on
                  your site.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">X Post (mockup)</p>
                <p className="mt-2 text-sm">
                  &quot;I turned my episode into a Google-ranking article in 48 hours. Same mic, same show — just better
                  packaging for search.&quot;
                </p>
                <p className="mt-2 text-xs text-primary">
                  Illustrative metrics only · Views 24.8K · Reposts 312 · Bookmarks 1.2K
                </p>
              </div>
              <p>
                Example preview only. Real outcomes vary by topic quality and distribution execution.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
