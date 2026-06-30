"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  showNotesToFullHtmlDocument,
  showNotesToPasteableHtml,
} from "@/lib/show-notes-to-html";

export function ShowNotesToHtmlClient() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState<"fragment" | "full" | null>(null);

  const pasteableHtml = useMemo(
    () => showNotesToPasteableHtml(title, notes),
    [title, notes],
  );
  const fullDocument = useMemo(
    () => showNotesToFullHtmlDocument(title, notes),
    [title, notes],
  );

  const copy = async (text: string, kind: "fragment" | "full") => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-16 sm:px-6">
      <Card className="border-border/80">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <div>
            <label htmlFor="show-notes-title" className="text-sm font-semibold text-foreground">
              Episode title (optional)
            </label>
            <Input
              id="show-notes-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="How to set up a remote podcast studio on a budget"
              className="mt-2"
            />
          </div>
          <div>
            <label htmlFor="show-notes-body" className="text-sm font-semibold text-foreground">
              Show notes or outline
            </label>
            <p className="mt-1 text-xs text-muted-foreground">
              Paste plain text or simple Markdown — ## headings and bullet lists supported.
            </p>
            <textarea
              id="show-notes-body"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              placeholder={`## Hook\nIndie hosts can record interview-quality audio for under $200.\n\n- Treat the room before you upgrade the mic\n- Aim for -12 to -6 dBFS on speech`}
              className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </div>
        </CardContent>
      </Card>

      {pasteableHtml ? (
        <Card className="border-primary/25">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-semibold text-foreground">HTML preview (paste into WordPress / Ghost)</p>
            <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-secondary/40 p-3 text-xs text-foreground/90 whitespace-pre-wrap break-all">
              {pasteableHtml}
            </pre>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                className="min-h-11"
                onClick={() => void copy(pasteableHtml, "fragment")}
              >
                {copied === "fragment" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Copy HTML block
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="min-h-11"
                onClick={() => void copy(fullDocument, "full")}
              >
                {copied === "full" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Copy full .html
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-sm text-muted-foreground">Paste show notes above to generate HTML.</p>
      )}

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="space-y-3 p-6 text-center sm:text-left">
          <p className="text-sm font-semibold text-foreground">Need the full SEO pack?</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This converter formats show notes for your site. For a ~900–1,300 word SEO article draft, FAQ blocks, and
            social scripts, paste your transcript on AioCast.
          </p>
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/tools/seo-growth-pack#pack-transcript-only">Generate SEO growth pack</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
