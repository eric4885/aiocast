import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SubscribeForm } from "@/components/shared/SubscribeForm";
import { SavePdfButton } from "./print-button";
import { CHECKLIST_MD_PATH } from "@/lib/checklist-markdown";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Preflight Checklist for Podcast Recording (Free Printable)",
  description:
    "Free preflight checklist for podcast recording — room noise, gain staging, backups, and editing order. Print, download, or bookmark before every session.",
  alternates: { canonical: `${siteConfig.url}/resources/pre-flight-checklist` },
  openGraph: {
    title: "Preflight checklist for podcast recording (printable)",
    description:
      "Room noise, gain staging, backups, and editing order — a free preflight checklist for solo and remote podcast sessions.",
    url: `${siteConfig.url}/resources/pre-flight-checklist`,
  },
};

const sections = [
  {
    title: "Before you hit record",
    items: [
      {
        label: "Room noise under control",
        detail:
          "Close windows, move away from HVAC vents, and record 10 seconds of silence. If you hear hum in headphones, fix the room before fixing it in post — noise reduction never sounds as good as a quiet capture.",
      },
      {
        label: "One mic per voice",
        detail:
          "Riverside, Squadcast, and local multitrack sessions should give you separate WAVs per speaker. One mixed track is harder to salvage and worse for auto-transcription accuracy.",
      },
      {
        label: "Gain staging",
        detail:
          "Aim for speech peaks around -12 to -6 dBFS. Too hot clips; too quiet adds noise when you normalize. Leave headroom for laughs and emphasis.",
      },
      {
        label: "Closed-back headphones for guests",
        detail:
          "Guests hear themselves without speaker bleed leaking back into the mic — especially important on remote calls where you cannot control their room.",
      },
    ],
  },
  {
    title: "During the session",
    items: [
      {
        label: "Clap or slate at the top",
        detail:
          "Sync scratch tracks when recording separate devices or when you might merge files later. Say the episode slug out loud if you batch multiple sessions in one day.",
      },
      {
        label: "Watch meters",
        detail:
          "Fix clipping and whisper-quiet dialogue before you wrap. A five-second level check saves twenty minutes of rescue editing.",
      },
    ],
  },
  {
    title: "After recording",
    items: [
      {
        label: "Back up to two locations",
        detail:
          "Cloud + local disk or a second folder before you edit. Do not trust a single sync queue to finish before you close the app.",
      },
      {
        label: "Listen through once before destructive cuts",
        detail:
          "Map the story arc first. Structure beats filler removal — cut ums only after you know what stays.",
      },
      {
        label: "Remove filler after structure is set",
        detail:
          "Aggressive filler passes on a messy timeline waste time. Lock sections, then polish delivery.",
      },
    ],
  },
];

const faq = [
  {
    q: "What is a podcast preflight checklist?",
    a: "A short run-through before you hit Record: room noise, mic levels, backups, and session habits so your files are edit-ready and transcript-friendly.",
  },
  {
    q: "How long does preflight take?",
    a: "Usually three to five minutes once your room and kit are familiar. Remote interviews take an extra minute to confirm separate tracks and guest headphones.",
  },
  {
    q: "Do I need preflight for remote podcasts?",
    a: "Yes — especially for separate tracks, guest headphone bleed, and backup files before cloud sync finishes. Remote sessions fail more often on levels and sync than on content.",
  },
];

export default function PreFlightChecklistPage() {
  return (
    <div className="border-b border-border bg-background print:border-0">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24 print:max-w-none print:py-8">
        <p className="text-sm font-semibold text-primary">Free resource</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Preflight checklist for podcast recording (printable)
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          A <strong className="text-foreground">preflight checklist for podcast recording</strong> is the fastest way to
          avoid the problems that ruin transcripts later: clipping, room hum, missing backups, and guests recorded on one
          muddy track. Use this list before solo episodes, remote interviews, or any session you plan to turn into show
          notes or a blog post. Print it, download the <code className="text-sm">.md</code>, or bookmark this page.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Clean audio means cleaner auto-transcripts and better SEO drafts. Five minutes of preflight saves an hour of
          post-production. Pair this with our{" "}
          <Link href="/guides/show-notes-template" className="text-primary underline-offset-4 hover:underline">
            show notes template
          </Link>{" "}
          if you capture outline fields before you record.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 print-hide">
          <SavePdfButton />
          <Button variant="secondary" asChild>
            <a href={CHECKLIST_MD_PATH} download="pre-flight-checklist.md">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Download .md
            </a>
          </Button>
        </div>

        <Card className="mt-10 border-border/80 print:border-0 print:shadow-none">
          <CardContent className="space-y-10 p-8">
            {sections.map((sec) => (
              <section key={sec.title}>
                <h2 className="text-lg font-semibold text-foreground">{sec.title}</h2>
                <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
                  {sec.items.map((item) => (
                    <li key={item.label} className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span>
                        <strong className="text-foreground">{item.label}</strong>
                        {" — "}
                        {item.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </CardContent>
        </Card>

        <section className="mt-12 space-y-4 print-hide">
          <h2 className="text-lg font-semibold text-foreground">Common questions</h2>
          {faq.map((item) => (
            <div key={item.q}>
              <p className="text-sm font-semibold text-foreground">{item.q}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </section>

        <Card className="mt-12 border-primary/25 bg-secondary/40 print-hide">
          <CardContent className="space-y-4 p-8">
            <p className="text-lg font-semibold text-foreground">
              Get more resources like this — one email per week →
            </p>
            <SubscribeForm
              source="preflight_checklist"
              submitLabel="Send me the briefing"
              layout="stack"
              finePrint="Weekly AI tools for podcasters. Unsubscribe anytime."
            />
          </CardContent>
        </Card>

        <Card className="mt-10 border-primary/25 bg-primary/5 print-hide">
          <CardContent className="space-y-4 p-8">
            <p className="text-lg font-semibold text-foreground">Recorded clean? Turn the episode into SEO content</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Paste a transcript or show notes into the{" "}
              <Link href="/tools/seo-growth-pack" className="text-primary underline-offset-4 hover:underline">
                free SEO growth pack
              </Link>
              — get a blog draft, FAQ blocks, social scripts, and a 7-day publish plan. Full workflow:{" "}
              <Link href="/guides/podcast-to-blog-post" className="text-primary underline-offset-4 hover:underline">
                podcast → blog post guide
              </Link>
              .
            </p>
            <Button size="lg" asChild>
              <Link href="/tools/seo-growth-pack">Generate free SEO growth pack</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
