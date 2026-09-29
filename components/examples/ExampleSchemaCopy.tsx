"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faqJsonLd } from "@/lib/faq-schema";
import { personsJsonLd, type CitableEpisode } from "@/lib/citable-episode";
import { episodeSeoJsonLd } from "@/lib/episode-schema";

type FaqItem = { q: string; a: string };

type Props = {
  title: string;
  summary: string;
  faq: FaqItem[];
  citable?: CitableEpisode;
};

/** Demo-only schema copy blocks for the public sample page (no live generation needed). */
export function ExampleSchemaCopy({ title, summary, faq, citable }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const personSchema = useMemo(
    () => personsJsonLd(citable?.entities ?? []),
    [citable?.entities],
  );
  const faqSchema = useMemo(() => faqJsonLd(title, faq), [title, faq]);
  const episodeSchema = useMemo(
    () =>
      episodeSeoJsonLd({
        title,
        summary,
        faq,
        entities: citable?.entities,
        authorName: citable?.entities.find((e) => e.kind === "host")?.name,
      }),
    [title, summary, faq, citable],
  );

  const copy = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(label);
      window.setTimeout(() => setToast(null), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Example · Publish schema</p>
          <p className="mt-1 text-sm text-muted-foreground">
            These Copy buttons are on the sample page so you can test without generating. After a real pack succeeds,
            the same controls appear on the results page under AI-citable extras / Publish schema.
          </p>
        </div>

        <SchemaBlock
          title="Person JSON-LD"
          schema={personSchema}
          label="Person schema"
          toast={toast}
          onCopy={copy}
        />
        <SchemaBlock title="FAQ JSON-LD" schema={faqSchema} label="FAQ schema" toast={toast} onCopy={copy} />
        <SchemaBlock
          title="BlogPosting + PodcastEpisode + Person + FAQ"
          schema={episodeSchema}
          label="Episode schema"
          toast={toast}
          onCopy={copy}
        />
      </CardContent>
    </Card>
  );
}

function SchemaBlock({
  title,
  schema,
  label,
  toast,
  onCopy,
}: {
  title: string;
  schema: string;
  label: string;
  toast: string | null;
  onCopy: (text: string, label: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">{title}</p>
        <Button size="sm" variant="secondary" onClick={() => onCopy(schema, label)}>
          <Copy className="mr-2 h-4 w-4" />
          {toast === label ? "Copied" : `Copy ${label}`}
        </Button>
      </div>
      <pre className="max-h-36 overflow-auto rounded-md border border-border bg-background/60 p-3 text-[11px] text-muted-foreground">
        {schema}
      </pre>
    </div>
  );
}
