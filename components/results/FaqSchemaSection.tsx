"use client";

import { useCallback, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { faqJsonLd } from "@/lib/faq-schema";

type FaqItem = { q: string; a: string };

type Props = {
  articleTitle: string;
  faq: FaqItem[];
};

/** Free FAQ-only JSON-LD (also included in the Episode schema @graph above). */
export function FaqSchemaSection({ articleTitle, faq }: Props) {
  const [copied, setCopied] = useState(false);
  const schema = faqJsonLd(articleTitle, faq);

  const copySchema = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(schema);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [schema]);

  if (faq.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-background/40 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">FAQ JSON-LD (free)</p>
          <p className="mt-1 text-xs text-muted-foreground">
            FAQ-only block for your CMS. Prefer the full BlogPosting + PodcastEpisode + FAQ pack in the schema section
            above when publishing the episode page.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => void copySchema()}>
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copied" : "Copy FAQ schema"}
        </Button>
      </div>
      <pre className="max-h-40 overflow-auto rounded-md border border-border bg-background p-3 text-[11px] text-muted-foreground">
        {schema}
      </pre>
    </div>
  );
}
