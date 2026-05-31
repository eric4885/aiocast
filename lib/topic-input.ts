/** Shared topic normalization + MVP English-only validation (client + API). */

export function normalizeEnglishTopicInput(raw: string): string {
  try {
    let s = raw.trim().normalize("NFKC");
    s = s
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035\u0060\u00B4]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036\u00AB\u00BB]/g, '"')
      .replace(/[\u2013\u2014\u2212\u2010\u2011\uFE58\uFE63\uFF0D]/g, "-")
      .replace(/\u2026/g, "...")
      .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ");
    s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return s.replace(/\s+/g, " ").trim();
  } catch {
    return raw.trim().replace(/\s+/g, " ").trim();
  }
}

export function isValidTopicInput(input: string): boolean {
  const s = input.trim();
  if (s.length < 2 || s.length > 800) return false;
  if (/[\u4e00-\u9fff]/.test(s)) return false;
  if (!/[A-Za-z]/.test(s)) return false;
  if (!/^[A-Za-z0-9\s:\/?&=._,*~\-'"()%+#!@<>\[\]{}]*$/.test(s)) return false;
  const nonWordRate = (s.match(/[^A-Za-z0-9\s]/g) ?? []).length / s.length;
  if (nonWordRate > 0.45) return false;
  const chars = Array.from(s.replace(/\s+/g, ""));
  if (chars.length < 2) return false;
  const freq = new Map<string, number>();
  for (const ch of chars) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  const maxCount = Math.max(0, ...Array.from(freq.values()));
  if (maxCount / chars.length > 0.7) return false;
  return true;
}

/** Keyword mode: disable Analyze when empty or invalid English topic (avoids wasted API calls). */
export function isKeywordAnalyzeDisabled(raw: string): boolean {
  const t = raw.trim();
  if (!t) return true;
  return !isValidTopicInput(normalizeEnglishTopicInput(raw));
}

export function showEnglishTopicHint(raw: string): boolean {
  return raw.trim().length > 0 && isKeywordAnalyzeDisabled(raw);
}

export const API_TOPIC_ERROR_MESSAGE =
  "Please enter a valid English subject or RSS/Podcast URL. This MVP version does not currently support other languages. Avoid using special characters; using straight quotes and hyphens works best.";
