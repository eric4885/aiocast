import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Highlight Extractor (coming soon)",
  description:
    "Planned AI highlight detection for TikTok + Reels using transcript + novelty scoring.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Highlight extractor — roadmap",
    url: `${siteConfig.url}/tools/highlight-extractor`,
  },
};

export default function HighlightExtractorPage() {
  return (
    <div className="border-b border-border bg-[#07070c] py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Sparkles className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-6 text-4xl font-bold">Highlight extractor</h1>
        <p className="mt-4 text-muted-foreground">
          This interactive tool is on the roadmap. Until it ships, use the
          short-video workflow plus your Descript transcript to identify hooks
          manually — the SOP lists the exact signals we look for.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/podcast-to-short-video">Open workflow</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/tools/seo-growth-pack">Generate SEO pack first</Link>
          </Button>
        </div>
        <Card className="mt-12 border-dashed border-border text-left">
          <CardContent className="space-y-2 p-6 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Planned feature set</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>LLM-assisted highlight ranking with editable in/out points</li>
              <li>Automatic 9:16 framing suggestions with face tracking hooks</li>
              <li>Batch export presets for TikTok, YouTube Shorts, and Instagram</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
