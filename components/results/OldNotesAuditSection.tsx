"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { auditPastedNotes } from "@/lib/show-notes-clean";

type Props = {
  sourceText: string;
  episodeTitle?: string;
};

/** Lightweight audit of the pasted source — no RSS crawl. */
export function OldNotesAuditSection({ sourceText, episodeTitle }: Props) {
  const items = useMemo(
    () => auditPastedNotes(sourceText, episodeTitle),
    [sourceText, episodeTitle],
  );

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Old notes audit</p>
          <p className="mt-1 text-lg font-semibold text-foreground">Quick gaps in this paste</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Checks the text you submitted — not your live website. Fix high-priority gaps, then publish the pack on
            your domain.{" "}
            <Link
              href="/guides/podcast-show-notes-for-seo"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              How to write show notes for SEO
            </Link>
            .
          </p>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                "rounded-lg border px-3 py-2",
                item.ok ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5",
              )}
            >
              <p className="text-sm font-medium text-foreground">
                {item.ok ? "✓" : "!"} {item.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Repair order: richer transcript/notes → searchable title → FAQ + schema → internal links on your site.
        </p>
      </CardContent>
    </Card>
  );
}
