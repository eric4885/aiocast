"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Loader2, Mic2, Sparkles, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { samplePack } from "@/lib/sample-pack";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";
import { consumeTranscriptPrefill } from "@/lib/transcript-prefill";
import { cn } from "@/lib/utils";

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_SECONDS = 300;

type Phase = "idle" | "analyzing";
type InputMode = "audio" | "transcript";

export function GrowthPackClient({
  fromRemoteSetup = false,
  rateLimitsDisabled = false,
}: {
  fromRemoteSetup?: boolean;
  rateLimitsDisabled?: boolean;
}) {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("idle");
  const [inputMode, setInputMode] = useState<InputMode>("transcript");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openingChest, setOpeningChest] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [email, setEmail] = useState("");
  const [showSample, setShowSample] = useState(false);

  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    if (searchParams.get("mode") === "audio") {
      setInputMode("audio");
    }
  }, [searchParams]);

  useEffect(() => {
    const prefill = consumeTranscriptPrefill();
    if (prefill) {
      setTranscript(prefill);
      setInputMode("transcript");
    }
  }, []);

  const validateFile = useCallback(async (next: File | null) => {
    setError(null);
    if (!next) {
      setFile(null);
      return;
    }
    if (next.size > MAX_BYTES) {
      setError("Please upload a sample under 10 MB. Trim to the first 5 minutes if needed.");
      return;
    }
    const audio = document.createElement("audio");
    const url = URL.createObjectURL(next);
    await new Promise<void>((resolve, reject) => {
      audio.preload = "metadata";
      audio.src = url;
      audio.onloadedmetadata = () => resolve();
      audio.onerror = () => reject(new Error("metadata"));
    }).catch(() => {
      setError("Could not read audio metadata. Try MP3, M4A, or WAV.");
      URL.revokeObjectURL(url);
      return;
    });
    URL.revokeObjectURL(url);
    if (audio.duration > MAX_SECONDS + 0.25) {
      setError(`Keep samples under ${Math.floor(MAX_SECONDS / 60)} minutes for free plan. Trim your clip and retry.`);
      return;
    }
    setFile(next);
  }, []);

  const switchMode = (m: InputMode) => {
    setInputMode(m);
    setError(null);
    if (m !== "audio") setFile(null);
  };

  const hasTranscript = transcript.trim().length > 0;
  const hasAudioInput = inputMode === "audio" && file !== null;
  const hasTextInput = inputMode === "transcript" && hasTranscript;
  const hasInput = hasTextInput || hasAudioInput || (inputMode === "audio" && hasTranscript);
  const willTranscribe = inputMode === "audio" && file !== null && !hasTranscript;

  const runAnalysis = useCallback(async () => {
    if (inputMode === "transcript" && !hasTranscript) {
      setError("Paste a transcript, show notes, or outline to generate your pack.");
      return;
    }
    if (inputMode === "audio" && !file && !hasTranscript) {
      setError("Upload an audio file or paste show notes to generate your pack.");
      return;
    }
    setPhase("analyzing");
    setOpeningChest(true);
    setSubmitSuccess(false);
    setError(null);
    trackEvent(AnalyticsEvents.generatePackStart, {
      input_mode: inputMode,
      has_email: Boolean(email.trim()),
    });
    try {
      const formData = new FormData();
      if (email.trim()) formData.append("email", email.trim());
      if (transcript.trim()) formData.append("transcript", transcript.trim());
      // Only attach audio in audio mode — avoid sending a stale file from a prior session.
      if (inputMode === "audio" && file) formData.append("file", file);
      const res = await fetch("/api/generate-pack", {
        method: "POST",
        body: formData,
      });
      const payload = (await res.json()) as {
        ok?: boolean;
        error?: string;
        resultUrl?: string;
      };
      if (!res.ok || !payload.ok || !payload.resultUrl) {
        setError(payload.error ?? "Generation failed. Try again.");
        setOpeningChest(false);
        setPhase("idle");
        return;
      }
      setOpeningChest(false);
      setSubmitSuccess(true);
      trackEvent(AnalyticsEvents.generatePackSuccess, {
        input_mode: inputMode,
        has_email: Boolean(email.trim()),
        will_transcribe: willTranscribe,
      });
      window.setTimeout(() => {
        window.location.assign(payload.resultUrl!);
      }, willTranscribe ? 1200 : 1800);
    } catch {
      setError("Generation failed - try again in a moment.");
      setOpeningChest(false);
      setPhase("idle");
    }
  }, [file, transcript, email, inputMode, hasTranscript, willTranscribe]);

  const readyToSubmit = hasInput;
  const busy = phase === "analyzing" || submitSuccess;
  const canClickSubmit = readyToSubmit && !busy;

  const disabledSubmitHint = (() => {
    if (busy) return undefined;
    if (inputMode === "transcript" && !hasTranscript) {
      return "Paste a transcript, show notes, or outline to generate your pack";
    }
    if (inputMode === "audio" && !file && !hasTranscript) {
      return "Upload an audio file (we transcribe it automatically) or paste show notes below";
    }
    return undefined;
  })();

  const modeTabs: { id: InputMode; label: string; hint: string }[] = [
    { id: "transcript", label: "Paste transcript", hint: "Fastest when you already have show notes" },
    { id: "audio", label: "Upload audio", hint: "We transcribe your clip, then generate your pack" },
  ];

  const progressLabel = willTranscribe ? "Transcribing audio and building your pack..." : "Generating your growth pack...";
  const progressDetail = willTranscribe
    ? "Usually 30–90 seconds for a 5-minute clip. Keep this tab open — you'll land on your result page automatically."
    : "Packaging your assets now — you'll be redirected when ready.";

  return (
    <div className="border-b border-border bg-gradient-hero bg-grid-subtle">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-24">
        {fromRemoteSetup && (
          <div className="mb-8 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground sm:px-5">
            <span className="font-semibold text-primary">Tip:</span> Upload up to{" "}
            {Math.floor(MAX_SECONDS / 60)} minutes from your usual setup, then generate your SEO growth pack.
          </div>
        )}

        <p className="text-sm font-semibold text-primary">Free tool</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Generate my SEO growth pack</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Paste show notes or upload audio — get an SEO article draft, social scripts, and a 7-day publish plan. Edit
          and publish on your own blog; search traffic takes weeks and is never guaranteed.
        </p>
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-primary">Free plan limits</p>
          <ul className="mt-2 space-y-1">
            <li>Paste transcript/show notes, or upload audio for automatic transcription</li>
            <li>Audio: up to 5 minutes · 10 MB max · MP3, M4A, or WAV recommended</li>
            <li>Per email: 3 free runs per month · Per IP: 3 per day</li>
            <li>
              <Link href="/pro-toolkit" className="text-primary underline-offset-4 hover:underline">
                Pro
              </Link>
              : unlimited runs · FAQ JSON-LD · full pack history (use the same email at checkout)
            </li>
            <li>Please wait 1 minute between submissions from the same IP</li>
            {rateLimitsDisabled && (
              <li className="text-muted-foreground/90">
                Launch preview — limits above are temporarily relaxed while we tune the free tier.
              </li>
            )}
          </ul>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/80 bg-secondary/50">
            <CardContent className="space-y-8 p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step 1</p>
                <p className="mt-1 text-base font-semibold text-foreground">Choose your starting point</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick whichever matches what you have today — transcript paste or audio upload.
                </p>
                <div
                  className="mt-4 flex flex-wrap gap-2 rounded-xl border border-border bg-background/50 p-1"
                  role="tablist"
                  aria-label="Input type"
                >
                  {modeTabs.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={inputMode === t.id}
                      onClick={() => switchMode(t.id)}
                      className={cn(
                        "min-h-[44px] flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold transition sm:text-sm",
                        inputMode === t.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {modeTabs.find((t) => t.id === inputMode)?.hint}
                </p>

                <div className="mt-4">
                  {inputMode === "audio" && (
                    <>
                      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background/40 px-6 py-12 text-center transition-colors hover:border-primary/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background">
                        <UploadCloud className="mb-4 h-10 w-10 text-primary" />
                        <span className="text-sm font-semibold">Drag & drop or click to browse</span>
                        <span className="mt-2 text-xs text-muted-foreground">
                          {file ? file.name : "MP3 / M4A / WAV · max 10 MB · up to 5 min"}
                        </span>
                        {!file && (
                          <span className="mt-2 block text-[11px] leading-snug text-muted-foreground/90">
                            We transcribe your audio automatically, then build your growth pack.
                          </span>
                        )}
                        <input
                          type="file"
                          accept="audio/*"
                          className="sr-only"
                          id="pack-audio-file"
                          onChange={(e) => validateFile(e.target.files?.[0] ?? null)}
                        />
                      </label>
                      <div className="mt-4 rounded-2xl border border-border/70 bg-background/40 p-4">
                        <label htmlFor="pack-transcript-optional" className="text-sm font-semibold text-foreground">
                          Already have show notes? <span className="font-normal text-muted-foreground">(optional)</span>
                        </label>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Paste here to skip auto-transcription and generate directly from your text.
                        </p>
                        <textarea
                          id="pack-transcript-optional"
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          placeholder="Optional — paste show notes or transcript to skip auto-transcription…"
                          className="mt-2 min-h-28 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/30"
                        />
                      </div>
                    </>
                  )}
                  {inputMode === "transcript" && (
                    <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                      <label htmlFor="pack-transcript-only" className="text-sm font-semibold">
                        Episode transcript or show notes
                      </label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        English works best. Non-English notes are auto-translated to English in your pack.
                      </p>
                      <textarea
                        id="pack-transcript-only"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Paste your transcript, polished show notes, or a detailed outline…"
                        className="mt-2 min-h-36 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/30"
                      />
                    </div>
                  )}
                </div>

                {objectUrl && inputMode === "audio" && (
                  <div className="mt-4 rounded-2xl border border-border/70 bg-secondary/70 p-4">
                    <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Mic2 className="h-4 w-4 text-primary" /> Preview
                    </p>
                    <audio controls className="w-full">
                      <source src={objectUrl} />
                    </audio>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step 2</p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  Email for backup delivery{" "}
                  <span className="text-sm font-normal text-muted-foreground">(strongly recommended)</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Without an email you still get instant results, but the private link is easy to lose. Add your address
                  and we&apos;ll send a backup plus index it for{" "}
                  <a href="/my-packs" className="text-primary underline-offset-4 hover:underline">
                    Find my packs
                  </a>
                  . See our{" "}
                  <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
                <label htmlFor="pack-delivery-email" className="sr-only">
                  Email for backup delivery (optional)
                </label>
                <Input
                  id="pack-delivery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com — backup link + pack recovery"
                  className="mt-3"
                  autoComplete="email"
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step 3</p>
                <p className="mt-1 text-base font-semibold text-foreground">Generate</p>
                {error && (
                  <p className="mt-2 text-sm text-rose-300" role="alert">
                    {error}
                  </p>
                )}
                {submitSuccess && (
                  <p
                    className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-100"
                    role="status"
                  >
                    ✓ Pack ready — opening your result page now
                    {email.trim()
                      ? ". Backup link incoming — same email works on Find my packs."
                      : ". Bookmark the page or add your email there for recovery."}
                  </p>
                )}
                {!canClickSubmit && disabledSubmitHint && (
                  <p className="mt-3 text-sm text-muted-foreground" role="status">
                    {disabledSubmitHint}
                  </p>
                )}
                <span className="mt-4 block">
                  <Button
                    size="lg"
                    variant={readyToSubmit || busy ? "primary" : "secondary"}
                    className={cn("w-full", readyToSubmit && !busy && "shadow-md")}
                    disabled={!canClickSubmit}
                    onClick={runAnalysis}
                  >
                    {phase === "analyzing" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {progressLabel}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate pack
                      </>
                    )}
                  </Button>
                </span>
              </div>

              {phase === "analyzing" && (
                <div className="overflow-hidden rounded-2xl border border-primary/30 bg-background/60">
                  <div
                    className="h-2 w-full animate-pulse rounded bg-gradient-to-r from-primary to-accent opacity-90"
                    aria-hidden
                  />
                  <p className="px-4 py-3 text-xs text-muted-foreground">{progressDetail}</p>
                </div>
              )}

              {openingChest && (
                <div className="rounded-2xl border border-primary/30 bg-background/60 p-4 text-center">
                  <div className="text-4xl">🎁</div>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {willTranscribe ? "Transcribing your episode..." : "Preparing your growth pack..."}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Article draft, Q&amp;A blocks, social scripts, quote highlights, and a subtitle file for video reuse.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="relative overflow-hidden border-border/80 shadow-[0_0_0_1px_rgba(99,102,241,0.15)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-accent/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Fixed 3-piece delivery</p>
                  <div className="rounded-lg border border-border bg-background/60 p-3">
                    <p className="text-sm font-semibold text-foreground">
                      <span aria-hidden>📄 </span>SEO Blog Post
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Title, meta description, H2 outline, and FAQ blocks you can paste into your site.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/60 p-3">
                    <p className="text-sm font-semibold text-foreground">
                      <span aria-hidden>📱 </span>Social Scripts
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ready-to-post copy for X, LinkedIn, and Substack — edit lightly and publish.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/60 p-3">
                    <p className="text-sm font-semibold text-foreground">
                      <span aria-hidden>📅 </span>7-Day Publish Plan
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Week-long rollout suggestions with timing hints — pair with your analytics when you upgrade.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4">
                  <p className="font-semibold">Delivery</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Results open on this site as soon as generation finishes — usually under 90 seconds. Add an email for
                    a backup link and pack recovery via{" "}
                    <a href="/my-packs" className="text-primary underline-offset-4 hover:underline">
                      Find my packs
                    </a>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80">
              <CardContent className="p-6">
                <button
                  type="button"
                  onClick={() => setShowSample((v) => !v)}
                  className="flex w-full items-center justify-between gap-2 text-left"
                  aria-expanded={showSample}
                >
                  <span className="font-semibold">See example output</span>
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", showSample && "rotate-180")}
                  />
                </button>
                {showSample && (
                  <div className="mt-4 space-y-4 border-t border-border pt-4 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">{samplePack.seoArticle.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{samplePack.seoArticle.metaDescription}</p>
                      <p className="mt-2 line-clamp-4 text-xs text-muted-foreground">{samplePack.seoArticle.body}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Social preview</p>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{samplePack.socialPack.x}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">7-day plan (excerpt)</p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-muted-foreground">
                        {samplePack.localSchedule.slice(0, 3).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-4 text-xs">
                      <Link href="/examples/sample-growth-pack" className="font-medium text-primary underline-offset-4 hover:underline">
                        Open full public example →
                      </Link>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
