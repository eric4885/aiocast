"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { freeHeroTagline, homePricingAnchor } from "@/lib/pricing-copy";
import { homeScenes, productPromise } from "@/lib/product-copy";
import { saveTranscriptPrefill } from "@/lib/transcript-prefill";
import { cn } from "@/lib/utils";

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
                placeholder="Paste show notes or a transcript — even a rough outline works…"
                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary max-sm:max-h-40 max-sm:overscroll-y-contain md:min-h-[180px]"
                style={{ touchAction: "manipulation" }}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Input: show notes or transcript → Output: editable SEO blog draft for your site.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  type="submit"
                  size="lg"
                  className="min-h-[52px] w-full touch-manipulation px-8 text-base font-semibold sm:w-auto"
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  {productPromise.cta}
                </Button>
                <Button type="button" size="lg" variant="secondary" className="min-h-[52px] w-full sm:w-auto" asChild>
                  <Link href="/examples/sample-growth-pack">See example draft</Link>
                </Button>
              </div>
              <p className="mt-4 text-center text-sm font-medium text-foreground">{freeHeroTagline}</p>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {homePricingAnchor()} —{" "}
                <Link href="/pro-toolkit" className="font-medium text-primary underline-offset-4 hover:underline">
                  See pricing
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="mx-auto mt-14 max-w-3xl border-t border-border pt-10 sm:mt-16 sm:pt-12">
          <h2 className="text-center text-balance text-2xl font-bold leading-tight tracking-tight sm:text-[2rem]">
            Where are you right now?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[15px] leading-relaxed text-muted-foreground">
            Pick the situation that matches your week — not a menu of tools.
          </p>

          <ul className="mt-8 space-y-4">
            {homeScenes.map((scene) => (
              <li key={scene.id}>
                <Link
                  href={scene.href}
                  onClick={() =>
                    trackEvent(AnalyticsEvents.ctaClick, {
                      location: "home_scene",
                      target: scene.id,
                    })
                  }
                  className={cn(
                    "group block rounded-2xl border p-5 transition-colors sm:p-6",
                    scene.primary
                      ? "border-primary/40 bg-primary/5 hover:border-primary/60 hover:bg-primary/10"
                      : "border-border bg-card/60 hover:border-primary/35 hover:bg-card/90",
                  )}
                >
                  <p className="text-base font-semibold text-foreground sm:text-lg">{scene.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{scene.description}</p>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {scene.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-8 max-w-lg text-center text-sm text-muted-foreground">
            No notes yet? Start with the{" "}
            <Link href="/guides/show-notes-template" className="font-medium text-primary underline-offset-4 hover:underline">
              show notes template
            </Link>
            , then come back to generate a draft. Need titles only?{" "}
            <Link
              href="/tools/free-podcast-title-generator"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Title generator
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl border-t border-border pt-8 text-center sm:mt-14 sm:pt-10">
          <p className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-muted-foreground sm:gap-x-3">
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
