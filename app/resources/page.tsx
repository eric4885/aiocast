import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ListChecks, Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Resources — guides & checklists",
  description: "Podcast SEO guides, show notes templates, and recording checklists from AioCast.",
  alternates: { canonical: `${siteConfig.url}/resources` },
};

const items = [
  {
    title: "Podcast to SEO blog post (5-step framework)",
    href: "/guides/podcast-to-blog-post",
    description: "Turn transcripts into SEO articles for Google and AI search — with real-world examples.",
    icon: FileText,
  },
  {
    title: "Podcast FAQ for SEO",
    href: "/guides/podcast-faq-for-seo",
    description: "Structure FAQ blocks for snippets and AI answer engines.",
    icon: FileText,
  },
  {
    title: "Show notes template",
    href: "/guides/show-notes-template",
    description: "Copy-paste template before you run the growth pack generator.",
    icon: FileText,
  },
  {
    title: "Pre-flight recording checklist",
    href: "/resources/pre-flight-checklist",
    description: "Printable guardrails for gain, noise, and backups before you hit record.",
    icon: Mic,
  },
  {
    title: "Sample growth pack output",
    href: "/examples/sample-growth-pack",
    description: "See a full SEO article, FAQ, and social scripts example.",
    icon: ListChecks,
  },
  {
    title: "7-day publish plan playbook",
    href: "/remote-recording-setup",
    description: "Timezone-aware cadence after your pack is generated.",
    icon: ListChecks,
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Resources</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Guides & checklists</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Free playbooks that feed into the{" "}
        <Link href="/tools/seo-growth-pack" className="text-primary underline-offset-4 hover:underline">
          SEO growth pack
        </Link>
        . Record with the checklist, generate with the tool, publish with the schedule.
      </p>

      <ul className="mt-10 space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Card className="transition-colors hover:border-primary/30">
                <CardContent className="flex gap-4 p-5 sm:items-start">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={item.href} className="font-semibold text-foreground hover:text-primary">
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Ready to generate?{" "}
        <Link href="/tools/seo-growth-pack" className="font-medium text-primary underline-offset-4 hover:underline">
          Open the growth pack tool →
        </Link>
      </p>
    </div>
  );
}
