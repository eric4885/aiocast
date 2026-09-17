"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  showNotesToMarkdown,
  validateShowNotesAgainstSource,
  type ShowNotesClean,
} from "@/lib/show-notes-clean";
import {
  BLURB_PRESETS,
  CharTruncationPreview,
  META_PRESET,
  TITLE_PRESETS,
} from "@/components/results/CharTruncationPreview";

type Props = {
  notes: ShowNotesClean;
  sourceText: string;
  /** Episode / article title for platform truncation preview. */
  episodeTitle?: string;
  /** Website meta description for ≤155 preview. */
  metaDescription?: string;
  onCopy: (text: string, label: string) => void;
  copyToast?: string | null;
};

const flagStyles: Record<string, string> = {
  yellow: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  gray: "border-border bg-secondary/60 text-muted-foreground",
  blue: "border-sky-500/40 bg-sky-500/10 text-sky-100",
  red: "border-rose-500/40 bg-rose-500/10 text-rose-100",
};

export function ShowNotesCleanSection({
  notes,
  sourceText,
  episodeTitle = "",
  metaDescription = "",
  onCopy,
  copyToast,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const flags = useMemo(
    () => validateShowNotesAgainstSource(notes, sourceText),
    [notes, sourceText],
  );
  const md = useMemo(() => showNotesToMarkdown(notes), [notes]);

  return (
    <Card className="border-primary/20 bg-card/80">
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Show notes clean</p>
            <p className="mt-1 text-lg font-semibold text-foreground">Structured episode notes</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Summary, chapters, resources, quotes, and Apple / Spotify / website blurbs — grounded in your paste.
              Character bars below show where titles and blurbs get cut in platform UIs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => onCopy(md, "Show notes")}>
              <Copy className="mr-2 h-4 w-4" />
              {copyToast === "Show notes" ? "Copied" : "Copy Markdown"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>

        {flags.length > 0 && (
          <ul className="space-y-2">
            {flags.map((flag, index) => (
              <li
                key={`${flag.level}-${index}`}
                className={cn("rounded-lg border px-3 py-2 text-xs leading-relaxed", flagStyles[flag.level])}
              >
                {flag.message}
              </li>
            ))}
          </ul>
        )}

        {expanded && (
          <div className="space-y-5 text-sm">
            {(episodeTitle || metaDescription) && (
              <section className="space-y-3 rounded-lg border border-border/70 p-3">
                <p className="font-semibold text-foreground">Title &amp; meta truncation</p>
                {episodeTitle ? (
                  <div>
                    <p className="text-sm text-foreground">{episodeTitle}</p>
                    <CharTruncationPreview text={episodeTitle} preset={TITLE_PRESETS.apple} />
                    <CharTruncationPreview text={episodeTitle} preset={TITLE_PRESETS.spotify} />
                    <CharTruncationPreview text={episodeTitle} preset={TITLE_PRESETS.youtube} />
                  </div>
                ) : null}
                {metaDescription ? (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">{metaDescription}</p>
                    <CharTruncationPreview text={metaDescription} preset={META_PRESET} />
                  </div>
                ) : null}
              </section>
            )}

            <section>
              <p className="font-semibold text-foreground">Summary</p>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{notes.summary}</p>
            </section>

            <section>
              <p className="font-semibold text-foreground">Chapters</p>
              <ul className="mt-2 space-y-2">
                {notes.chapters.map((c, index) => (
                  <li key={`${c.title}-${index}`} className="rounded-lg border border-border/70 p-3">
                    <p className="font-medium text-foreground">
                      {c.timestamp ? (
                        <span className="mr-2 font-mono text-xs text-primary">[{c.timestamp}]</span>
                      ) : (
                        <span className="mr-2 text-xs text-muted-foreground">(no timecode)</span>
                      )}
                      {c.title}
                    </p>
                    <p className="mt-1 text-muted-foreground">{c.summary}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="font-semibold text-foreground">Resources</p>
              <ul className="mt-2 space-y-2">
                {notes.resources.map((r, index) => (
                  <li key={`${r.name}-${index}`} className="rounded-lg border border-border/70 p-3">
                    <p className="font-medium text-foreground">
                      {r.name}{" "}
                      <span className="text-xs font-normal text-muted-foreground">[{r.kind}]</span>
                    </p>
                    {r.url ? (
                      <p className="mt-1 break-all text-xs text-primary">{r.url}</p>
                    ) : (
                      <p className="mt-1 text-xs text-amber-200/90">
                        {r.note || "Mentioned without a URL in source — add manually."}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {notes.quotes.length > 0 && (
              <section>
                <p className="font-semibold text-foreground">Quotes</p>
                <ul className="mt-2 space-y-2">
                  {notes.quotes.map((q, index) => (
                    <li key={`${q.text.slice(0, 24)}-${index}`} className="rounded-lg border border-border/70 p-3">
                      <p className="text-foreground">&ldquo;{q.text}&rdquo;</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        — {q.speaker}
                        {q.timestamp ? ` · ${q.timestamp}` : ""}
                        {q.condensed ? " · condensed" : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="grid gap-3 sm:grid-cols-1">
              <Blurb label="Apple (short)" text={notes.platformBlurbs.apple} preset={BLURB_PRESETS.apple} />
              <Blurb label="Spotify (medium)" text={notes.platformBlurbs.spotify} preset={BLURB_PRESETS.spotify} />
              <Blurb label="Website (long)" text={notes.platformBlurbs.website} preset={BLURB_PRESETS.website} />
            </section>

            {notes.suggestedQuestions && notes.suggestedQuestions.length > 0 && (
              <section>
                <p className="font-semibold text-foreground">Suggested FAQ questions (author to answer)</p>
                <ul className="mt-2 list-inside list-disc text-muted-foreground">
                  {notes.suggestedQuestions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Blurb({
  label,
  text,
  preset,
}: {
  label: string;
  text: string;
  preset: (typeof BLURB_PRESETS)[keyof typeof BLURB_PRESETS];
}) {
  return (
    <div className="rounded-lg border border-border/70 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{text}</p>
      <CharTruncationPreview text={text} preset={preset} />
    </div>
  );
}
