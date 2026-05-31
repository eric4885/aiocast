"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

export function ResultClient({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
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
    };

    void load();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [id, token]);

  const srtHref = useMemo(() => {
    if (!job?.pack?.srt) return "#";
    return `data:text/plain;charset=utf-8,${encodeURIComponent(job.pack.srt)}`;
  }, [job?.pack?.srt]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
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

  if (job.status === "failed" || !job.pack) {
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

  const pack = job.pack;
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

      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-semibold">FAQ blocks</p>
          {pack.faq.map((f) => (
            <div key={f.q} className="rounded-lg border border-border p-3">
              <p className="text-sm font-medium">{f.q}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>

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

      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-semibold">7-day publish schedule</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {pack.localSchedule.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-semibold">SRT and highlights</p>
          <a href={srtHref} download={`aiocast-${id}.srt`}>
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4" /> Download SRT
            </Button>
          </a>
          {pack.highlights.map((h) => (
            <p key={h.title} className="text-sm text-muted-foreground">
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
