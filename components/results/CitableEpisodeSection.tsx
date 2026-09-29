"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { personsJsonLd, type CitableEpisode } from "@/lib/citable-episode";

type Props = {
  citable: CitableEpisode;
  onCopy: (text: string, label: string) => void;
  copyToast?: string | null;
};

/** Lead quote + machine-readable entity cards + Person JSON-LD. */
export function CitableEpisodeSection({ citable, onCopy, copyToast }: Props) {
  const personSchema = personsJsonLd(citable.entities);

  return (
    <Card className="border-primary/25">
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">AI-citable extras</p>
          <p className="mt-1 text-lg font-semibold text-foreground">Lead quote + entity cards</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Structural difference vs a generic AI blog: a hard takeaway AI engines can lift, plus Person fields
            machines can parse. Edit names and credentials against your source before publishing.
          </p>
        </div>

        {citable.leadQuote ? (
          <blockquote className="rounded-lg border-l-4 border-primary/60 bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground">
            {citable.leadQuote}
          </blockquote>
        ) : (
          <p className="text-sm text-muted-foreground">No lead quote this run — add one before you publish.</p>
        )}

        {citable.entities.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {citable.entities.map((e) => (
              <div key={`${e.kind}-${e.name}`} className="rounded-lg border border-border bg-background/40 p-4 text-sm">
                <p className="font-semibold text-foreground">
                  {e.name}
                  {e.kind !== "other" ? (
                    <span className="ml-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {e.kind}
                    </span>
                  ) : null}
                </p>
                <dl className="mt-3 space-y-1.5 text-muted-foreground">
                  <div>
                    <dt className="inline font-medium text-foreground/80">Role: </dt>
                    <dd className="inline">{e.role || "—"}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground/80">Company: </dt>
                    <dd className="inline">{e.company || "—"}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground/80">Expertise: </dt>
                    <dd className="inline">{e.expertise || "—"}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-foreground/80">Past work: </dt>
                    <dd className="inline">{e.pastWork || "—"}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No named host/guest cards this run. Add Person fields from your notes before expecting AI attribution.
          </p>
        )}

        {citable.entities.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">Person JSON-LD</p>
              <Button size="sm" variant="secondary" onClick={() => onCopy(personSchema, "Person schema")}>
                <Copy className="mr-2 h-4 w-4" />
                {copyToast === "Person schema" ? "Copied" : "Copy Person schema"}
              </Button>
            </div>
            <pre className="max-h-40 overflow-auto rounded-md border border-border bg-background/60 p-3 text-[11px] text-muted-foreground">
              {personSchema}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
