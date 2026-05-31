"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, Link2, Mic, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FunnelNextStep } from "@/components/shared/FunnelNextStep";
import { pageVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

const kit = [
  {
    title: "Cleaner transcript = better SEO draft",
    body: "Noise and clipped speech reduce keyword quality. Better input audio improves entity extraction and article structure.",
    icon: Mic,
  },
  {
    title: "Channel intent mapping",
    body: "Use one transcript to branch into search article intent, social hook intent, and newsletter intent.",
    icon: CalendarClock,
  },
  {
    title: "Execution discipline",
    body: "A local schedule keeps outputs shipping weekly instead of piling up in drafts.",
    icon: Link2,
  },
];

export function RemoteRecordingView() {
  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants} className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero bg-grid-subtle">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary/15 text-primary">Tools</Badge>
            <Badge className="border border-border bg-transparent text-muted-foreground">Local Schedule</Badge>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-[2.75rem] lg:text-5xl lg:leading-tight">
            Publish your episode at the right time, in the right timezone, for the right audience — automatically.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            Map where listeners actually live, then line up article drops and social posts so they land during peak
            attention — without guessing from a single default clock.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/contact?intent=timezone-analysis">
                Join waitlist for timezone analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/ai-podcast-editing-stack">Open Content OS</Link>
            </Button>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            Need assets today? The free{" "}
            <Link href="/tools/audio-quality-checker?from=remote" className="font-semibold text-primary underline-offset-4 hover:underline">
              Generate pack
            </Link>{" "}
            flow includes a 7-day publish plan with timing hints you can adapt to your regions.
          </p>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-[2rem]">
                Execution stack for regional growth
              </h2>
              <p className="mt-3 text-muted-foreground">
                Keep your existing recording stack. This layer translates each episode into location-aware publishing
                actions.
              </p>
              <div className="mt-8 space-y-6">
                {kit.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <Card className="border-border/80 bg-secondary/50">
              <CardContent className="space-y-4 p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-amber-500/20 text-amber-100">Sample profile</Badge>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <ShieldCheck className="h-4 w-4" /> Localized schedule profile
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Illustrative defaults — not pulled from your account. Use it as a formatting reference when you request
                  the full template.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>Regions: US East / UK / SG-style clusters (customizable)</li>
                  <li>Cadence: deep article first, social scripts within 24 hours</li>
                  <li>Weekly rhythm: 1 flagship post + 3 lightweight social assets</li>
                  <li>Feedback loop: refresh keyword themes after 14 days of signals</li>
                </ul>
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sample week grid</p>
                  <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-muted-foreground">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <span key={d} className="rounded bg-secondary/80 py-2">
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1 text-[11px] font-semibold leading-tight">
                    {[
                      { label: "1 article", tone: "art" },
                      { label: "—", tone: "rest" },
                      { label: "2 social", tone: "soc" },
                      { label: "—", tone: "rest" },
                      { label: "1 article", tone: "art" },
                      { label: "—", tone: "rest" },
                      { label: "—", tone: "rest" },
                    ].map((cell, i) => (
                      <span
                        key={`c-${i}`}
                        className={cn(
                          "rounded px-0.5 py-2 text-center",
                          cell.tone === "art" &&
                            "border border-sky-500/40 bg-sky-950/90 text-sky-100",
                          cell.tone === "soc" &&
                            "border border-violet-500/40 bg-violet-950/90 text-violet-100",
                          cell.tone === "rest" && "border border-border/60 bg-secondary/80 text-foreground/80",
                        )}
                      >
                        {cell.label}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Blue = article drops · Violet = social — illustrative rhythm; real template adapts to your RSS +
                    analytics.
                  </p>
                </div>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/contact">Sample template — request access</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <FunnelNextStep
        eyebrow="Next step"
        title="Layer on the full Content OS"
        description="Pair this cadence with AI-optimized articles, FAQs, and scripts generated from the same episode audio."
        href="/ai-podcast-editing-stack"
        linkLabel="Open Content OS →"
      />
    </motion.div>
  );
}
