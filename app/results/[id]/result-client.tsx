"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  articleNeedsDistinctRewrite,
  highlightsFromTranscript,
  srtFromTranscript,
  type TranscriptSourceType,
} from "@/lib/transcript-segments";
import { SrtDownloadSection } from "@/components/results/SrtDownloadSection";
import {
  articleExportFilename,
  articleForClipboard,
  articleToHtml,
  articleToMarkdown,
} from "@/lib/article-export";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { FaqSchemaSection } from "@/components/results/FaqSchemaSection";
import { PublishWorkflowCard } from "@/components/results/PublishWorkflowCard";
import { ProUpsellCard } from "@/components/pricing/ProUpsellCard";
import { RelatedGuidesSection } from "@/components/seo/RelatedGuidesSection";

const TOOL_HREF = "/tools/seo-growth-pack";

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
    generationSource?: "ai" | "template";
    aiFailureReason?: string;
    transcript?: string;
    sourceType?: TranscriptSourceType;
    articleEchoesSource?: boolean;
    transcriptTranslated?: boolean;
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
    generationSource:
      raw.generationSource === "ai" || raw.generationSource === "template"
        ? raw.generationSource
        : undefined,
    aiFailureReason: asString(raw.aiFailureReason) || undefined,
    transcript: asString(raw.transcript) || undefined,
    sourceType:
      raw.sourceType === "audio" || raw.sourceType === "transcript" || raw.sourceType === "url"
        ? raw.sourceType
        : "transcript",
    articleEchoesSource: raw.articleEchoesSource === true ? true : undefined,
    transcriptTranslated: raw.transcriptTranslated === true ? true : undefined,
  };
}

