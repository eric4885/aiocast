"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    id: "title-keyword",
    label: "Title includes your main keyword",
    detail:
      "Use a searchable problem or outcome — not “Ep.47 with Guest Name.” Aim for under ~60 characters when you can.",
  },
  {
    id: "canonical",
    label: "Canonical URL points to your published page",
    detail:
      "In your CMS, set the canonical (or “original URL”) to the live post on your domain so search engines know which URL to index.",
  },
  {
    id: "faq-schema",
    label: "FAQ pasted on the page (+ schema if you have Pro)",
    detail:
      "Add the FAQ section to the article body. Pro users can copy FAQ JSON-LD from this results page and paste it into your CMS / head tag.",
  },
  {
    id: "sitemap",
    label: "New URL is in your sitemap (or auto-discovered)",
    detail:
      "Confirm the post appears in your sitemap.xml, or request indexing in Google Search Console after publish.",
  },
  {
    id: "no-ep-only",
    label: "Avoid episode-number-only headlines",
    detail:
      "Keep show codes in the intro if you want — the title tag and H1 should still name who it is for and what problem it solves.",
  },
] as const;

type Props = {
  /** Persist checks per pack in this browser */
  packId?: string;
};

export function PublishChecklist({ packId }: Props) {
  const storageKey = useMemo(
    () => (packId ? `aiocast_publish_checklist_${packId}` : "aiocast_publish_checklist_anon"),
    [packId],
  );
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        if (parsed && typeof parsed === "object") setChecked(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked, hydrated, storageKey]);

  const doneCount = ITEMS.filter((item) => checked[item.id]).length;
  const total = ITEMS.length;
  const progress = Math.round((doneCount / total) * 100);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card className="border-border bg-card/80">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Before you hit publish</p>
            <p className="mt-1 text-lg font-semibold text-foreground">Publish checklist</p>
            <p className="mt-2 text-sm text-muted-foreground">
              ChatGPT can rewrite text — this list is what makes the draft actually indexable on{" "}
              <strong className="text-foreground">your domain</strong>. Tick items as you go; progress stays in this
              browser so you can screenshot a full check.
            </p>
          </div>
          <Button type="button" variant="ghost" size="sm" className="shrink-0 self-start" onClick={() => setChecked({})}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {doneCount}/{total} complete
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ul className="space-y-3">
          {ITEMS.map((item) => {
            const isOn = Boolean(checked[item.id]);
            return (
              <li key={item.id}>
                <label
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-xl border px-3 py-3 transition-colors",
                    isOn
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/70 bg-background/40 hover:border-primary/25",
                  )}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-primary"
                    checked={isOn}
                    onChange={() => toggle(item.id)}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.detail}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <p className="text-sm text-muted-foreground">
          Longer walkthrough:{" "}
          <Link
            href="/resources/podcast-to-blog-seo-checklist"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            full SEO checklist
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
