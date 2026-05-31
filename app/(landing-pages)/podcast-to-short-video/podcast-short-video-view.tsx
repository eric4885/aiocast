"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, MessageSquareText, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FunnelNextStep } from "@/components/shared/FunnelNextStep";
import { pageVariants } from "@/lib/motion";

const steps = [
  {
    title: "Extract platform angles",
    body: "Pull the strongest opinions, stories, and frameworks from your transcript to seed channel-specific narratives.",
    icon: MessageSquareText,
    output: "→ ~5 post angles per episode",
  },
  {
    title: "Generate scripts, not clips",
    body: "Deliver ready-to-edit copy for X, LinkedIn, newsletter intros, and community posts in your voice.",
    icon: PenLine,
    output: "→ X thread (7 tweets) + LinkedIn hook + newsletter intro",
  },
  {
    title: "Schedule by region",
    body: "Attach timezone-aware slots so posts go live when listeners are actually scrolling.",
    icon: CalendarClock,
    output: "→ 3 posting slots per priority region",
  },
];

export function PodcastShortVideoView() {
  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants} className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero bg-grid-subtle">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-accent/15 text-accent">Tool preview · Social</Badge>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-[2.75rem] lg:text-5xl lg:leading-tight">
            Podcast audio to ready-to-post social scripts
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            Skip re-writing the same episode five ways. We package hooks for your own X, LinkedIn, and newsletter — first
            person, host-native tone.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/contact?intent=social-scripts">
                Join the waitlist — scripts ship next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/tools/audio-quality-checker">
                Generate full pack
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-3 inline-flex max-w-xl rounded-xl border border-amber-500/35 bg-amber-950/40 px-4 py-3 text-sm font-medium text-amber-100">
            Coming soon: standalone social-scripts workflow. Today, social copy ships inside the full pack (article +
            scripts + weekly plan).
          </p>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            Currently ships as part of the full pack — standalone social scripts coming soon.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-[2rem]">Three-stage script pipeline</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Each stage ends in tangible copy you can paste — not vague “strategy.”
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.title} className="border-border/80">
                  <CardContent className="space-y-4 p-6">
                    <Icon className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.body}</p>
                    <p className="text-sm font-semibold text-primary">{s.output}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card className="border-border bg-background/80">
              <CardContent className="space-y-3 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sample X post</p>
                <p className="rounded-lg border border-border bg-secondary/40 p-4 text-sm leading-relaxed text-foreground">
                  Hot take from today&apos;s episode: your RSS title matters more than your cover art for cold discovery.
                  Here are 3 patterns we A/B tested across 40 episodes 👇 (thread)
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-background/80">
              <CardContent className="space-y-3 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sample LinkedIn lede
                </p>
                <p className="rounded-lg border border-border bg-secondary/40 p-4 text-sm leading-relaxed text-foreground">
                  Most indie podcasts optimize for Apple Podcasts and ignore LinkedIn search entirely. After shifting my
                  episode summaries to keyword-led hooks, inbound guest pitches doubled in six weeks. Three repeatable
                  tactics from the latest show…
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <FunnelNextStep
        eyebrow="Next step"
        title="Align posts with regional timing"
        description="Pair scripts with timezone-aware publishing guidance before you scale spend."
        href="/remote-recording-setup"
        linkLabel="Open Local schedule guide →"
      />
    </motion.div>
  );
}
