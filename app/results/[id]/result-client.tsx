"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type JobPayload = {
  id: string;
  status: "processing" | "done" | "failed";
  error?: string;
  pack?: {
    seoArticle: { title: string; metaDescription: string; keywords: string[]; body: string };
    faq: Array<{ q: string; a: string }>;
    socialPack: { x: string; linkedIn: string; substack: string };
    localSchedule: string[];
    srt: string;
    highlights: Array<{ title: string; start: string; end: string; note: string }>;
    seoReport: {
      targetKeyword: string;
      altTitle: string;
      altDescription: string;
      estimatedTrafficHint: string;
    };
  };
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizePack(raw: JobPayload["pack"]): JobPayload["pack"] | null {
  if (!raw || typeof raw !== "object") return null;

  const seoArticle = raw.seoArticle;
  if (!seoArticle || typeof seoArticle !== "object") return null;

  const socialPack = raw.socialPack;
  const seoReport =
    raw.seoReport && typeof raw.seoReport === "object" && !Array.isArray(raw.seoReport)
      ? raw.seoReport
      : {
          targetKeyword: "podcast seo workflow",
          altTitle: "",
          altDescription: "",
          estimatedTrafficHint: "",
        };

  return {
    seoArticle: {
      title: asString(seoArticle.title, "Your SEO article draft"),
      metaDescription: asString(seoArticle.metaDescription),
      keywords: Array.isArray(seoArticle.keywords)
        ? seoArticle.keywords.map((k) => asString(k)).filter(Boolean)
        : [],
      body: asString(seoArticle.body),
    },
    faq: Array.isArray(raw.faq)
      ? raw.faq
          .map((item, index) => {
            if (!item || typeof item !== "object") return null;
            const row = item as Record<string, unknown>;
            const q = asString(row.q ?? row.question, `Question ${index + 1}`);
            const a = asString(row.a ?? row.answer);
            return q ? { q, a } : null;
          })
          .filter((item): item is { q: string; a: string } => item !== null)
      : [],
    socialPack: {
      x: asString(socialPack?.x, ""),
      linkedIn: asString(socialPack?.linkedIn, ""),
      substack: asString(socialPack?.substack, ""),
    },
    localSchedule: Array.isArray(raw.localSchedule)
      ? raw.localSchedule.map((line) => asString(line)).filter(Boolean)
      : [],
    srt: asString(raw.srt),
    highlights: Array.isArray(raw.highlights)
      ? raw.highlights
          .map((item, index) => {
            if (!item || typeof item !== "object") return null;
            const row = item as Record<string, unknown>;
            return {
              title: asString(row.title, `Highlight ${index + 1}`),
              start: asString(row.start, "00:00:00"),
              end: asString(row.end, "00:00:30"),
              note: asString(row.note),
            };
          })
          .filter((item): item is { title: string; start: string; end: string; note: string } => item !== null)
      : [],
    seoReport: {
      targetKeyword: asString(seoReport.targetKeyword, "podcast seo workflow"),
      altTitle: asString(seoReport.altTitle),
      altDescription: asString(seoReport.altDescription),
      estimatedTrafficHint: asString(seoReport.estimatedTrafficHint),
    },
  };
}

