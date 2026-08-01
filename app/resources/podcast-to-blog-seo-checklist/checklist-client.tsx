"use client";

import { useMemo, useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ChecklistItem = {
  id: string;
  label: string;
  detail: string;
};

export type ChecklistSection = {
  title: string;
  items: ChecklistItem[];
};

export function InteractiveSeoChecklist({ sections }: { sections: ChecklistSection[] }) {
  const allIds = useMemo(() => sections.flatMap((s) => s.items.map((i) => i.id)), [sections]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const doneCount = allIds.filter((id) => checked[id]).length;
  const total = allIds.length;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = () => setChecked({});

  const toMarkdown = () => {
    const lines = ["# Podcast to blog SEO checklist", ""];
    for (const section of sections) {
      lines.push(`## ${section.title}`, "");
      for (const item of section.items) {
        const mark = checked[item.id] ? "x" : " ";
        lines.push(`- [${mark}] ${item.label}`);
        lines.push(`  ${item.detail}`);
      }
      lines.push("");
    }
    lines.push("Generated with AioCast — https://aiocast.com/resources/podcast-to-blog-seo-checklist");
    return lines.join("\n");
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-5 sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Interactive checklist</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check items as you publish — progress saved in this browser tab only. No signup.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={copyMarkdown}>
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            {copied ? "Copied" : "Copy Markdown"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {doneCount}/{total} complete
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-background/80">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
            <ul className="mt-3 space-y-3">
              {section.items.map((item) => {
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
          </section>
        ))}
      </div>
    </div>
  );
}
