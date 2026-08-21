"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { productPromise } from "@/lib/product-copy";
import { saveTranscriptPrefill } from "@/lib/transcript-prefill";

/** Mini paste → growth pack handoff for guide pages (keeps generate flow on the tool page). */
export function GuideDraftPrefill({ location = "guide_podcast_to_blog" }: { location?: string }) {
  const router = useRouter();
  const [transcript, setTranscript] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackEvent(AnalyticsEvents.ctaClick, { location, target: "generate_pack_prefill" });
    saveTranscriptPrefill(transcript);
    router.push("/tools/seo-growth-pack#pack-transcript-only");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="not-prose my-6 rounded-xl border border-primary/35 bg-card/80 p-5 shadow-sm ring-1 ring-primary/15 sm:p-6"
    >
      <p className="text-base font-semibold text-foreground">Try it on this page</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Paste show notes or a transcript below. We&apos;ll open the free generator with your text ready — no signup for
        the free daily limit.
      </p>
      <label htmlFor="guide-draft-prefill" className="sr-only">
        Show notes or transcript
      </label>
      <textarea
        id="guide-draft-prefill"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={5}
        placeholder="Paste show notes or a rough transcript…"
        className="mt-4 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" className="min-h-12 touch-manipulation font-semibold">
          <Rocket className="mr-2 h-4 w-4" />
          {productPromise.cta}
        </Button>
        <p className="text-xs text-muted-foreground sm:max-w-xs">
          Continues on the free growth pack tool. Edit the draft, then publish on your own site.
        </p>
      </div>
    </form>
  );
}
