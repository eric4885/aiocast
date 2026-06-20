"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SubscribeForm } from "@/components/shared/SubscribeForm";
import { CheckoutButtons } from "@/components/pricing/CheckoutButtons";
import { pricing, proPerks } from "@/lib/pricing";
import { pageVariants } from "@/lib/motion";

function AssetBundleArticle() {
  return (
    <div className="relative">
      <span className="absolute -left-[41px] top-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-xs font-bold">
        01
      </span>
      <Card className="overflow-hidden border-border/80">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="space-y-4 p-6">
            <h3 className="text-xl font-semibold">AI-optimized deep long-form article</h3>
            <p className="text-muted-foreground">
              A ~900–1,300 word draft structured for search intent, topical depth, and clear H2 headings — first pass
              from your episode, not generic fluff.
            </p>
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 text-sm text-primary">
              <Clock className="mb-2 inline h-4 w-4" /> Written for readers and search — review facts before you publish.
            </div>
          </div>
          <div className="border-t border-border/60 bg-secondary/40 p-6 md:border-l md:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sample excerpt</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/95">
              Most indie shows publish once and vanish from search. This outline turns your episode&apos;s strongest
              framework into a definitive guide: what changed, what to try Monday morning, and where listeners typically
              get stuck — so both humans and search engines see a reason to cite you…
            </p>
            <Link
              href="/tools/seo-growth-pack"
              className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              See example output →
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AssetBundleFaq() {
  return (
    <div className="relative">
      <span className="absolute -left-[41px] top-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-xs font-bold">
        02
      </span>
      <Card className="overflow-hidden border-border/80">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="space-y-4 p-6">
            <h3 className="text-xl font-semibold">FAQ blocks for your site</h3>
            <p className="text-muted-foreground">
              Three Q&amp;A pairs from your episode — formatted to paste into blog posts or landing pages.
            </p>
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 text-sm text-primary">
              <Clock className="mb-2 inline h-4 w-4" /> Short, declarative answers outperform rambling show notes.
            </div>
          </div>
          <div className="space-y-3 border-t border-border/60 bg-secondary/40 p-6 md:border-l md:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sample FAQs</p>
            <div className="rounded-lg border border-border bg-background/70 p-3 text-sm">
              <p className="font-semibold text-foreground">What&apos;s the fastest win from this episode?</p>
              <p className="mt-1 text-muted-foreground">
                Batch-record hooks first — it cuts perceived editing time roughly in half for solo hosts.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background/70 p-3 text-sm">
              <p className="font-semibold text-foreground">Who is this for?</p>
              <p className="mt-1 text-muted-foreground">
                Indie podcasters publishing weekly who want search traffic without hiring a full SEO desk.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AssetBundleSocial() {
  return (
    <div className="relative">
      <span className="absolute -left-[41px] top-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-xs font-bold">
        03
      </span>
      <Card className="overflow-hidden border-border/80">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="space-y-4 p-6">
            <h3 className="text-xl font-semibold">Social scripts + subtitle-ready highlights</h3>
            <p className="text-muted-foreground">
              Angle variants for X / LinkedIn / newsletter intros, plus highlight pulls you can pair with a subtitle
              file for Shorts or YouTube.
            </p>
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 text-sm text-primary">
              <Clock className="mb-2 inline h-4 w-4" /> Same ideas, channel-native hooks — fewer “link in bio” dead ends.
            </div>
          </div>
          <div className="border-t border-border/60 bg-secondary/40 p-6 md:border-l md:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sample X thread (clip)</p>
            <div className="mt-3 rounded-xl border border-border bg-background/80 p-4 font-mono text-[13px] leading-relaxed text-foreground/90">
              <p>1/ I used to ship episodes and pray for downloads. Now I ship one SEO article + 3 FAQs off the same tape.</p>
              <p className="mt-2">2/ Biggest mistake: burying the takeaway in minute 27. Front-load the promise in the headline.</p>
              <p className="mt-2 text-muted-foreground">…full thread in pack output.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

const stats = [
  {
    label: "Production latency",
    before: "Episode published, content delayed for days",
    after: "SEO + social pack in one pass",
    delta: "Single workflow",
  },
  {
    label: "Search coverage",
    before: "Long unstructured transcript pages",
    after: "Intent-structured article + FAQ blocks",
    delta: "Search-first",
  },
  {
    label: "Distribution output",
    before: "Manual post writing per channel",
    after: "Scripts for X, LinkedIn, and Substack",
    delta: "Multi-channel",
  },
];

const rows = [
  {
    feature: "Primary job",
    a: "Record/edit/host",
    b: "Clip videos",
    c: "Audio → SEO growth pack",
    pick: "🏆 Descript / Riverside.fm (recording)",
  },
  {
    feature: "SEO article structure",
    a: "Basic notes/transcript",
    b: "Not core",
    c: "Intent map + H2 + FAQ + metadata",
    pick: "AioCast.com (SEO depth)",
  },
  {
    feature: "Social script pack",
    a: "Partial",
    b: "Video-focused",
    c: "X / LinkedIn / newsletter scripts",
    pick: "Clip tools (video) · AioCast (written scripts)",
  },
  {
    feature: "7-day publish plan",
    a: "Minimal",
    b: "Minimal",
    c: "7 lines with timing hints (adapt locally)",
    pick: "AioCast.com (rollout suggestions)",
  },
];

export function EditingStackView() {
  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants} className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero bg-grid-subtle">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary">Podcast to blog workflow</Badge>
            <Badge className="border border-border bg-transparent text-muted-foreground">AI-optimized articles</Badge>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-[2.75rem] lg:text-5xl lg:leading-tight">
            Paste show notes or upload audio — pull out a complete growth asset bundle.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            Keep your recording stack. Paste show notes or upload a short clip — get an SEO article draft, FAQ blocks,
            social scripts for X / LinkedIn / Substack, SRT, and a 7-day publish plan in one free run.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {stats.map((s) => (
              <Card key={s.label} className="border-border/80 bg-secondary/60">
                <CardContent className="space-y-2 p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Sparkles className="h-4 w-4" /> {s.label}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.before}</div>
                  <div className="text-2xl font-bold text-foreground">{s.after}</div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-accent">{s.delta}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/tools/seo-growth-pack">
                Generate SEO pack
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Asset bundle preview</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            The front-end should feel effortless: upload once, receive packaged growth assets.
          </p>

          <div className="relative mt-12 space-y-10 border-l border-dashed border-border pl-8">
            <AssetBundleArticle />
            <AssetBundleFaq />
            <AssetBundleSocial />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[#07070c] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Positioning comparison</h2>
          <p className="mt-3 text-muted-foreground">
            Existing tools are great at recording/hosting/video clips. We focus on direct SEO and content distribution outputs.
          </p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-secondary/80 text-left text-muted-foreground">
                  <th className="p-4 font-medium">Feature</th>
                  <th className="p-4 font-medium">Recording/hosting tools</th>
                  <th className="p-4 font-medium">Video clip tools</th>
                  <th className="p-4 font-medium">AioCast.com</th>
                  <th className="p-4 font-medium">Best fit</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="border-t border-border/70 text-foreground">
                    <td className="p-4 font-semibold">{row.feature}</td>
                    <td className="p-4 text-muted-foreground">{row.a}</td>
                    <td className="p-4 text-muted-foreground">{row.b}</td>
                    <td className="p-4 text-muted-foreground">{row.c}</td>
                    <td className="p-4 font-mono text-xs text-primary">{row.pick}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="lead-checklist" className="scroll-mt-24 border-b border-border py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 sm:px-6">
          <div>
            <h2 className="text-3xl font-bold">Get the free recording checklist</h2>
            <p className="mt-3 text-muted-foreground">
              We&apos;ll email the pre-flight checklist (noise, gain, backups). Sample SEO output — article, FAQ,
              social scripts — lives on the{" "}
              <Link href="/tools/seo-growth-pack" className="font-medium text-primary underline-offset-4 hover:underline">
                free growth pack
              </Link>{" "}
              page; expand &quot;See example output&quot; there anytime.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              {[
                "Pre-flight guardrails before every recording session",
                "Gain staging, headphone bleed, and two-location backup steps",
                "Welcome email with web + Markdown download links",
                "Optional weekly briefing on audio-to-SEO workflows",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="border-border/80">
            <CardContent className="space-y-4 p-8">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <FileText className="h-4 w-4" /> Email me the recording checklist
              </div>
              <SubscribeForm
                source="editing_stack"
                submitLabel="Send to my inbox"
                layout="stack"
                finePrint="No spam. One practical update per week on audio-to-SEO workflows."
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b border-border bg-gradient-to-b from-[#07070c] to-background py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <Badge className="bg-accent/15 text-accent">AioCast Pro</Badge>
          <h2 className="mt-6 text-4xl font-bold sm:text-5xl">
            ${pricing.pro.monthlyUsd}
            <span className="text-2xl font-semibold text-muted-foreground">/month</span>
          </h2>
          <p className="mt-2 text-sm text-success font-medium">
            First month ${pricing.pro.firstMonthUsd} · or ${pricing.pro.annualUsd}/year
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            First {pricing.pro.annualEarlyBirdSlots} annual subscribers get {pricing.pro.annualBonusMonths} bonus months
            (14 months total).
          </p>
          <div className="mx-auto mt-10 max-w-xl text-left">
            <Card className="border-primary/40 bg-secondary/60">
              <CardContent className="space-y-4 p-8">
                {proPerks.map((line) => (
                  <div key={line} className="flex gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{line}</span>
                  </div>
                ))}
                <div className="pt-4">
                  <CheckoutButtons />
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Use the same email at checkout and when you generate packs.{" "}
                    <Link href="/pro-toolkit" className="text-primary underline-offset-4 hover:underline">
                      Full pricing details
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
