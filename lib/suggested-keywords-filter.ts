/**
 * Filters suggested keywords for display. True monthly search volume requires an external API;
 * we use stopword / brand stripping plus a deterministic proxy so only “likely useful” terms remain.
 */

const STOP = new Set(
  [
    "the",
    "a",
    "an",
    "and",
    "or",
    "for",
    "to",
    "of",
    "in",
    "on",
    "with",
    "your",
    "my",
    "our",
    "this",
    "that",
    "from",
    "at",
    "by",
    "as",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "it",
    "its",
    "we",
    "you",
    "they",
    "them",
    "their",
    "about",
    "into",
    "over",
    "after",
    "before",
    "just",
    "also",
    "too",
    "very",
    "more",
    "most",
    "some",
    "any",
    "all",
    "each",
    "every",
    "no",
    "not",
    "but",
    "if",
    "then",
    "than",
    "so",
    "such",
    "podcast",
    "podcasts",
    "episode",
    "episodes",
    "show",
    "shows",
    "listen",
    "listening",
    "audio",
    "apple",
    "spotify",
    "youtube",
    "rss",
    "host",
    "hosting",
  ].map((w) => w.toLowerCase()),
);

/**
 * Directional proxy for “monthly demand” (not real Keyword Planner data).
 * Multi-word phrases skew higher; junk short tokens skew lower.
 */
export function proxyMonthlyVolumeScore(keyword: string): number {
  const k = keyword.trim().toLowerCase();
  if (k.length < 3) return 0;
  let h = 2166136261;
  for (let i = 0; i < k.length; i++) {
    h ^= k.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const words = k.split(/\s+/).filter(Boolean).length;
  const spread = (h >>> 0) % 1400;
  const lenPart = Math.min(k.length, 48) * 6;
  const phrasePart = words >= 2 ? 420 + (words - 2) * 90 : 90;
  return spread + lenPart + phrasePart;
}

export function filterSuggestedKeywords(keywords: string[], topic: string): string[] {
  const topicLc = topic.toLowerCase();
  const seen = new Set<string>();
  const out: string[] = [];

  for (let kw of keywords) {
    kw = typeof kw === "string" ? kw.trim() : "";
    if (kw.length < 3) continue;
    const lower = kw.toLowerCase();
    const parts = lower.split(/\s+/).filter(Boolean);
    if (parts.every((p) => STOP.has(p) || p.length < 3)) continue;
    if (parts.some((p) => STOP.has(p)) && parts.length === 1) continue;
    if (lower === topicLc.slice(0, lower.length) && kw.length < 6) continue;
    if (seen.has(lower)) continue;
    if (proxyMonthlyVolumeScore(kw) <= 100) continue;
    seen.add(lower);
    out.push(keywords.find((x) => x.trim().toLowerCase() === lower) ?? kw);
    if (out.length >= 8) break;
  }

  return out;
}
