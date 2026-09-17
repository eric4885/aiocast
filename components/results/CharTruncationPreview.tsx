"use client";

import { cn } from "@/lib/utils";

export type TruncationPreset = {
  id: string;
  label: string;
  /** Soft “safe” length before UI starts warning. */
  safe: number;
  /** Hard red zone (Apple 60 / Spotify 70 / YouTube 100 / meta 155). */
  hard: number;
  /** Optional: bold the first N chars (YouTube SERP-style priority). */
  boldFirst?: number;
  /** Simulated single-line search/list truncation length. */
  previewAt: number;
};

export const TITLE_PRESETS = {
  apple: {
    id: "apple-title",
    label: "Apple title window",
    safe: 55,
    hard: 60,
    previewAt: 60,
  },
  spotify: {
    id: "spotify-title",
    label: "Spotify list window",
    safe: 65,
    hard: 70,
    previewAt: 70,
  },
  youtube: {
    id: "youtube-title",
    label: "YouTube title",
    safe: 90,
    hard: 100,
    boldFirst: 40,
    previewAt: 100,
  },
} as const satisfies Record<string, TruncationPreset>;

export const META_PRESET: TruncationPreset = {
  id: "meta",
  label: "Website meta description",
  safe: 145,
  hard: 155,
  previewAt: 155,
};

export const BLURB_PRESETS = {
  apple: {
    id: "apple-blurb",
    label: "Apple description",
    safe: 240,
    hard: 280,
    previewAt: 120,
  },
  spotify: {
    id: "spotify-blurb",
    label: "Spotify description",
    safe: 360,
    hard: 400,
    previewAt: 140,
  },
  website: {
    id: "web-blurb",
    label: "Website episode blurb",
    safe: 700,
    hard: 800,
    previewAt: 160,
  },
} as const satisfies Record<string, TruncationPreset>;

/** Highlight the slice that would be cut after `hard` (for audit warnings). */
export function truncationRiskSnippet(text: string, hard: number): string | null {
  const t = text.trim();
  if (t.length <= hard) return null;
  const start = Math.max(0, hard - 8);
  const end = Math.min(t.length, hard + 12);
  return t.slice(start, end);
}

type Props = {
  text: string;
  preset: TruncationPreset;
  className?: string;
};

export function CharTruncationPreview({ text, preset, className }: Props) {
  const len = text.length;
  const pct = Math.min(100, Math.round((len / preset.hard) * 100));
  const overHard = len > preset.hard;
  const overSafe = len > preset.safe;
  const preview = text.length > preset.previewAt ? `${text.slice(0, preset.previewAt)}…` : text;
  const boldN = preset.boldFirst ?? 0;

  return (
    <div className={cn("mt-3 space-y-2", className)}>
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="text-muted-foreground">{preset.label}</span>
        <span
          className={cn(
            "font-mono tabular-nums",
            overHard ? "text-rose-300" : overSafe ? "text-amber-200" : "text-muted-foreground",
          )}
        >
          {len}/{preset.hard}
          {overHard ? " · truncated" : overSafe ? " · near limit" : " · OK"}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-secondary"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={preset.hard}
        aria-valuenow={Math.min(len, preset.hard)}
        aria-label={`${preset.label} character usage`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            overHard ? "bg-rose-400" : overSafe ? "bg-amber-400" : "bg-primary/80",
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <div className="rounded-md border border-border/60 bg-background/50 px-2.5 py-2">
        <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
          Simulated list / SERP line
        </p>
        <p className="truncate font-mono text-xs leading-relaxed text-foreground/90" title={text}>
          {boldN > 0 && preview.length > 0 ? (
            <>
              <span className="font-semibold text-foreground">{preview.slice(0, boldN)}</span>
              <span>{preview.slice(boldN)}</span>
            </>
          ) : (
            preview || <span className="text-muted-foreground">(empty)</span>
          )}
        </p>
      </div>
    </div>
  );
}