function downloadTextFile(content: string, filename: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([`\uFEFF${content}`], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function PublishChecklist() {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <p className="font-semibold">Publish checklist</p>
        <p className="text-sm text-muted-foreground">
          Review and edit every draft before going live. Use the copy and download buttons above for each asset.
        </p>
        <div className="space-y-4 text-sm">
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold">WordPress / blog CMS</p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground">
              <li>Download Markdown or copy the full article into your block editor.</li>
              <li>Paste the meta description into Yoast, Rank Math, or your SEO plugin.</li>
              <li>Add FAQ blocks as an accordion section or a dedicated FAQ page.</li>
              <li>Set a featured image and internal links before publishing.</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold">Substack</p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground">
              <li>Paste the article as a newsletter post; trim headings if it feels long for email.</li>
              <li>Use the Substack script for Notes or a short teaser above the fold.</li>
              <li>Schedule using the 7-day plan as a rough guide, not autopilot.</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold">LinkedIn &amp; X</p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-muted-foreground">
              <li>Copy the LinkedIn script first — it is written for a professional tone.</li>
              <li>Post the X thread or single post when your blog URL is live.</li>
              <li>Pair clips with the SRT file in your editor (VLC or Descript) for captioned video.</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SocialBlock({
  label,
  text,
  onCopy,
  copied,
}: {
  label: string;
  text: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{label}</p>
        <Button size="sm" variant="secondary" onClick={onCopy}>
          {copied ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{text || "—"}</p>
    </div>
  );
}

export function ResultClient({ id, token }: { id: string; token: string | null }) {
  const [job, setJob] = useState<JobPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [articleExpanded, setArticleExpanded] = useState(false);
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  const [backupEmail, setBackupEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

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

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyToast(label);
      window.setTimeout(() => setCopyToast(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const sendBackupEmail = async () => {
    if (!token || !backupEmail.trim()) return;
    setEmailSending(true);
    setEmailError(null);
    try {
      const res = await fetch("/api/send-pack-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token, email: backupEmail.trim() }),
      });
      const payload = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !payload.ok) {
        setEmailError(payload.error ?? "Could not send email.");
        return;
      }
      setEmailSent(true);
      trackEvent(AnalyticsEvents.packEmailBackup);
    } catch {
      setEmailError("Could not send email. Try again.");
    } finally {
      setEmailSending(false);
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
              <Link href={TOOL_HREF}>Generate a new pack</Link>
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
          <CardContent className="space-y-4 p-8">
            <p className="font-semibold text-rose-300">Generation failed.</p>
            <p className="text-sm text-muted-foreground">{job.error ?? "Unknown error"}</p>
            <Button asChild>
              <Link href={TOOL_HREF}>Try again</Link>
            </Button>
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
            <p className="text-sm text-muted-foreground">Generate a new pack to get a fresh link.</p>
            <Button asChild>
              <Link href={TOOL_HREF}>Generate a new pack</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const articlePreview = pack.seoArticle.body.slice(0, 480);
  const articleTruncated = pack.seoArticle.body.length > 480;
  const wordCount = pack.seoArticle.body.trim().split(/\s+/).filter(Boolean).length;
  const isTemplate = pack.generationSource === "template";
  const isAi = pack.generationSource === "ai";
  const sourceType = pack.sourceType ?? "transcript";
  const liveSrt = pack.transcript ? srtFromTranscript(pack.transcript, sourceType) : pack.srt;
  const liveHighlights = pack.transcript
    ? highlightsFromTranscript(pack.transcript, sourceType)
    : pack.highlights;
  const echoesSource =
    pack.articleEchoesSource ??
    (pack.transcript ? articleNeedsDistinctRewrite(pack.seoArticle.body, pack.transcript) : false);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-14">
      {copyToast && (
        <p
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-100 shadow-lg"
          role="status"
        >
          {copyToast} copied
        </p>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Private link — review and edit before publishing. Do not share this URL publicly.
      </p>

      {isTemplate && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold">Template draft — AI did not run for this pack</p>
          <p className="mt-1 text-amber-100/90">
            Content below is a generic starter based on your input.
            {pack.aiFailureReason ? (
              <>
                {" "}
                <span className="font-medium">Reason:</span> {pack.aiFailureReason}
              </>
            ) : (
              <> Check Cloudflare OPENAI_ENABLED, OPENAI_API_KEY, and APImart balance, then generate again.</>
            )}
          </p>
        </div>
      )}

      {isAi && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-100">
          AI-generated draft — review facts and tone, then publish on your own site.
        </div>
      )}

      <PublishWorkflowCard />

      {!emailSent && token && (
        <Card className="border-primary/25 bg-primary/5">
          <CardContent className="space-y-3 p-6">
            <p className="font-semibold">Email backup for this pack (recommended)</p>
            <p className="text-sm text-muted-foreground">
              Your browser may lose this private URL. Send a backup to your inbox and use{" "}
              <Link href="/my-packs" className="text-primary underline-offset-4 hover:underline">
                Find my packs
              </Link>{" "}
              later with the same email.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                value={backupEmail}
                onChange={(e) => setBackupEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="flex-1"
              />
              <Button
                variant="secondary"
                disabled={!backupEmail.trim() || emailSending}
                onClick={() => void sendBackupEmail()}
              >
                {emailSending ? "Sending…" : "Email backup link"}
              </Button>
            </div>
            {emailError && (
              <p className="text-sm text-rose-300" role="alert">
                {emailError}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {emailSent && (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-100">
          Backup link sent — check your inbox. You can also recover packs anytime at{" "}
          <Link href="/my-packs" className="font-medium underline underline-offset-2">
            Find my packs
          </Link>
          .
        </p>
      )}

      <ProUpsellCard email={backupEmail} variant="compact" />

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">SEO article draft</p>
              <p className="mt-1 text-xs text-muted-foreground">
                AI-rewritten blog post for search — not your raw show notes. ~{wordCount.toLocaleString()}{" "}
                words · aim for 800–1,500 for a solid SEO post. Copy/Download use Markdown or HTML (includes optional
                AioCast attribution — remove before publishing if you prefer).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => void copy(articleForClipboard(pack.seoArticle), "Article")}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy full article
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  downloadTextFile(
                    articleToMarkdown(pack.seoArticle, pack.faq),
                    articleExportFilename(id, "md"),
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" /> Download Markdown
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  downloadTextFile(
                    articleToHtml(pack.seoArticle, pack.faq),
                    articleExportFilename(id, "html"),
                    "text/html;charset=utf-8",
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" /> Download HTML
              </Button>
            </div>
          </div>
          {echoesSource && (
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              This draft still looks close to your transcript outline. We tried an automatic rewrite — please edit
              section titles and add search-specific detail before publishing.
            </p>
          )}
          <p className="text-sm font-medium">{pack.seoArticle.title}</p>
          <p className="text-sm text-muted-foreground">{pack.seoArticle.metaDescription}</p>
          {pack.seoArticle.keywords.length > 0 && (
            <p className="text-xs text-muted-foreground">Keywords: {pack.seoArticle.keywords.join(", ")}</p>
          )}
          <div
            className={cn(
              "rounded-lg border border-border bg-background/40 p-4 text-sm text-muted-foreground",
              !articleExpanded && articleTruncated && "max-h-48 overflow-hidden",
            )}
          >
            <p className="whitespace-pre-wrap">{articleExpanded ? pack.seoArticle.body : articlePreview}</p>
          </div>
          {articleTruncated && (
            <button
              type="button"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              onClick={() => setArticleExpanded((v) => !v)}
            >
              {articleExpanded ? "Show less" : "Show full article"}
            </button>
          )}
        </CardContent>
      </Card>

      {pack.transcript && (
        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">Your source transcript</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {pack.transcriptTranslated
                    ? "Translated to English from your submission — SRT and highlights use this version."
                    : "The text used for SRT and highlights (matches what you submitted)."}
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => void copy(pack.transcript!, "Transcript")}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy transcript
              </Button>
            </div>
            <div
              className={cn(
                "rounded-lg border border-border bg-background/40 p-4 text-sm text-muted-foreground",
                !transcriptExpanded && pack.transcript.length > 480 && "max-h-48 overflow-hidden",
              )}
            >
              <p className="whitespace-pre-wrap">
                {transcriptExpanded || pack.transcript.length <= 480
                  ? pack.transcript
                  : `${pack.transcript.slice(0, 480)}…`}
              </p>
            </div>
            {pack.transcript.length > 480 && (
              <button
                type="button"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => setTranscriptExpanded((v) => !v)}
              >
                {transcriptExpanded ? "Show less" : "Show full transcript"}
              </button>
            )}
          </CardContent>
        </Card>
      )}

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
            <FaqSchemaSection articleTitle={pack.seoArticle.title} faq={pack.faq} defaultEmail={backupEmail} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="font-semibold">Social scripts</p>
          <div className="grid gap-3 lg:grid-cols-1">
            <SocialBlock
              label="X"
              text={pack.socialPack.x}
              copied={copyToast === "X"}
              onCopy={() => void copy(pack.socialPack.x, "X")}
            />
            <SocialBlock
              label="LinkedIn"
              text={pack.socialPack.linkedIn}
              copied={copyToast === "LinkedIn"}
              onCopy={() => void copy(pack.socialPack.linkedIn, "LinkedIn")}
            />
            <SocialBlock
              label="Substack"
              text={pack.socialPack.substack}
              copied={copyToast === "Substack"}
              onCopy={() => void copy(pack.socialPack.substack, "Substack")}
            />
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
          <SrtDownloadSection
            liveSrt={liveSrt}
            packId={id}
            liveHighlights={liveHighlights}
            onCopy={(text, label) => void copy(text, label)}
            copyToast={copyToast}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-6">
          <p className="font-semibold">SEO report</p>
          <p className="text-sm text-muted-foreground">Target keyword: {pack.seoReport.targetKeyword}</p>
          {pack.seoReport.altTitle && (
            <p className="text-sm text-muted-foreground">Alt title: {pack.seoReport.altTitle}</p>
          )}
          {pack.seoReport.estimatedTrafficHint && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground/85">Editorial angle hint:</span>{" "}
              {pack.seoReport.estimatedTrafficHint}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Editorial hints only — not live search volume, ranking, or competitor data.
          </p>
        </CardContent>
      </Card>

      <PublishChecklist />

      <RelatedGuidesSection />

      <div className="flex flex-col items-center gap-3 pb-8 sm:flex-row sm:justify-center">
        <Button size="lg" asChild>
          <Link href="/pro-toolkit">See Pro pricing</Link>
        </Button>
        <Button size="lg" variant="secondary" asChild>
          <Link href={TOOL_HREF}>Generate another pack</Link>
        </Button>
      </div>
    </div>
  );
}
