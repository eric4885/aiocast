import type { OutputLanguage, TitleOptimizationResult, TitleOptimizationVariant } from "./title-optimization";
import { titleAnchoredToTopic } from "./topic-anchor";

/** Banned phrases = reads like filler/prompt leakage, not a publishable title. */
export function validateTitle(title: string): boolean {
  const bannedPatterns = [
    /the version/i,
    /\bone title\b/i,
    /noticeably higher/i,
    /why others get clicks while yours gets skipped/i,
    /the version listeners actually tap/i,
  ];

  const mustHave = /\d|202[5-9]|\b(?:why|how|what)\b/i;

  const t = title.trim();
  if (t.length < 20 || t.length > 92) return false;
  if (bannedPatterns.some((p) => p.test(t))) return false;
  if (!mustHave.test(t)) return false;
  return true;
}

function shortenTopicLabel(topic: string, max = 32): string {
  const raw = topic.trim();
  if (!raw) return "Podcasting";
  if (/^https?:\/\//i.test(raw)) {
    try {
      const host = new URL(raw).hostname.replace(/^www\./i, "");
      return host.slice(0, max) || "Your Show";
    } catch {
      return "Your Show";
    }
  }
  const phrase = raw.split(/\s+/).filter(Boolean).slice(0, 7).join(" ");
  return phrase.length <= max ? phrase : phrase.slice(0, max).trim();
}

function capitalizePhrase(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Hard-coded templates when model output fails validation (English MVP). */
export function buildFallbackTitles(topic: string, audience = "Podcasters"): string[] {
  const T = capitalizePhrase(shortenTopicLabel(topic, 36));
  const A = audience;
  const raw = [
    `5 ${T} Tools That Save ${A} 10+ Hours/Week`,
    `The Future of ${T}: What ${A} Need to Know in 2026`,
    `Why Your ${T} Isn't Growing (And How to Fix It)`,
    `${T} Myths Debunked by Real ${A}`,
    `What Every ${A} Gets Wrong About ${T} (2026)`,
  ];
  return raw.map((s) => (s.length > 70 ? s.slice(0, 70).trimEnd() : s));
}

function titlePasses(title: string, topic: string): boolean {
  return validateTitle(title) && titleAnchoredToTopic(title, topic);
}

/** Swap invalid or off-topic variant titles for topic-anchored templates; fix optimalTitle when needed. */
export function applyTitlePostProcessing(
  result: TitleOptimizationResult,
  topic: string,
  outputLanguage: OutputLanguage,
): TitleOptimizationResult {
  if (outputLanguage !== "en") return result;

  const fallbacks = buildFallbackTitles(topic);
  const types = ["Contrarian", "How-to", "Story", "SEO-first", "Authority"];

  let variants: TitleOptimizationVariant[] = result.variants.map((v, i) => {
    if (titlePasses(v.title, topic)) return v;
    return {
      ...v,
      title: fallbacks[i % fallbacks.length],
      type: v.type || types[i % types.length],
    };
  });

  let optimalTitle = result.optimalTitle.trim();
  if (!titlePasses(optimalTitle, topic)) {
    optimalTitle =
      variants.find((v) => titlePasses(v.title, topic))?.title ?? fallbacks[0];
  }

  const seen = new Set<string>();
  variants = variants.map((v, i) => {
    let nextTitle = titlePasses(v.title, topic) ? v.title : fallbacks[i % fallbacks.length];
    let guard = 0;
    while (seen.has(nextTitle.toLowerCase()) && guard < 8) {
      nextTitle = fallbacks[(i + guard + 1) % fallbacks.length];
      guard += 1;
    }
    seen.add(nextTitle.toLowerCase());
    return { ...v, title: nextTitle };
  });

  if (!titlePasses(optimalTitle, topic)) {
    optimalTitle = variants.find((v) => titlePasses(v.title, topic))?.title ?? fallbacks[0];
  }

  return {
    ...result,
    optimalTitle,
    variants,
  };
}
