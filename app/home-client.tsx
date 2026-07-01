"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Check, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { freeHeroTagline } from "@/lib/pricing-copy";
import { saveTranscriptPrefill } from "@/lib/transcript-prefill";

export function HomePageClient() {
  const router = useRouter();
  const [transcript, setTranscript] = useState("");

  const handleGenerate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackEvent(AnalyticsEvents.ctaClick, { location: "home_hero", target: "generate_pack" });
    saveTranscriptPrefill(transcript);
    router.push("/tools/seo-growth-pack#pack-transcript-only");
  };

  return (
    <section className="relative overflow-x-hidden bg-background bg-grid-subtle pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-7 lg:pb-24">
        <div id="generate-pack" className="mx-auto max-w-2xl text-center">
          <form onSubmit={handleGenerate} className="text-left">
            <div className="rounded-2xl border border-primary/40 bg-card/90 p-6 shadow-lg shadow-black/20 ring-1 ring-primary/20 sm:p-8">
              <label htmlFor="home-transcript" className="sr-only">
                Podcast transcript or show notes
              </label>
              <textarea
                id="home-transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={4}
                placeholder="Paste your transcript or show notes here — even a rough outline works…"
                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary max-sm:max-h-40 max-sm:overscroll-y-contain md:min-h-[180px]"
                style={{ touchAction: "manipulation" }}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Full transcripts welcome — paste everything, no need to trim.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                No transcript yet?{" "}
                <Link href="/guides/show-notes-template" className="font-medium text-primary underline-offset-4 hover:underline">
                  Show notes template
                </Link>
                {" → "}
                <Link href="/tools/seo-growth-pack#pack-transcript-only" className="font-medium text-primary underline-offset-4 hover:underline">
                  Generate
                </Link>
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  type="submit"
                  size="lg"
                  className="min-h-[52px] w-full touch-manipulation px-8 text-base font-semibold sm:w-auto"
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Generate Draft Pack
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  className="min-h-[52px] w-full sm:w-auto"
                  asChild
                >
                  <Link href="/examples/sample-growth-pack">See example output</Link>
                </Button>
              </div>
              <p className="mt-4 text-center text-sm font-medium text-foreground">
                {freeHeroTagline}
              </p>
            </div>
          </form>
        </div>

        <div className="mx-auto mt-12 max-w-3xl border-t border-border pt-8 text-center sm:mt-14 sm:pt-10">
          <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-[2rem] sm:leading-snug md:text-3xl">
            What you get in one run
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Skip the blank page. Paste once, edit like a human, and ship on your domain — rankings take weeks and are
            never guaranteed.
          </p>
          <ul className="mx-auto mt-8 max-w-lg space-y-3 text-left text-[15px] leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
              <span>
                <strong className="text-foreground">SEO article draft</strong> — intent-based headings, meta
                description, and keywords
              </span>
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
              <span>
                <strong className="text-foreground">FAQ blocks</strong> — structured Q&amp;A for Google and AI search
              </span>
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
              <span>
                <strong className="text-foreground">Social scripts</strong> — LinkedIn, X, and newsletter copy
              </span>
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
              <span>
                <strong className="text-foreground">7-day publish plan</strong> — a rhythm to ship every week
              </span>
            </li>
          </ul>
          <Button
            size="lg"
            className="mx-auto mt-8 flex min-h-[52px] w-full max-w-md touch-manipulation px-8 text-base font-semibold sm:min-h-12 sm:px-10"
            asChild
          >
            <Link href="/tools/seo-growth-pack#pack-transcript-only">
              <Rocket className="mr-2 h-4 w-4" />
              Generate Draft Pack
            </Link>
          </Button>
          <p className="mx-auto mt-6 text-sm text-muted-foreground">
            Need episode title ideas only?{" "}
            <Link href="/tools/free-podcast-title-generator" className="font-medium text-primary underline-offset-4 hover:underline">
              Try the free title generator
            </Link>
            . Formatting notes for your site?{" "}
            <Link href="/tools/show-notes-to-html" className="font-medium text-primary underline-offset-4 hover:underline">
              Show notes → HTML
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl border-t border-border pt-8 text-center sm:mt-14 sm:pt-10">
          <p className="text-sm font-semibold text-foreground">Explore tools &amp; guides</p>
          <ul className="mx-auto mt-3 flex max-w-lg flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/guides/podcast-to-blog-post" className="text-primary underline-offset-4 hover:underline">
                Podcast → blog guide
              </Link>
            </li>
            <li>
              <Link href="/tools/free-podcast-title-generator" className="text-primary underline-offset-4 hover:underline">
                Title generator
              </Link>
            </li>
            <li>
              <Link href="/tools/show-notes-to-html" className="text-primary underline-offset-4 hover:underline">
                Show notes → HTML
              </Link>
            </li>
            <li>
              <Link href="/examples/sample-growth-pack" className="text-primary underline-offset-4 hover:underline">
                Example output
              </Link>
            </li>
          </ul>
          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-muted-foreground sm:gap-x-3">
            <span className="inline-flex min-h-[44px] items-center">© {new Date().getFullYear()} AioCast.com</span>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <Link
              href="/privacy"
              className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline"
            >
              Privacy
            </Link>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <Link href="/terms" className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline">
              Terms
            </Link>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <Link href="/help" className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline">
              Help
            </Link>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline"
            >
              Contact
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
