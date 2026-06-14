"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  Loader2,
  Rocket,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import type { SearchDemandLevel, TitleOptimizationResult } from "@/lib/title-optimization";
import type { RssPreviewOk } from "@/lib/rss-feed-preview";
import {
  API_TOPIC_ERROR_MESSAGE,
  isKeywordAnalyzeDisabled,
  showEnglishTopicHint,
} from "@/lib/topic-input";
import {
  combinedSEOClarityScore,
  styleLaneLabel,
} from "@/lib/title-heuristics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

/** RSS diagnosis hidden until audit is data-backed; /api/rss-preview kept for later. */
const HOME_RSS_UI_ENABLED = false;

function topicBreadthLabel(level: SearchDemandLevel): "Broad" | "Moderate" | "Narrow" {
  if (level === "High") return "Broad";
  if (level === "Low") return "Narrow";
  return "Moderate";
}

function topicBreadthHint(breadth: ReturnType<typeof topicBreadthLabel>): string {
  if (breadth === "Broad") {
    return "This phrase covers a wide theme — you can keep it open or narrow to one outcome in the title.";
  }
  if (breadth === "Narrow") {
    return "This phrase is fairly focused — you can stay specific or widen the hook if you prefer.";
  }
  return "This phrase sits in the middle — pick the title angle that matches how you want to frame the episode.";
}

function titleAuditLabel(score: number): string {
  if (score >= 72) return "Reads specific";
  if (score >= 48) return "Reads balanced";
  return "Reads broad";
}

