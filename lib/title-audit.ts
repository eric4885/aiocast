import type { OutputLanguage, TitleOptimizationResult, TitleOptimizationVariant } from "./title-optimization";

export type TitleAudit = {
  score: number;
  headline: string;
  improvements: string[];
  submittedPreview: string;
};

const DISPLAY_BOOST_MIN_PCT = 8;
const DISPLAY_BOOST_MAX_PCT = 48;

function hashTopic(topic: string): number {
  let h = 2166136261;
  for (let i = 0; i < topic.length; i++) {
    h ^= topic.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function parsePercent(s: string): number | null {
  const m = String(s).replace(/%/g, "").trim().match(/^([+-]?\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

function clampUpliftPct(p: number): number {
  if (!Number.isFinite(p)) return 22;
  return Math.min(DISPLAY_BOOST_MAX_PCT, Math.max(DISPLAY_BOOST_MIN_PCT, Math.round(p)));
}

function applyDisplayBoostCap(current: number, optimized: number): { current: number; optimized: number } {
  const c = Math.round(current);
  let o = Math.round(optimized);
  if (!Number.isFinite(c) || c <= 0 || !Number.isFinite(o) || o <= c) return { current: c, optimized: o };
  let pct = ((o - c) / c) * 100;
  pct = Math.min(DISPLAY_BOOST_MAX_PCT, Math.max(DISPLAY_BOOST_MIN_PCT, pct));
  o = Math.max(c + 1, Math.round(c * (1 + pct / 100)));
  return { current: c, optimized: o };
}

function formatBoostFromComparison(current: number, optimized: number): string {
  const { current: c, optimized: o } = applyDisplayBoostCap(current, optimized);
  if (!Number.isFinite(c) || c <= 0 || !Number.isFinite(o)) return "+0%";
  const pct = Math.round(((o - c) / c) * 100);
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}%`;
}

/** Blend model uplift with heuristic title strength so % varies by real input, not stuck ~31%. */
function blendModelPctWithAudit(modelPct: number, auditScore: number, topic: string): number {
  const h = hashTopic(topic + "|uplift");
  const weakness = (100 - auditScore) / 100;
  const auditDerived = 12 + weakness * 30;
  const jitter = (h % 15) - 7;
  const mixed = modelPct * 0.32 + auditDerived * 0.52 + jitter * 0.35;
  return clampUpliftPct(mixed);
}

function previewSnippet(t: string, max = 72): string {
  const s = t.trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max).trimEnd()}…`;
}

const GENERIC_EN = /\b(episode|podcast|show|talk|chat|interview|discussion)\b/gi;

/**
 * Heuristic 0–100 score + actionable bullets tied to the user's exact wording (English keyword mode).
 */
export function auditSubmittedTitle(raw: string): TitleAudit {
  const t = raw.trim();
  const improvements: string[] = [];
  let score = 52;

  if (!t) {
    return {
      score: 0,
      headline: "Add a working title to score it.",
      improvements: ["Paste your episode title or topic phrase in English."],
      submittedPreview: "",
    };
  }

  if (/^https?:\/\//i.test(t)) {
    score -= 28;
    improvements.push(
      "That looks like a URL, not a title — summarize the episode in one searchable phrase so we can judge hooks and keywords.",
    );
  }

  const len = t.length;
  if (len < 28) {
    score -= 14;
    improvements.push(
      `“${previewSnippet(t)}” is quite short for discovery — add who it’s for plus a concrete payoff (time saved, mistake avoided, or outcome).`,
    );
  } else if (len > 88) {
    score -= 10;
    improvements.push(
      `“${previewSnippet(t)}” may truncate in apps — front‑load the hook and cut filler at the end.`,
    );
  } else {
    score += 6;
  }

  const hasNumber = /\d/.test(t);
  const hasYear = /\b20[2-9]\d\b/.test(t);
  if (hasNumber || hasYear) {
    score += 14;
  } else {
    score -= 8;
    improvements.push(
      `No clear number or year in “${previewSnippet(t, 56)}” — add one (steps, hours, %, or “2026”) so skimmers see proof.`,
    );
  }

  const hasHook = /\b(why|how|what|when|where)\b/i.test(t);
  if (hasHook) {
    score += 12;
  } else {
    score -= 6;
    improvements.push(
      `Try leading with How / Why / What (or a sharp tension) so listeners instantly see why “${previewSnippet(t, 48)}” matters.`,
    );
  }

  const genericHits = (t.match(GENERIC_EN) ?? []).length;
  if (genericHits >= 2) {
    score -= 12;
    improvements.push(
      "Replace stacked generic words (“episode”, “podcast”, “show”) with audience + specific outcome — search intent wins.",
    );
  } else if (genericHits === 1) {
    score -= 4;
  }

  const words = t.split(/\s+/).filter(Boolean);
  if (words.length >= 14) {
    score -= 8;
    improvements.push("Too many clauses — one primary promise per title reads stronger in search results.");
  }

  if (/[A-Z]{4,}/.test(t.replace(/\b[A-Z]{2,5}\b/g, ""))) {
    score -= 5;
    improvements.push("Tone down shouty ALL‑CAPS — title case or sentence case usually converts better.");
  }

  score = Math.min(100, Math.max(0, Math.round(score)));

  let headline: string;
  if (score >= 78) headline = "Strong baseline — small tweaks could still lift clicks.";
  else if (score >= 55) headline = "Solid start — a sharper hook or proof would help discovery.";
  else if (score >= 38) headline = "Several gaps vs. high‑CTR patterns — prioritize specificity.";
  else headline = "This title leaves search value on the table — rework hook and proof.";

  if (improvements.length > 5) improvements.length = 5;
  if (improvements.length === 0) {
    improvements.push(
      `Keep the specificity of “${previewSnippet(t, 64)}” — test an alternate that names the listener and the outcome in fewer words.`,
    );
  }

  return {
    score,
    headline,
    improvements,
    submittedPreview: previewSnippet(t, 120),
  };
}

function redistributeVariantUplifts(
  variants: TitleOptimizationVariant[],
  centerPct: number,
  optimalTitle: string,
): TitleOptimizationVariant[] {
  const center = clampUpliftPct(centerPct);
  const used = new Set<number>([center]);
  const deltas = [-6, -11, -8, -14, -9];
  let d = 0;
  return variants.map((v) => {
    if (v.title.trim() === optimalTitle.trim()) {
      return { ...v, estimatedUplift: `${center >= 0 ? "+" : ""}${center}%` };
    }
    let p = clampUpliftPct(center + (deltas[d % deltas.length] ?? -6));
    d += 1;
    let guard = 0;
    while (used.has(p) && guard < 50) {
      p = clampUpliftPct(p - 2);
      guard += 1;
    }
    used.add(p);
    return { ...v, estimatedUplift: `${p >= 0 ? "+" : ""}${p}%` };
  });
}

export function injectTitleAuditIntoResult(
  result: TitleOptimizationResult,
  topic: string,
  outputLanguage: OutputLanguage,
): TitleOptimizationResult {
  const trimmed = topic.trim();
  if (outputLanguage !== "en" || !trimmed) {
    return { ...result, titleAudit: undefined };
  }

  const audit = auditSubmittedTitle(trimmed);
  const modelPct = parsePercent(result.boostPercentage) ?? 24;
  const blended = blendModelPctWithAudit(modelPct, audit.score, trimmed);

  let current = result.comparison.current;
  if (!Number.isFinite(current) || current <= 0) {
    const seed = hashTopic(trimmed);
    current = 120 + (seed % 380);
  }
  current = Math.round(current);

  let optimized = Math.max(current + 1, Math.round(current * (1 + blended / 100)));
  ({ current, optimized } = applyDisplayBoostCap(current, optimized));
  const boostPercentage = formatBoostFromComparison(current, optimized);
  const finalPct = parsePercent(boostPercentage) ?? blended;

  const variants = redistributeVariantUplifts(result.variants, finalPct, result.optimalTitle);

  return {
    ...result,
    comparison: { current: Math.round(current), optimized: Math.round(optimized) },
    boostPercentage,
    variants,
    titleAudit: {
      score: audit.score,
      headline: audit.headline,
      improvements: audit.improvements,
      submittedPreview: audit.submittedPreview,
    },
  };
}
