"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { episodeSeoJsonLd } from "@/lib/episode-schema";

type FaqItem = { q: string; a: string };

type Props = {
  title: string;
  summary: string;
  faq: FaqItem[];
  onCopy: (text: string, label: string) => void;
  copyToast?: string | null;
};

export function EpisodeSchemaSection({ title, summary, faq, onCopy, copyToast }: Props) {
  const [datePublished, setDatePublished] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [showName, setShowName] = useState("");

  const schema = useMemo(
    () =>
      episodeSeoJsonLd({
        title,
        summary,
        faq,
        datePublished: datePublished || undefined,
        authorName: authorName || undefined,
        canonicalUrl: canonicalUrl || undefined,
        duration: duration || undefined,
        showName: showName || undefined,
      }),
    [title, summary, faq, datePublished, authorName, canonicalUrl, duration, showName],
  );

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Publish schema</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              BlogPosting + PodcastEpisode + FAQ JSON-LD
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill only fields you know are true. Empty fields are omitted — we never invent duration or URLs.
              Paste the JSON-LD into your CMS or theme after you publish the episode page.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => onCopy(schema, "Episode schema")}>
            <Copy className="mr-2 h-4 w-4" />
            {copyToast === "Episode schema" ? "Copied" : "Copy JSON-LD"}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Publish date (ISO)" value={datePublished} onChange={setDatePublished} placeholder="2026-09-17" />
          <Field label="Host / author" value={authorName} onChange={setAuthorName} placeholder="Your name" />
          <Field
            label="Canonical URL"
            value={canonicalUrl}
            onChange={setCanonicalUrl}
            placeholder="https://yoursite.com/episodes/…"
          />
          <Field label="Duration (ISO-8601)" value={duration} onChange={setDuration} placeholder="PT45M" />
          <Field label="Show name" value={showName} onChange={setShowName} placeholder="Your podcast name" />
        </div>

        <pre className="max-h-56 overflow-auto rounded-md border border-border bg-background/60 p-3 text-[11px] text-muted-foreground">
          {schema}
        </pre>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