export function ResultClient({ id, token }: { id: string; token: string | null }) {
  const [job, setJob] = useState<JobPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoadError("This result link is missing its access token. Use the link from your email.");
      return;
    }

    let timer: number | null = null;
    let cancelled = false;

    const load = async () => {
      try {
        const qs = new URLSearchParams({ id, token });
        const res = await fetch(`/api/generate-pack?${qs.toString()}`);
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(
            res.status === 401 || res.status === 404
              ? "This link is invalid or has expired. Request a new pack from the tool page."
              : "Could not load your pack. Try again from the email link.",
          );
          return;
        }
        const data = (await res.json()) as { job: JobPayload };
        setJob(data.job);
        setLoadError(null);
        if (data.job.status === "processing") {
          timer = window.setTimeout(load, 1500);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Could not load your pack. Check your connection and try the email link again.");
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [id, token]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  const downloadSrt = () => {
    const srt = job?.pack?.srt;
    if (!srt) return;
    const blob = new Blob([srt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `aiocast-${id}.srt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loadError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Card>
          <CardContent className="space-y-4 p-8 text-center">
            <p className="font-semibold text-rose-300">Unable to open pack</p>
            <p className="text-sm text-muted-foreground">{loadError}</p>
            <Button asChild>
              <Link href="/tools/audio-quality-checker">Generate a new pack</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job || job.status === "processing") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-3xl" aria-hidden>
              🎁
            </p>
            <p className="mt-2 font-semibold">Opening your growth pack...</p>
            <p className="mt-1 text-sm text-muted-foreground">Generating article, FAQ, scripts, and SRT.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (job.status === "failed") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Card>
          <CardContent className="p-8">
            <p className="font-semibold text-rose-300">Generation failed.</p>
            <p className="mt-2 text-sm text-muted-foreground">{job.error ?? "Unknown error"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pack = normalizePack(job.pack);
  if (!pack) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Card>
          <CardContent className="space-y-4 p-8 text-center">
            <p className="font-semibold text-rose-300">Pack data looks incomplete</p>
            <p className="text-sm text-muted-foreground">Generate a new pack and we will email you a fresh link.</p>
            <Button asChild>
              <Link href="/tools/audio-quality-checker">Generate a new pack</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-14">
      <p className="text-center text-xs text-muted-foreground">
        Private link — review and edit before publishing. Do not share this URL publicly.
      </p>

      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-semibold">SEO article draft</p>
          <p className="text-sm">{pack.seoArticle.title}</p>
          <p className="text-sm text-muted-foreground">{pack.seoArticle.metaDescription}</p>
          <Button size="sm" variant="secondary" onClick={() => copy(pack.seoArticle.body)}>
            <Copy className="mr-2 h-4 w-4" /> Copy article
          </Button>
        </CardContent>
      </Card>

      {pack.faq.length > 0 && (
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="font-semibold">FAQ blocks</p>
            {pack.faq.map((f, index) => (
              <div key={`${f.q}-${index}`} className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium">{f.q}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-semibold">Social script matrix</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="secondary" onClick={() => copy(pack.socialPack.x)}>
              <Copy className="mr-2 h-4 w-4" /> Copy X
            </Button>
            <Button variant="secondary" onClick={() => copy(pack.socialPack.linkedIn)}>
              <Copy className="mr-2 h-4 w-4" /> Copy LinkedIn
            </Button>
            <Button variant="secondary" onClick={() => copy(pack.socialPack.substack)}>
              <Copy className="mr-2 h-4 w-4" /> Copy Substack
            </Button>
          </div>
        </CardContent>
      </Card>

      {pack.localSchedule.length > 0 && (
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="font-semibold">7-day publish schedule</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {pack.localSchedule.map((line, index) => (
                <li key={`${line}-${index}`}>{line}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-semibold">SRT and highlights</p>
          {pack.srt ? (
            <Button variant="secondary" onClick={downloadSrt}>
              <Download className="mr-2 h-4 w-4" /> Download SRT
            </Button>
          ) : null}
          {pack.highlights.map((h, index) => (
            <p key={`${h.title}-${index}`} className="text-sm text-muted-foreground">
              {h.title}: {h.start}-{h.end} ({h.note})
            </p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-6">
          <p className="font-semibold">SEO report</p>
          <p className="text-sm text-muted-foreground">Target keyword: {pack.seoReport.targetKeyword}</p>
          <p className="text-sm text-muted-foreground">{pack.seoReport.estimatedTrafficHint}</p>
        </CardContent>
      </Card>

      <div className="pb-8 text-center">
        <Button size="lg" asChild>
          <Link href="/pro-toolkit">Explore Pro toolkit</Link>
        </Button>
      </div>
    </div>
  );
}
