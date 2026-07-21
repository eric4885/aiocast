"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const guides = [
  {
    href: "/resources/pre-flight-checklist",
    title: "Preflight recording checklist",
    description: "Printable checklist — room noise, gain staging, and backups before you hit Record.",
  },
  {
    href: "/examples/sample-growth-pack",
    title: "Sample growth pack output",
    description: "Full podcast to blog example — article, FAQ, social scripts, and publish plan.",
  },
  {
    href: "/guides/podcast-to-blog-post",
    title: "How to turn a podcast into a blog post",
    description: "Step-by-step podcast to blog post workflow — draft, on-page SEO, and publish.",
  },
  {
    href: "/guides/show-notes-template",
    title: "Show notes template",
    description: "Copy-paste outline when you do not have a full transcript yet.",
  },
  {
    href: "/tools/show-notes-to-html",
    title: "Show notes → HTML converter",
    description: "Paste your outline — get WordPress-ready HTML without a CMS plugin.",
  },
  {
    href: "/guides/podcast-faq-for-seo",
    title: "FAQ blocks for SEO",
    description: "Structure Q&A pairs for snippets and AI answer engines — with JSON-LD tips.",
  },
] as const;

export function RelatedGuidesSection({ className }: { className?: string }) {
  return (
    <Card className={cn("border-border/80", className)}>
      <CardContent className="space-y-4 p-6 sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Related guides</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Turn this pack into published SEO content — workflow tips from AioCast.
          </p>
        </div>
        <ul className="space-y-3">
          {guides.map((guide) => (
            <li key={guide.href}>
              <Link
                href={guide.href}
                className="group block rounded-xl border border-border/70 bg-background/40 px-4 py-3 transition-colors hover:border-primary/35 hover:bg-background/60"
              >
                <p className="text-sm font-semibold text-foreground group-hover:text-primary">{guide.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{guide.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