export function HomePageClient() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");
  const [submittedTopic, setSubmittedTopic] = useState("");
  const [selectedTitle, setSelectedTitle] = useState(0);
  const [analysisMode, setAnalysisMode] = useState<"keyword" | "rss">("keyword");
  const [titleResult, setTitleResult] = useState<TitleOptimizationResult | null>(null);
  const [resultMeta, setResultMeta] = useState<{
    outputLanguage: "zh" | "en";
    mode: "auto" | "forced";
    warning?: string;
  } | null>(null);
  const [optimizeLoading, setOptimizeLoading] = useState(false);
  const [optimizeError, setOptimizeError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [regenLoading, setRegenLoading] = useState(false);
  const [rssLoading, setRssLoading] = useState(false);
  const [rssLivePreview, setRssLivePreview] = useState<(RssPreviewOk & { feedUrl?: string }) | null>(null);
  const [rssFetchError, setRssFetchError] = useState<string | null>(null);
  const [rssWaitEmail, setRssWaitEmail] = useState("");
  const [rssWaitHp, setRssWaitHp] = useState("");
  const [rssWaitStatus, setRssWaitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [rssWaitMsg, setRssWaitMsg] = useState<string | null>(null);

  const sortedVariants = useMemo(() => {
    if (!titleResult) return [];
    const topic = submittedTopic.trim();
    if (!topic) return [...titleResult.variants];
    return [...titleResult.variants].sort(
      (a, b) => combinedSEOClarityScore(b.title, topic) - combinedSEOClarityScore(a.title, topic),
    );
  }, [titleResult, submittedTopic]);

  const pickVariants = useMemo(() => sortedVariants.slice(0, 3), [sortedVariants]);

  const bestPickIndex = useMemo(() => {
    if (!pickVariants.length || !submittedTopic.trim()) return 0;
    let best = 0;
    let bestScore = -Infinity;
    pickVariants.forEach((v, i) => {
      const sc = combinedSEOClarityScore(v.title, submittedTopic);
      if (sc > bestScore) {
        bestScore = sc;
        best = i;
      }
    });
    return best;
  }, [pickVariants, submittedTopic]);

  useEffect(() => {
    if (!titleResult) return;
    setSelectedTitle(0);
  }, [titleResult]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "rss" && !HOME_RSS_UI_ENABLED) {
      setAnalysisMode("keyword");
      setOptimizeError(null);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("tab");
        if (!url.hash) url.hash = "analyze-tool";
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
      return;
    }
    if (tab === "rss" && HOME_RSS_UI_ENABLED) {
      setAnalysisMode("rss");
      setOptimizeError(null);
    } else if (tab === "keyword") {
      setAnalysisMode("keyword");
      setOptimizeError(null);
    }
  }, [searchParams]);

  const showOldTitleRisk = useMemo(() => {
    const t = submittedTopic.trim();
    if (/^https?:\/\//i.test(t)) return true;
    const words = t.split(/\s+/).filter(Boolean).length;
    return words >= 6;
  }, [submittedTopic]);

  const runKeywordAnalysis = async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setOptimizeError(null);
    setOptimizeLoading(true);
    trackEvent(AnalyticsEvents.titleIdeasSubmit);
    try {
      const res = await fetch("/api/title-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmed }),
      });
      const payload = (await res.json()) as {
        ok?: boolean;
        error?: string;
        data?: TitleOptimizationResult;
        meta?: {
          outputLanguage: "zh" | "en";
          mode: "auto" | "forced";
          normalizedTopic?: string;
          warning?: string;
        };
      };
      if (!res.ok || !payload.ok || !payload.data) {
        setOptimizeError(payload.error ?? "Analysis failed. Try again.");
        setTitleResult(null);
        setResultMeta(null);
        return;
      }
      setTitleResult(payload.data);
      setResultMeta(payload.meta ?? null);
      setSubmittedTopic(payload.meta?.normalizedTopic ?? trimmed);
      trackEvent(AnalyticsEvents.titleIdeasSuccess, {
        has_audit: Boolean(payload.data.titleAudit),
      });
      setCopied(false);
      setCopyToast(null);
    } catch {
      setOptimizeError("Network error. Check your connection and try again.");
      setTitleResult(null);
      setResultMeta(null);
    } finally {
      setOptimizeLoading(false);
    }
  };

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) return;

    if (analysisMode === "rss" && HOME_RSS_UI_ENABLED) {
      setRssFetchError(null);
      setRssLivePreview(null);
      setRssLoading(true);
      try {
        const res = await fetch("/api/rss-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: trimmed }),
        });
        const data = (await res.json()) as { ok?: boolean; error?: string } & Partial<RssPreviewOk>;
        if (data.ok === true && typeof data.score === "number") {
          setRssLivePreview(data as RssPreviewOk & { feedUrl?: string });
          setRssFetchError(null);
        } else {
          setRssLivePreview(null);
          setRssFetchError(typeof data.error === "string" ? data.error : "Could not load this feed.");
        }
      } catch {
        setRssLivePreview(null);
        setRssFetchError("Network error — check your connection and try again.");
      } finally {
        setRssLoading(false);
      }
      setSubmittedTopic(trimmed);
      return;
    }
    if (isKeywordAnalyzeDisabled(topic)) return;
    await runKeywordAnalysis(trimmed);
  };

  const handleRssWaitlist = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rssWaitHp.trim()) return;
    setRssWaitStatus("loading");
    setRssWaitMsg(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: rssWaitEmail.trim(),
          source: "rss_early_access",
          website: rssWaitHp,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setRssWaitStatus("error");
        setRssWaitMsg(data.error ?? "Something went wrong.");
        return;
      }
      setRssWaitStatus("success");
      setRssWaitEmail("");
      setRssWaitMsg(null);
    } catch {
      setRssWaitStatus("error");
      setRssWaitMsg("Network error — try again.");
    }
  };

  const submitAnalyzeDisabled =
    !HOME_RSS_UI_ENABLED || analysisMode === "keyword"
      ? optimizeLoading || isKeywordAnalyzeDisabled(topic)
      : rssLoading || !topic.trim();

  const handleModeTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!HOME_RSS_UI_ENABLED) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setAnalysisMode("rss");
      setOptimizeError(null);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setAnalysisMode("keyword");
      setOptimizeError(null);
    }
  };

  const pendingMsg = "Crafting title options for your topic — often a few seconds to a minute…";

  const selectedTitleText = pickVariants[selectedTitle]?.title ?? titleResult?.optimalTitle ?? "";

  const handleCopy = async () => {
    const full = selectedTitleText.trim();
    if (!full) return;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      const preview = full.length <= 20 ? full : `${full.slice(0, 20)}…`;
      setCopyToast(`Copied (${full.length} chars): ${preview}`);
      trackEvent(AnalyticsEvents.titleIdeasCopy);
      window.setTimeout(() => setCopyToast(null), 4500);
    } catch {
      setOptimizeError("Copy failed. Please copy manually.");
    }
  };

  const handleGenerateMore = async () => {
    if (!submittedTopic || regenLoading) return;
    setRegenLoading(true);
    setCopyToast(null);
    trackEvent(AnalyticsEvents.titleIdeasRegenerate);
    await runKeywordAnalysis(submittedTopic);
    setRegenLoading(false);
  };

  const displaySuggestedKeywords = useMemo(() => {
    if (!titleResult) return [];
    const k = titleResult.suggestedKeywords;
    return k.length > 0 ? k : [submittedTopic].filter(Boolean);
  }, [titleResult, submittedTopic]);

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-background bg-grid-subtle pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-7 lg:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Try an episode title or topic phrase below — then generate the full pack when you are ready.
          </p>

          <form id="analyze-tool" onSubmit={handleAnalyze} className="relative z-10 mx-auto mt-4 max-w-2xl sm:mt-6">
            <div className="rounded-2xl border border-border bg-card/90 p-3 shadow-lg shadow-black/20 ring-1 ring-border/80 sm:p-5">
              {HOME_RSS_UI_ENABLED && (
              <div
                className="mb-4 flex rounded-xl border border-border bg-secondary/80 p-1 shadow-inner"
                role="tablist"
                aria-label="Analysis mode"
                onKeyDown={handleModeTabKeyDown}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={analysisMode === "keyword"}
                  onClick={() => {
                    setAnalysisMode("keyword");
                    setOptimizeError(null);
                  }}
                  className={cn(
                    "min-h-[44px] flex-1 touch-manipulation rounded-lg px-2 py-2.5 text-center text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-3 sm:text-sm",
                    analysisMode === "keyword"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary/90 hover:text-foreground",
                  )}
                >
                  Keyword prediction
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={analysisMode === "rss"}
                  onClick={() => {
                    setAnalysisMode("rss");
                    setOptimizeError(null);
                  }}
                  className={cn(
                    "min-h-[44px] flex-1 touch-manipulation rounded-lg px-2 py-2.5 text-center text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-3 sm:text-sm",
                    analysisMode === "rss"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary/90 hover:text-foreground",
                  )}
                >
                  RSS diagnosis
                </button>
              </div>
              )}
              {(!HOME_RSS_UI_ENABLED || analysisMode === "keyword") && showEnglishTopicHint(topic) && (
                <p className="mb-3 text-center text-sm font-medium text-violet-300">
                  Please provide an English topic to start.
                </p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    HOME_RSS_UI_ENABLED && analysisMode === "rss"
                      ? "Your RSS URL"
                      : "e.g. Try an episode title or topic (optional)"
                  }
                  className="min-h-[48px] border-border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground sm:px-4 md:text-sm"
                  autoComplete={HOME_RSS_UI_ENABLED && analysisMode === "rss" ? "url" : "on"}
                  enterKeyHint="search"
                />
                <Button
                  type="submit"
                  className="h-12 min-h-[48px] w-full shrink-0 touch-manipulation px-7 shadow-md sm:h-11 sm:min-h-[44px] sm:w-auto sm:min-w-[148px]"
                  disabled={submitAnalyzeDisabled}
                >
                  {(!HOME_RSS_UI_ENABLED || analysisMode === "keyword") && optimizeLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Working…
                    </>
                  ) : HOME_RSS_UI_ENABLED && analysisMode === "rss" && rssLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching feed…
                    </>
                  ) : HOME_RSS_UI_ENABLED && analysisMode === "rss" ? (
                    "Analyze RSS"
                  ) : (
                    "Get title ideas"
                  )}
                </Button>
              </div>
            </div>
          </form>

          {optimizeError && analysisMode === "keyword" && (
            <div
              className={cn(
                "mx-auto mt-4 max-w-xl rounded-xl border px-4 py-3 text-left text-sm leading-relaxed shadow-sm",
                optimizeError === API_TOPIC_ERROR_MESSAGE || optimizeError.includes("English subject")
                  ? "border-orange-500/30 bg-orange-950/40 text-[hsl(265_48%_82%)]"
                  : "border-border bg-secondary/80 text-muted-foreground",
              )}
              role="alert"
            >
              {optimizeError}
            </div>
          )}

          <p className="mt-4 text-sm font-medium text-foreground/90">
            Every great podcast deserves to be heard.
          </p>
        </div>

        {analysisMode === "keyword" && optimizeLoading && (
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-border bg-card px-6 py-8 text-center shadow-inner">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" aria-hidden />
            <p className="mt-4 text-[15px] font-medium leading-relaxed text-foreground">{pendingMsg}</p>
            <div className="mx-auto mt-4 h-2.5 max-w-xs overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-full animate-pulse rounded-full bg-primary sm:bg-gradient-to-r sm:from-primary sm:to-accent" />
            </div>
          </div>
        )}

        {analysisMode === "keyword" && !optimizeLoading && titleResult && (
          <div className="mx-auto mt-8 max-w-4xl space-y-5 sm:mt-10">
            <div className="space-y-3 text-center">
              {resultMeta?.warning && (
                <p className="mx-auto max-w-xl rounded-lg border border-amber-500/35 bg-amber-950/35 px-3 py-2 text-center text-xs leading-relaxed text-amber-100/95">
                  {resultMeta.warning}
                </p>
              )}
              <p className="mt-2 break-words px-1 text-xl font-bold leading-snug tracking-tight sm:text-2xl">
                Title ideas for{" "}
                <span className="text-primary">&quot;{submittedTopic}&quot;</span>
              </p>
              <p className="mx-auto max-w-lg text-sm text-muted-foreground">
                Copy a title into your podcast host (Apple Podcasts, Spotify, etc.). For the article and social scripts,
                open{" "}
                <Link href="/tools/seo-growth-pack" className="font-medium text-primary underline-offset-4 hover:underline">
                  Generate SEO pack
                </Link>{" "}
                with your transcript or show notes — that&apos;s a separate step.
              </p>
            </div>

            <div className="space-y-6">
              {titleResult.titleAudit && (
                <Card className="rounded-2xl border border-violet-500/25 bg-card shadow-md shadow-black/10">
                  <CardContent className="space-y-4 p-6 text-left sm:p-8">
                    <p className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
                      <TrendingUp className="h-4 w-4 shrink-0 text-violet-400" />
                      Your current title
                    </p>
                    <span className="inline-flex rounded-full border border-border bg-secondary/80 px-3 py-1 text-sm font-semibold text-foreground/90">
                      {titleAuditLabel(titleResult.titleAudit.score)}
                    </span>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">{titleResult.titleAudit.headline}</p>
                    <div className="rounded-xl border border-border/80 bg-secondary/40 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        What we graded
                      </p>
                      <p className="mt-1 break-words text-sm text-foreground/95">
                        &quot;{titleResult.titleAudit.submittedPreview}&quot;
                      </p>
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-foreground">Ideas to try</p>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground">
                        {titleResult.titleAudit.improvements.map((line, idx) => (
                          <li key={`${idx}-${line.slice(0, 24)}`}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Rules-based check on your wording (length, hook, proof, generic words). Not a store ranking guarantee.
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="rounded-2xl border border-border bg-card">
                <CardContent className="space-y-4 p-6 sm:p-8">
                  <p className="flex items-start gap-2 text-base font-semibold leading-snug tracking-tight">
                    <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Topic direction &amp; keywords</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span
                      className="rounded-full border border-border bg-secondary/80 px-2 py-0.5 text-foreground/90"
                    >
                      Topic breadth: {topicBreadthLabel(titleResult.searchDemand.level).toLowerCase()}
                    </span>
                  </div>
                  <p className="break-words text-[15px] leading-relaxed text-muted-foreground">
                    {topicBreadthHint(topicBreadthLabel(titleResult.searchDemand.level))}
                  </p>
                  <div>
                    <p className="text-[15px] font-medium text-foreground">Suggested keywords</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-muted-foreground">
                      {displaySuggestedKeywords.map((kw) => (
                        <li key={kw}>{kw}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
                      Suggested phrases from your topic — optional starting points, not search-volume data.
                    </p>
                  </div>
                    <p className="flex items-center gap-2 pt-2 text-[15px] font-semibold">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {showOldTitleRisk ? "If you keep your current wording" : titleResult.titleAudit ? "Optional notes" : "Optional angles to try"}
                  </p>
                  {titleResult.titleAudit ? (
                    <ul className="space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                      <li>Cross-check suggested keywords above with how listeners phrase this topic in search.</li>
                      <li>If the topic is broad, narrow to one outcome per episode title.</li>
                      {!showOldTitleRisk && (
                        <li>Keep titles readable when truncated mid‑feed — front‑load the hook.</li>
                      )}
                      {showOldTitleRisk && (
                        <li>URLs or very long phrases hide your hook — shorten to one promise plus proof.</li>
                      )}
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-[15px] leading-relaxed text-muted-foreground">
                      <li>Consider searchable phrases listeners might type for this topic.</li>
                      <li>Try a clearer hook so the title earns a tap in the feed.</li>
                      <li>Optional: add a number, scene, or proof anchor if it fits your episode.</li>
                    </ul>
                  )}
                  <p className="pt-2 text-xs text-muted-foreground">
                    Model-based signals from your topic phrasing (estimate).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {HOME_RSS_UI_ENABLED && analysisMode === "rss" && (
          <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
            <p className="text-center text-xl font-bold leading-tight text-balance sm:text-3xl">
              Your Podcast Health Diagnosis
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Paste your RSS feed URL, then tap Analyze RSS for a live metadata preview.
            </p>
            <Card className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-md">
              <div className="border-b border-amber-600/50 bg-amber-400 px-4 py-3 text-left text-sm font-semibold leading-snug text-amber-950">
                {rssLivePreview ? (
                  <>
                    <span aria-hidden>📡 </span>
                    Live preview from your feed XML (heuristic score only — not Apple/Spotify internal ranking).
                  </>
                ) : (
                  <>
                    <span aria-hidden>👋 </span>
                    This is a sample report. Paste your RSS URL above and tap &quot;Analyze RSS&quot; for your real
                    preview score.
                  </>
                )}
              </div>
              <CardContent className="space-y-4 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border-2 border-amber-400 bg-amber-400/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950 shadow-sm">
                    {rssLivePreview ? "Live preview" : "Demo sample"}
                  </span>
                  {rssFetchError && (
                    <span className="text-xs font-medium text-rose-300">Feed fetch failed — details below</span>
                  )}
                </div>
                {rssLivePreview?.channelTitle && (
                  <p className="text-left text-sm text-muted-foreground">
                    Detected show title:{" "}
                    <strong className="text-foreground">&quot;{rssLivePreview.channelTitle}&quot;</strong>
                  </p>
                )}
                <div className="flex flex-wrap items-end gap-2">
                  <p className="text-4xl font-bold tabular-nums text-foreground sm:text-5xl">
                    {rssLivePreview?.score ?? 42}
                  </p>
                  <p className="pb-1 text-[15px] font-medium text-muted-foreground">/100 RSS SEO score (heuristic)</p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {rssLivePreview
                    ? `Based on ${rssLivePreview.itemCount} episode(s) seen in the feed snapshot, description length, and Apple-tags presence — not a guarantee of downloads.`
                    : "Illustrative benchmark only until we load your feed. Most podcasts land around 35–50 on this rubric."}
                </p>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-amber-500 sm:bg-gradient-to-r sm:from-rose-600 sm:via-amber-400 sm:to-emerald-500"
                    style={{
                      width: `${Math.min(100, Math.max(8, rssLivePreview?.score ?? 42))}%`,
                    }}
                  />
                </div>
                {rssFetchError && (
                  <p className="rounded-lg border border-rose-500/35 bg-rose-950/40 px-3 py-2 text-sm text-rose-100">
                    {rssFetchError}
                  </p>
                )}
                <p className="text-base font-semibold text-foreground">Quick wins</p>
                <ul className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                  {(rssLivePreview?.tips ?? [
                    "Titles: After we load your feed, suggestions will reference your actual episode titles.",
                    "Show notes: We’ll flag thin descriptions using your real channel text.",
                    "Chapters: Full RSS audits (early access) will score chapter markers per show.",
                  ]).map((line, idx) => (
                    <li key={`${idx}-${line.slice(0, 20)}`}>{line}</li>
                  ))}
                </ul>
                <div className="border-t border-border pt-4">
                  <p className="text-center text-sm font-semibold text-foreground">Request early access</p>
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    Full feed scoring &amp; competitor gaps are rolling out — join the waitlist.
                  </p>
                  {rssWaitStatus === "success" ? (
                    <p className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-center text-sm text-emerald-100">
                      You&apos;re on the list — we&apos;ll email you when full RSS audits launch.
                    </p>
                  ) : (
                    <form className="mx-auto mt-3 flex max-w-md flex-col gap-2 sm:flex-row sm:items-stretch" onSubmit={handleRssWaitlist}>
                      <input
                        type="text"
                        name="website"
                        value={rssWaitHp}
                        onChange={(e) => setRssWaitHp(e.target.value)}
                        className="absolute left-[-9999px] h-0 w-0 opacity-0"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden
                      />
                      <Input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={rssWaitEmail}
                        onChange={(e) => setRssWaitEmail(e.target.value)}
                        disabled={rssWaitStatus === "loading"}
                        className="min-h-11 border-border bg-background"
                        aria-label="Email for RSS audit waitlist"
                      />
                      <Button
                        type="submit"
                        variant="secondary"
                        className="min-h-11 shrink-0 touch-manipulation sm:min-w-[200px]"
                        disabled={rssWaitStatus === "loading"}
                      >
                        {rssWaitStatus === "loading" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          "Request early access"
                        )}
                      </Button>
                    </form>
                  )}
                  {rssWaitStatus === "error" && rssWaitMsg && (
                    <p className="mt-2 text-center text-sm text-rose-300" role="alert">
                      {rssWaitMsg}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {analysisMode === "keyword" && titleResult && (
          <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
            <p className="text-center text-2xl font-bold leading-tight text-balance sm:text-3xl">Pick a title to use</p>
            <div className="mt-5 space-y-3">
              {pickVariants.map((variant, idx) => {
                const lane = styleLaneLabel(variant.type, variant.title);
                const optionLetter = ["A", "B", "C"][idx] ?? String(idx + 1);
                return (
                  <Card
                    key={`${variant.title}-${idx}`}
                    className={cn(
                      "rounded-2xl border bg-card transition-shadow",
                      selectedTitle === idx
                        ? "border-primary shadow-md shadow-primary/15 ring-1 ring-primary/30"
                        : "border-border",
                    )}
                  >
                    <CardContent className="p-0">
                      <button
                        type="button"
                        onClick={() => setSelectedTitle(idx)}
                        className="flex min-h-[52px] w-full cursor-pointer touch-manipulation flex-col gap-3 rounded-2xl p-5 text-left transition hover:bg-secondary/50 active:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:min-h-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:p-6"
                        aria-pressed={selectedTitle === idx}
                      >
                        <div className="flex min-w-0 flex-1 gap-3">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-xs font-bold text-muted-foreground"
                            aria-hidden
                          >
                            {optionLetter}
                          </span>
                          <div className="min-w-0 flex-1 space-y-2 overflow-visible">
                            <span className="inline-flex rounded-full border border-border bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              {lane}
                            </span>
                            <p className="break-words text-[15px] font-semibold leading-relaxed sm:text-base">
                              {variant.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2 sm:pt-1">
                          {selectedTitle === idx ? (
                            <span className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1.5 text-xs font-semibold text-primary">
                              <Check className="mr-1 h-3 w-3" /> Your pick
                            </span>
                          ) : idx === bestPickIndex ? (
                            <span
                              className="inline-flex max-w-[11rem] items-center rounded-full border border-border bg-secondary/80 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground sm:max-w-none sm:text-xs"
                              title="One starting point if you want a nudge — pick any line you prefer."
                            >
                              Suggested
                            </span>
                          ) : null}
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Copy uses <strong className="font-medium text-foreground/90">Your pick</strong> only — Suggested is optional.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 md:gap-4">
              <Button
                variant="secondary"
                className="min-h-12 w-full touch-manipulation px-5 sm:min-h-11 sm:w-auto"
                onClick={handleCopy}
                title="Copy the selected title to your clipboard."
              >
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="secondary"
                className="min-h-12 w-full touch-manipulation px-5 sm:min-h-11 sm:w-auto"
                onClick={handleGenerateMore}
                disabled={regenLoading || optimizeLoading}
                title="Same topic — request fresh title angles from the model."
              >
                {regenLoading ? "Working…" : "More title ideas"}
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Same topic — new angles. Edit the box above and click Get title ideas for a new topic.
            </p>
            {copyToast && (
              <p className="mt-3 rounded-xl border border-emerald-500/35 bg-emerald-950/40 px-4 py-3 text-center text-xs leading-relaxed text-emerald-100" role="status">
                {copyToast}
              </p>
            )}
            {copied && !copyToast && (
              <p className="mt-3 text-center text-xs text-emerald-300">Paste it into your episode title field.</p>
            )}
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Cross-device pack backup: add your email when you{" "}
              <Link href="/tools/seo-growth-pack" className="font-semibold text-primary underline-offset-4 hover:underline">
                generate a growth pack
              </Link>
              , then use{" "}
              <Link href="/my-packs" className="font-semibold text-primary underline-offset-4 hover:underline">
                Find my packs
              </Link>
              .
            </p>
          </div>
        )}

        <div className="mx-auto mt-12 max-w-3xl border-t border-border pt-8 text-center sm:mt-14 sm:pt-10">
          <p className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-[2rem] sm:leading-snug md:text-4xl">
            What you get today
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            The main product is the <strong className="text-foreground">SEO growth pack</strong> — everything below the
            button. The title box above is a free bonus to sharpen episode headlines.
          </p>
          <div className="mx-auto mt-8 max-w-xl space-y-6 text-left text-[15px] leading-relaxed text-muted-foreground">
            <div>
              <p className="text-base font-semibold text-foreground">SEO growth pack</p>
              <ul className="mt-3 space-y-2">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  <span>SEO article draft with meta description &amp; keywords</span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  <span>FAQ blocks, social scripts (X, LinkedIn, Substack)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  <span>SRT &amp; highlights from your transcript</span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  <span>7-day publish plan</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Title tryout (this page)</p>
              <ul className="mt-3 space-y-2">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  <span>1 recommended title plus up to 3 alternate angles per run</span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  <span>Topic breadth hint (broad / moderate / narrow — you pick the angle)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  <span>Suggested topic keywords (optional starting points — not rankings or volume data)</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-xl text-left text-sm font-semibold text-foreground">How the title tryout works</p>
          <ol className="mx-auto mt-3 max-w-xl space-y-3 text-left text-[15px] leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">1. Topic anchor — </strong>
              Your phrase is locked into every variant so titles stay on your episode theme.
            </li>
            <li>
              <strong className="text-foreground">2. Topic breadth — </strong>
              We label whether your phrase reads broad or narrow — a framing hint only; you choose the final angle.
            </li>
            <li>
              <strong className="text-foreground">3. Pick &amp; copy — </strong>
              Choose the line that fits your episode, copy it, then run the growth pack for the full article and scripts.
            </li>
          </ol>
          <Button size="lg" className="mx-auto mt-6 flex min-h-[52px] w-full max-w-md touch-manipulation px-8 text-base font-semibold sm:min-h-12 sm:px-10" asChild>
            <Link href="/tools/seo-growth-pack">
              <Rocket className="mr-2 h-4 w-4" />
              Generate SEO pack
            </Link>
          </Button>
          <p className="mx-auto mt-3 max-w-md text-center text-xs text-muted-foreground">
            No credit card required. Paste a transcript on the free tool to generate your pack.
          </p>
          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-muted-foreground sm:gap-x-3">
            <span className="inline-flex min-h-[44px] items-center">© {new Date().getFullYear()} AioCast.com</span>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <Link
              href="/privacy"
              className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline"
            >
              Privacy
            </Link>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <Link href="/terms" className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline">
              Terms
            </Link>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <Link href="/help" className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline">
              Help
            </Link>
            <span aria-hidden className="hidden text-border sm:inline">
              ·
            </span>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center px-2 hover:text-foreground hover:underline"
            >
              Contact
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
