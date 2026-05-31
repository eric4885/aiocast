/** Ensures generated titles stay semantically tied to the user’s topic (English MVP). */

const STOP = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "for",
  "to",
  "in",
  "on",
  "at",
  "of",
  "with",
  "by",
  "from",
  "your",
  "my",
  "our",
  "is",
  "are",
  "was",
  "how",
  "why",
  "what",
  "when",
  "who",
  "this",
  "that",
  "podcast",
  "podcasts",
  "episode",
  "episodes",
  "show",
  "shows",
  "new",
  "get",
  "all",
  "about",
  "into",
  "over",
  "out",
  "up",
  "be",
  "as",
  "it",
  "we",
  "you",
  "they",
  "their",
  "its",
  "can",
  "will",
  "just",
  "like",
]);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractTopicTokens(topic: string): string[] {
  const raw = topic.trim();
  if (!raw) return [];
  if (/^https?:\/\//i.test(raw)) {
    try {
      const host = new URL(raw).hostname.replace(/^www\./i, "");
      const parts = host.split(".").filter((p) => p.length > 2 && !/^(com|net|org|io|fm|co|uk)$/i.test(p));
      return parts.map((p) => p.toLowerCase());
    } catch {
      return [];
    }
  }
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP.has(w));
}

/** True if the title clearly reflects the user topic (words from input or URL host segment). */
export function titleAnchoredToTopic(title: string, topic: string): boolean {
  const t = title.toLowerCase().trim();
  const raw = topic.trim();
  if (!raw || !t) return true;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const host = new URL(raw).hostname.replace(/^www\./i, "").toLowerCase();
      if (host && t.includes(host)) return true;
      const head = host.split(".")[0] ?? "";
      if (head.length >= 4 && t.includes(head)) return true;
    } catch {
      /* fall through */
    }
  }

  const compact = raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  if (compact.length >= 6) {
    const slice = compact.slice(0, 48);
    if (t.includes(slice)) return true;
    const firstThree = compact.split(/\s+/).filter(Boolean).slice(0, 3).join(" ");
    if (firstThree.length >= 6 && t.includes(firstThree)) return true;
  }

  const tokens = extractTopicTokens(topic);
  if (tokens.length === 0) return true;

  let hits = 0;
  for (const tok of tokens) {
    if (tok.length < 3) continue;
    const re = new RegExp(`\\b${escapeRegExp(tok)}\\b`, "i");
    if (re.test(t)) hits += 1;
  }
  return hits >= 1;
}
