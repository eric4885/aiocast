"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Link2, Mic2, Sparkles, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_SECONDS = 300;

type Phase = "idle" | "analyzing";
type InputMode = "audio" | "url" | "transcript";

export function AudioQualityClient({
  fromRemoteSetup = false,
}: {
  fromRemoteSetup?: boolean;
}) {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("idle");
  const [inputMode, setInputMode] = useState<InputMode>("transcript");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openingChest, setOpeningChest] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [email, setEmail] = useState("");

  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    const url = searchParams.get("sourceUrl");
    if (url) {
      setSourceUrl(url);
      setInputMode("url");
    }
  }, [searchParams]);

  const validateFile = useCallback(async (next: File | null) => {
    setError(null);
    if (!next) {
      setFile(null);
      return;
    }
    if (next.size > MAX_BYTES) {
      setError("Please upload a sample under 10 MB.");
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
      setError("Could not read audio metadata.");
      URL.revokeObjectURL(url);
      return;
    });
    URL.revokeObjectURL(url);
    if (audio.duration > MAX_SECONDS + 0.25) {
      setError(`Keep samples under ${Math.floor(MAX_SECONDS / 60)} minutes for free plan.`);
      return;
    }
    setFile(next);
  }, []);

  const switchMode = (m: InputMode) => {
    setInputMode(m);
    setError(null);
    if (m !== "audio") setFile(null);
    if (m !== "url") setSourceUrl("");
  };

  const runAnalysis = useCallback(async () => {
    if (!email.trim()) {
      setError("Email is required to deliver your result link.");
      return;
    }
    if (!transcript.trim()) {
      setError("Paste a transcript, show notes, or outline to generate your pack.");
      return;
    }
    setPhase("analyzing");
    setOpeningChest(true);
    setSubmitSuccess(false);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      if (transcript.trim()) formData.append("transcript", transcript.trim());
      if (sourceUrl.trim()) formData.append("sourceUrl", sourceUrl.trim());
      if (file) formData.append("file", file);
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
      window.setTimeout(() => {
        window.location.assign(payload.resultUrl!);
      }, 2600);
    } catch {
      setError("Generation failed - try again in a moment.");
      setOpeningChest(false);
      setPhase("idle");
    }
  }, [file, transcript, sourceUrl, email, inputMode]);

  const hasTranscript = transcript.trim().length > 0;
  const readyToSubmit = hasTranscript && email.trim().length > 0;
  const busy = phase === "analyzing" || submitSuccess;
  const canClickSubmit = readyToSubmit && !busy;

  const disabledSubmitHint = (() => {
    if (busy) return undefined;
    if (!email.trim()) return "Please enter your email address";
    if (!hasTranscript) return "Paste a transcript, show notes, or outline to generate your pack";
    return undefined;
  })();

  const modeTabs: { id: InputMode; label: string }[] = [
    { id: "transcript", label: "Paste transcript" },
    { id: "audio", label: "Upload audio" },
    { id: "url", label: "Paste URL" },
  ];

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
          Pick one input path below. You&apos;ll get three packaged assets: an SEO-style article draft, social scripts,
          and a 7-day publish plan.
        </p>
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-primary">Free plan limits</p>
          <ul className="mt-2 space-y-1">
            <li>Transcript (or show notes) is the only required input — audio and URL are optional references</li>
            <li>Audio: optional clip check up to 5 minutes (we do not auto-transcribe on the free tier)</li>
            <li>Per email: 3 free runs per month · Per IP: 3 per day</li>
            <li>Please wait 1 minute between submissions from the same IP</li>
          </ul>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/80 bg-secondary/50">
            <CardContent className="space-y-8 p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step 1</p>
                <p className="mt-1 text-base font-semibold text-foreground">Choose one input method</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Paste transcript-style text to generate your pack. Upload audio or add a URL only if you want optional
                  reference metadata — generation always uses the text field below.
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

                <div className="mt-4">
                  {inputMode === "audio" && (
                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background/40 px-6 py-12 text-center transition-colors hover:border-primary/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background">
                      <UploadCloud className="mb-4 h-10 w-10 text-primary" />
                      <span className="text-sm font-semibold">Drag & drop or click to browse</span>
                      <span className="mt-2 text-xs text-muted-foreground">
                        {file ? file.name : "Optional · MP3 recommended · max 10 MB · up to 5 min"}
                      </span>
                      {!file && (
                        <span className="mt-2 block text-[11px] leading-snug text-muted-foreground/90">
                          Tip: Export as MP3 to stay under the limit.
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
                  )}
                  {inputMode === "url" && (
                    <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <Link2 className="h-4 w-4 text-primary" /> Episode or show URL
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Optional reference only — paste transcript below to generate your pack.
                      </p>
                      <Input
                        id="pack-source-url"
                        type="url"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                        placeholder="https://yourpodcast.com/episodes/42-ai-tools"
                        className="mt-2"
                        aria-describedby="pack-url-hint"
                      />
                      <p id="pack-url-hint" className="sr-only">
                        Episode link for your records; generation uses the transcript field.
                      </p>
                    </div>
                  )}
                  {(inputMode === "audio" || inputMode === "url") && (
                    <div className="mt-4 rounded-2xl border border-border/70 bg-background/40 p-4">
                      <label htmlFor="pack-transcript-aux" className="text-sm font-semibold text-foreground">
                        Episode transcript or show notes <span className="text-primary">(required)</span>
                      </label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        This text drives your SEO article and scripts. Audio above is optional and is not transcribed
                        automatically on the free tier.
                      </p>
                      <textarea
                        id="pack-transcript-aux"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Paste transcript, polished show notes, or a detailed outline…"
                        className="mt-2 min-h-32 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/30"
                      />
                    </div>
                  )}
                  {inputMode === "transcript" && (
                    <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                      <label htmlFor="pack-transcript-only" className="text-sm font-semibold">
                        Full or partial transcript
                      </label>
                      <textarea
                        id="pack-transcript-only"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Paste your transcript text here…"
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
                <p className="mt-1 text-base font-semibold text-foreground">Email for delivery</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  We send a link to your personalized result page. See our{" "}
                  <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
                    Privacy Policy
                  </a>{" "}
                  for how we use your email and inputs.
                </p>
                <label htmlFor="pack-delivery-email" className="sr-only">
                  Email for delivery
                </label>
                <Input
                  id="pack-delivery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-3"
                  autoComplete="email"
                  required
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
                    ✓ Your pack is being generated — check your inbox in 2–5 minutes.
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
                        Generating your growth pack...
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
                  <p className="px-4 py-3 text-xs text-muted-foreground">Packaging your assets now...</p>
                </div>
              )}

              {openingChest && (
                <div className="rounded-2xl border border-primary/30 bg-background/60 p-4 text-center">
                  <div className="text-4xl">🎁</div>
                  <p className="mt-2 text-sm font-semibold text-foreground">Preparing your growth pack...</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Article draft, Q&amp;A blocks, social scripts, quote highlights, and a subtitle file for video reuse.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    When AI generation is enabled on the server, this usually takes about 15–90 seconds. Keep this tab
                    open.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

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
                    Title, meta description, H2 outline, and structured FAQ blocks for featured snippets.
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
                  Results delivered to your inbox within 2–5 minutes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
