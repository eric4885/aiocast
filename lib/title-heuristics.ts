/** Client-safe title scoring heuristics (no API). */

export function computeEmotionScore(title: string): number {
  let s = 5;
  const t = title;
  if (/\b(why|how|what)\b/i.test(t) || /[为什么怎啥哪]|如何|为何/.test(t)) s += 1;
  if (/\d/.test(t) || /\b\d+x\b/i.test(t)) s += 1;
  if (/\b(transform|explode|skyrocket)\b/i.test(t)) s += 2;
  if (/\b(mistake|fail|avoid)\b/i.test(t) || /错误|避免|失败/.test(t)) s += 1;
  return Math.min(10, Math.max(1, s));
}

export function computeClarityScore(title: string): number {
  let s = 5;
  const len = title.trim().length;
  const words = title.trim().split(/\s+/).filter(Boolean).length;
  if (len >= 48 && len <= 82) s += 2;
  else if (len > 95) s -= 1;
  else if (len < 38 && len > 0) s -= 2;
  if (words >= 7 && words <= 14) s += 1;
  if (/[!?]{2,}/.test(title)) s -= 1;
  return Math.min(10, Math.max(1, s));
}

function topicTokens(topic: string): string[] {
  return topic
    .toLowerCase()
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/[^a-z0-9\u4e00-\u9fff\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2);
}

export function computeSEOScore(title: string, topic: string): number {
  let s = 5;
  const titleLower = title.toLowerCase();
  const words = topicTokens(topic);
  let overlap = 0;
  for (const w of words) {
    if (titleLower.includes(w.toLowerCase())) overlap += 1;
  }
  s += Math.min(3, overlap);
  if (/\d/.test(title)) s += 1;
  if (/\b(how|why|what|best|guide|tips)\b/i.test(title)) s += 1;
  return Math.min(10, Math.max(1, s));
}

export function combinedSEOClarityScore(title: string, topic: string): number {
  return computeSEOScore(title, topic) + computeClarityScore(title);
}

/** Display lane for the three-card picker (English-first; falls back by pattern). */
export function styleLaneLabel(variantType: string, title: string): string {
  const ty = variantType.toLowerCase();
  if (/numbers?-first|numeric|methodology|seo-first/.test(ty)) return "Numbers / methodology";
  if (/how-to|question/.test(ty)) return "How-to / question";
  if (/emotional|hook|counter|contrarian|story/.test(ty)) return "Emotional / contrarian";
  if (/^\s*(how|why|what)\b/i.test(title.trim()) || /\?/.test(title)) return "How-to / question";
  if (/\d/.test(title)) return "Numbers / methodology";
  return "Emotional / contrarian";
}
