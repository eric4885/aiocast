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
  title: "Pre-flight checklist — recording guardrails",
  description:
    "Printable checklist for noise, gain staging, backups, and editing order — free from AioCast.com.",
  openGraph: {
    title: "Podcast pre-flight checklist",
    url: `${siteConfig.url}/resources/pre-flight-checklist`,
  },
};

const sections = [
  {
    title: "Before you hit record",
    items: [
      "Room noise under control - quiet space; mitigate HVAC/fans near the mic.",
      "One mic per voice - independent tracks for remote guests when possible.",
      "Gain staging - speech peaks roughly -12 to -6 dBFS with headroom.",
      "Closed-back headphones for guests to reduce bleed.",
    ],
  },
  {
    title: "During the session",
    items: [
      "Clap or slate at the top if merging separate recordings.",
      "Watch meters - fix clipping and ultra-low levels before you wrap.",
    ],
  },
  {
    title: "After recording",
    items: [
      "Back up to two locations before you edit.",
      "Listen through once before destructive cuts.",
      "Remove filler only after the story structure is set.",
    ],
  },
];

export default function PreFlightChecklistPage() {
  return (
    <div className="border-b border-border bg-background print:border-0">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-24 print:max-w-none print:py-8">
        <p className="text-sm font-semibold text-primary">Free resource</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Podcast pre-flight checklist
        </h1>
        <p className="mt-4 text-muted-foreground">
          Same checklist included in our weekly AI tools briefing — bookmark this page or save a copy for offline use.
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
                <h2 className="text-lg font-semibold text-foreground">
                  {sec.title}
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {sec.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </CardContent>
        </Card>

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

        <p className="mt-10 text-center text-sm text-muted-foreground print-hide">
          Want the growth pack?{" "}
          <Link href="/pro-toolkit" className="text-primary underline-offset-4 hover:underline">
            See Pro toolkit (preview)
          </Link>
          {" · "}
          <Link href="/tools/seo-growth-pack" className="text-primary underline-offset-4 hover:underline">
            Generate SEO pack
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
