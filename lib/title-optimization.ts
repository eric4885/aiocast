import { recordOpenAiUsage } from "@/lib/mvp-generate";
import { openAiApiKey, openAiUrl } from "@/lib/openai-config";
import { injectTitleAuditIntoResult, type TitleAudit } from "@/lib/title-audit";
import { extractTopicTokens, titleAnchoredToTopic } from "@/lib/topic-anchor";
import { applyTitlePostProcessing, buildFallbackTitles } from "@/lib/title-output-filter";
import { filterSuggestedKeywords } from "@/lib/suggested-keywords-filter";

export type SearchDemandLevel = "High" | "Medium" | "Low";
export type SearchTrend = "Rising" | "Stable" | "Cooling";

export type TitleOptimizationVariant = {
  title: string;
  type: string;
  estimatedUplift: string;
};

export type TitleOptimizationResult = {
  optimalTitle: string;
  boostPercentage: string;
  searchDemand: { level: SearchDemandLevel; trend: SearchTrend };
  comparison: { current: number; optimized: number };
  variants: TitleOptimizationVariant[];
  suggestedKeywords: string[];
  emotionalScore: number;
  /** Present for English keyword analysis: heuristic score + suggestions tied to the user’s exact input. */
  titleAudit?: TitleAudit;
};

export type OutputLanguage = "zh" | "en";

type ListenNotesSignal = {
  level: SearchDemandLevel;
  trend: SearchTrend;
  suggestedKeywords: string[];
};

function jsonFromModel(raw: string): unknown | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

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
  if (!m) return null;
  return Number(m[1]);
}

function sanitizeCnTitleStyle(title: string): string {
  let t = title.trim();
  if (!t) return t;

  // Remove common machine-like filler and awkward pseudo-jargon.
  const blocked = [
    /探索/g,
    /全攻略/g,
    /终极指南/g,
    /一文带你/g,
    /深入了解/g,
    /不容错过/g,
    /全方位/g,
    /带你玩转/g,
    /保姆级/g,
    /史上最全/g,
    /关键词矩阵/g,
    /流量密码学/g,
    /AIO引擎/g,
    /搜索抓取闭环/g,
    /认知杠杆/g,
  ];
  for (const re of blocked) {
    t = t.replace(re, "");
  }

  // Normalize punctuation style for readable social headline rhythm.
  t = t
    .replace(/\s+/g, " ")
    .replace(/[，,]{2,}/g, "，")
    .replace(/[。\.]{2,}/g, "。")
    .replace(/[!！]{2,}/g, "！")
    .replace(/[?？]{2,}/g, "？")
    .trim();

  // If headline becomes too flat after cleanup, add natural curiosity frame.
  if (t.length < 8) {
    t = `${t}：为什么同样内容，有人一发就有点击？`;
  }
  return t;
}

function sanitizeEnTitleStyle(title: string): string {
  let t = title.trim();
  if (!t) return t;
  t = t
    .replace(/\s+/g, " ")
    .replace(/(ultimate guide|complete guide|full guide|everything you need)/gi, "")
    .replace(/[,:]\s*(emotional|seo-first|authority|style)$/i, "")
    .trim();
  return t;
}

function sanitizeEnglishText(s: string): string {
  return s
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTopicPrefix(title: string, topic: string): string {
  const raw = title.trim();
  const base = topic.trim();
  if (!raw || !base) return raw;
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^\\s*${escaped}\\s*[:：\\-—|｜,，]*\\s*`, "i");
  const stripped = raw.replace(re, "").trim();
  return stripped || raw;
}

/** Avoid stripping the topic prefix if the remainder no longer reflects the user subject. */
function stripTopicPrefixSafe(title: string, topic: string): string {
  const stripped = stripTopicPrefix(title, topic);
  if (!stripped.trim()) return title.trim();
  if (titleAnchoredToTopic(stripped, topic)) return stripped;
  return title.trim();
}

function sanitizeVariantTitles(variants: TitleOptimizationVariant[], topic: string): TitleOptimizationVariant[] {
  const isZh = /[\u4e00-\u9fff]/.test(topic);
  if (!isZh) {
    return variants.map((v) => ({
      ...v,
      title: sanitizeEnTitleStyle(stripTopicPrefixSafe(v.title, topic)),
    }));
  }
  return variants.map((v) => ({
    ...v,
    title: sanitizeCnTitleStyle(stripTopicPrefixSafe(v.title, topic)),
  }));
}

/** Conservative display range: credible for SaaS UI (avoid "+260%" trust damage). */
const DISPLAY_BOOST_MIN_PCT = 8;
const DISPLAY_BOOST_MAX_PCT = 48;

function applyDisplayBoostCap(current: number, optimized: number): { current: number; optimized: number } {
  const c = Math.round(current);
  let o = Math.round(optimized);
  if (!Number.isFinite(c) || c <= 0 || !Number.isFinite(o) || o <= c) return { current: c, optimized: o };
  let pct = ((o - c) / c) * 100;
  pct = Math.min(DISPLAY_BOOST_MAX_PCT, Math.max(DISPLAY_BOOST_MIN_PCT, pct));
  o = Math.max(c + 1, Math.round(c * (1 + pct / 100)));
  return { current: c, optimized: o };
}

function formatBoost(current: number, optimized: number): string {
  const { current: c, optimized: o } = applyDisplayBoostCap(current, optimized);
  if (!Number.isFinite(c) || c <= 0 || !Number.isFinite(o)) return "+0%";
  const pct = Math.round(((o - c) / c) * 100);
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}%`;
}

function capUpliftPct(p: number): number {
  if (!Number.isFinite(p)) return 22;
  return Math.min(DISPLAY_BOOST_MAX_PCT, Math.max(DISPLAY_BOOST_MIN_PCT, Math.round(p)));
}

function formatCapUplift(p: number): string {
  const v = capUpliftPct(p);
  return `${v >= 0 ? "+" : ""}${v}%`;
}

function inferDemandFromTotal(total: number): SearchDemandLevel {
  if (total >= 1200) return "High";
  if (total >= 300) return "Medium";
  return "Low";
}

function inferTrendFromRecentCounts(counts: number[]): SearchTrend {
  if (counts.length < 2) return "Stable";
  const first = counts.slice(0, Math.ceil(counts.length / 2)).reduce((a, b) => a + b, 0);
  const second = counts.slice(Math.ceil(counts.length / 2)).reduce((a, b) => a + b, 0);
  if (second > first * 1.12) return "Rising";
  if (second < first * 0.88) return "Cooling";
  return "Stable";
}

async function fetchListenNotesSignal(topic: string): Promise<ListenNotesSignal | null> {
  const key = process.env.LISTEN_NOTES_API_KEY;
  if (!key) return null;

  const q = encodeURIComponent(topic.slice(0, 120));
  const url = `https://listen-api.listennotes.com/api/v2/search?q=${q}&type=episode&offset=0&len_min=2&sort_by_date=0`;
  const res = await fetch(url, {
    headers: {
      "X-ListenAPI-Key": key,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;

  let json: {
    total?: number;
    count?: number;
    results?: Array<{
      title_original?: string;
      podcast?: { title_original?: string };
      listennotes_url?: string;
      pub_date_ms?: number;
    }>;
  };
  try {
    json = (await res.json()) as typeof json;
  } catch {
    return null;
  }

  const total = Number(json.total ?? json.count ?? 0);
  const results = Array.isArray(json.results) ? json.results : [];
  const perMonth = new Map<string, number>();
  for (const item of results.slice(0, 50)) {
    if (!item.pub_date_ms) continue;
    const d = new Date(item.pub_date_ms);
    const ym = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    perMonth.set(ym, (perMonth.get(ym) ?? 0) + 1);
  }
  const monthCounts = Array.from(perMonth.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((x) => x[1]);

  const keywordBag = new Map<string, number>();
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2);

  for (const item of results.slice(0, 40)) {
    const parts = [item.title_original ?? "", item.podcast?.title_original ?? ""];
    for (const p of parts) {
      for (const w of normalize(p)) {
        if (w === topic.toLowerCase()) continue;
        keywordBag.set(w, (keywordBag.get(w) ?? 0) + 1);
      }
    }
  }
  const suggestedKeywords = Array.from(keywordBag.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map((x) => x[0]);

  return {
    level: inferDemandFromTotal(total),
    trend: inferTrendFromRecentCounts(monthCounts),
    suggestedKeywords,
  };
}

/** Server-side consistency: math闭环 + variants uplift 差异化兜底 */
export function normalizeTitleOptimization(raw: unknown, topic: string): TitleOptimizationResult | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const optimalTitle = typeof o.optimalTitle === "string" ? o.optimalTitle.trim() : "";
  let current = Number(o.comparison && typeof o.comparison === "object" && (o.comparison as Record<string, unknown>).current);
  let optimized = Number(o.comparison && typeof o.comparison === "object" && (o.comparison as Record<string, unknown>).optimized);
  if (!Number.isFinite(current)) current = 0;
  if (!Number.isFinite(optimized)) optimized = 0;

  const searchDemandRaw = o.searchDemand;
  let level: SearchDemandLevel = "Medium";
  let trend: SearchTrend = "Stable";
  if (searchDemandRaw && typeof searchDemandRaw === "object") {
    const sd = searchDemandRaw as Record<string, unknown>;
    if (sd.level === "High" || sd.level === "Medium" || sd.level === "Low") level = sd.level;
    if (sd.trend === "Rising" || sd.trend === "Stable" || sd.trend === "Cooling") trend = sd.trend;
  }

  if (current <= 0 || optimized <= 0 || optimized <= current) {
    const seed = hashTopic(topic || "default");
    const mult = 1.09 + ((seed % 18) / 100); // ~9–26% before cap
    current = 120 + (seed % 380);
    optimized = Math.max(Math.round(current * mult), current + 12 + (seed % 35));
    level = ["High", "Medium", "Low"][seed % 3] as SearchDemandLevel;
    trend = ["Rising", "Stable", "Cooling"][Math.floor(seed / 7) % 3] as SearchTrend;
  }

  ({ current, optimized } = applyDisplayBoostCap(current, optimized));
  const boostPercentage = formatBoost(current, optimized);

  let variants: TitleOptimizationVariant[] = [];
  if (Array.isArray(o.variants)) {
    variants = o.variants
      .filter((v): v is TitleOptimizationVariant => {
        if (!v || typeof v !== "object") return false;
        const x = v as Record<string, unknown>;
        return typeof x.title === "string" && typeof x.estimatedUplift === "string";
      })
      .map((v) => {
        const x = v as Record<string, unknown>;
        return {
          title: String(x.title).trim(),
          type: typeof x.type === "string" ? x.type : "Style",
          estimatedUplift: String(x.estimatedUplift),
        };
      });
  }

  const basePct = parsePercent(boostPercentage) ?? 0;
  const isZh = /[\u4e00-\u9fff]/.test(topic);
  if (variants.length < 3) {
    const pads = [
      { type: "Numbers-first", delta: -0.08, zh: "别人涨粉，你没动静，问题可能在标题", en: "5 Workflow Tweaks That Saved Our Team 10 Hours a Week" },
      { type: "How-to question", delta: 0.06, zh: "同样内容，换这版标题，点击会更高", en: "How to Title Episodes So Listeners Actually Press Play" },
      { type: "Emotional hook", delta: -0.03, zh: "这句标题更容易被搜到，也更容易被点开", en: "Why I Stopped Chasing Downloads (And What I Track Instead)" },
    ];
    while (variants.length < 3) {
      const i = variants.length;
      const d = basePct * (1 + pads[i].delta);
      const uplift = formatCapUplift(d);
      variants.push({
        title: isZh ? pads[i].zh : pads[i].en,
        type: pads[i].type,
        estimatedUplift: uplift,
      });
    }
  }

  const multipliers = [0.88, 1.0, 1.12, 0.93, 1.06];
  variants = variants.map((v, i) => {
    let p = parsePercent(v.estimatedUplift);
    if (p === null || !Number.isFinite(p)) {
      p = basePct * (multipliers[i % multipliers.length] ?? 1);
    }
    return { ...v, estimatedUplift: formatCapUplift(p) };
  });
  variants = sanitizeVariantTitles(variants, topic);

  const seenRounded = new Set<number>();
  variants = variants.map((v, i) => {
    let p = capUpliftPct(parsePercent(v.estimatedUplift) ?? 0);
    let guard = 0;
    while (seenRounded.has(p) && guard < 50) {
      p = capUpliftPct(p + (i % 2 === 0 ? 3 : -3));
      guard += 1;
    }
    seenRounded.add(p);
    return { ...v, estimatedUplift: `${p >= 0 ? "+" : ""}${p}%` };
  });

  const keywordsRaw = Array.isArray(o.suggestedKeywords)
    ? o.suggestedKeywords.filter((k): k is string => typeof k === "string").slice(0, 14)
    : [];
  let keywords = filterSuggestedKeywords(keywordsRaw, topic);
  if (keywords.length === 0 && keywordsRaw.length > 0) {
    keywords = keywordsRaw.filter((k) => k.trim().length >= 4).slice(0, 6);
  }

  let emotionalScore = Number(o.emotionalScore);
  if (!Number.isFinite(emotionalScore)) emotionalScore = 5;
  emotionalScore = Math.min(10, Math.max(1, Math.round(emotionalScore)));

  const ranked = variants
    .map((v) => ({ v, p: parsePercent(v.estimatedUplift) ?? -Infinity }))
    .sort((a, b) => b.p - a.p);
  const enforcedOptimalTitleRaw = ranked[0]?.v.title || optimalTitle || variants[0]?.title || topic;
  const enforcedOptimalTitle = /[\u4e00-\u9fff]/.test(topic)
    ? sanitizeCnTitleStyle(enforcedOptimalTitleRaw)
    : enforcedOptimalTitleRaw;
  const topPct = ranked[0]?.p;
  if (Number.isFinite(topPct) && current > 0 && topPct !== undefined) {
    const capped = capUpliftPct(topPct);
    optimized = Math.max(current + 1, Math.round(current * (1 + capped / 100)));
  }
  ({ current, optimized } = applyDisplayBoostCap(current, optimized));
  const finalBoost = formatBoost(current, optimized);
  variants = variants.map((v) =>
    v.title === enforcedOptimalTitle ? { ...v, estimatedUplift: finalBoost } : v,
  );

  return {
    optimalTitle: enforcedOptimalTitle,
    boostPercentage: finalBoost,
    searchDemand: { level, trend },
    comparison: { current: Math.round(current), optimized: Math.round(optimized) },
    variants: variants.slice(0, 5),
    suggestedKeywords: keywords,
    emotionalScore,
  };
}

const SYSTEM_PROMPT = `
You are a podcast growth editor focused on Apple Podcasts / Spotify discovery.

Generate JSON analysis for the user's topic. Rules:

1. **English only** — no other languages.

2. **Credible metrics (critical)** — Overpromising destroys trust.
   - Pick realistic listener integers for "comparison": optimized must be **8% to 48%** higher than current (not 200%+).
   - "boostPercentage" must equal ((optimized − current) / current) × 100, rounded to a **whole number**, formatted like "+32%" (no decimals).

2b. **Echo the user’s phrase** — In your reasoning (not necessarily JSON fields), mentally note their exact working title; variants should address gaps *in that phrase* (specificity, hook, proof), not generic podcast advice only.

3. **Topic lock (critical)** — \`optimalTitle\` and **every** variant MUST stay on the user’s subject. Include recognizable words from their topic (or obvious synonyms, e.g. keto ↔ low-carb). If they paste a **URL**, use the **show niche + hostname cues** from that URL string in each title. **Forbidden:** unrelated “workflow”, “downloads”, or generic podcast-growth platitudes when the topic is clearly something else (nursing, crypto, parenting, fly fishing, etc.).

4. **Titles must feel human and specific** — Each variant needs at least one of:
   - a **concrete number** (hours saved, episodes, weeks, dollars, percent), OR
   - a **named audience** (solo founders, nurses, parents, indie devs), OR
   - a **clear tension / conflict** (mistake vs fix, before vs after, myth vs reality).
   - Avoid vague slogans ("tap", "noticed higher CTR") and filler ("ultimate", "unleash", "dive deep").
   - Write full podcast-title length (roughly 45–85 characters); no trailing ellipsis.

5. **Variants** — Provide **exactly 3** objects in this order with **sharp stylistic contrast** (same topic lock):
   - **[0] Numbers / methodology** — \`type\` must be \`"Numbers-first"\`. Include a concrete number, count, timeline, or framework (e.g. "3 Ways…", "10 Minutes…", "5-Step…").
   - **[1] How-to / question** — \`type\` must be \`"How-to question"\`. Lead with How, Why, or What so it matches listener search queries; question mark optional.
   - **[2] Emotional / contrarian** — \`type\` must be \`"Emotional hook"\`. Use tension: mistakes to avoid, myths, "what everyone gets wrong", or a bold counter-intuitive claim.
   Include "estimatedUplift" strings; uplifts must stay in **+8% to +48%** as credible deltas vs baseline (whole numbers only).

6. **No AI meta** — Never mention ChatGPT, AI-generated, or this tool.

Return **only** valid JSON:
{
  "optimalTitle": "...",
  "boostPercentage": "+32%",
  "searchDemand": { "level": "High"|"Medium"|"Low", "trend": "Rising"|"Stable"|"Cooling" },
  "comparison": { "current": 240, "optimized": 317 },
  "variants": [
    {"title": "...", "type": "Contrarian", "estimatedUplift": "+28%"},
    {"title": "...", "type": "How-to", "estimatedUplift": "+32%"}
  ],
  "suggestedKeywords": ["...", "..."],
  "emotionalScore": 6
}
`;

function buildUserPrompt(topic: string): string {
  const t = topic.slice(0, 800);
  return `User topic / working title to optimize. All titles must clearly reflect THIS subject (use its distinctive words; do not pivot to unrelated themes):\n"""${t}"""`;
}

/** Offline / emergency pack — OpenAI off or API failure. Exported for route-level recovery. */
export function buildOfflineTitleResult(topic: string, outputLanguage: OutputLanguage): TitleOptimizationResult {
  const trimmed = topic.trim();
  const seed = hashTopic(trimmed || "podcast");
  const current = 150 + (seed % 350);
  const optimized = Math.round(current * (1.1 + (seed % 13) / 100));
  const boostPercentage = formatBoost(current, optimized);
  const isZh = outputLanguage === "zh";
  const pack = isZh
    ? {
        optimalTitle: "同样内容，为什么这版标题点击更高",
        variants: [
          { title: "别人发完就涨，你发完没人点，差在哪？", type: "Numbers-first", estimatedUplift: "+22%" },
          { title: "同样内容，为什么这版标题点击更高", type: "How-to question", estimatedUplift: "+28%" },
          { title: "把标题改成这句，触达会明显不一样", type: "Emotional hook", estimatedUplift: "+24%" },
        ],
        suggestedKeywords: [trimmed || "播客", "增长", "点击率"],
      }
    : (() => {
        const fb = buildFallbackTitles(trimmed);
        const kws = extractTopicTokens(trimmed);
        return {
          optimalTitle: fb[0] ?? "What Every Podcast Listener Gets Wrong About This Topic (2026)",
          variants: [
            { title: fb[1] ?? fb[0], type: "Numbers-first", estimatedUplift: "+24%" },
            { title: fb[2] ?? fb[0], type: "How-to question", estimatedUplift: "+28%" },
            { title: fb[3] ?? fb[0], type: "Emotional hook", estimatedUplift: "+26%" },
          ],
          suggestedKeywords:
            kws.length > 0
              ? kws.slice(0, 6)
              : [
                  trimmed.slice(0, 48) || "episode titles",
                  "apple podcasts search",
                  "spotify podcast seo",
                ],
        };
      })();
  const raw = normalizeTitleOptimization(
    {
      optimalTitle: pack.optimalTitle,
      boostPercentage,
      searchDemand: { level: "Medium", trend: "Stable" },
      comparison: { current, optimized },
      variants: pack.variants,
      suggestedKeywords: pack.suggestedKeywords,
      emotionalScore: 6,
    },
    trimmed,
  )!;
  return injectTitleAuditIntoResult(applyTitlePostProcessing(raw, trimmed, outputLanguage), trimmed, outputLanguage);
}

export async function fetchTitleOptimization(topic: string, outputLanguage: OutputLanguage = "en"): Promise<TitleOptimizationResult> {
  const trimmed = topic.trim();
  const fallback = (): TitleOptimizationResult => buildOfflineTitleResult(trimmed, outputLanguage);

  const enabled = process.env.OPENAI_ENABLED === "true";
  const key = openAiApiKey();
  if (!enabled || !key) {
    return fallback();
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  let res: Response;
  try {
    res = await fetch(openAiUrl("/chat/completions"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.42,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          { role: "user", content: buildUserPrompt(trimmed) },
        ],
      }),
    });
  } catch {
    return fallback();
  }

  let json: {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    error?: { message?: string };
  };
  try {
    json = (await res.json()) as typeof json;
  } catch {
    return fallback();
  }

  if (!res.ok) {
    if (process.env.OPENAI_LOG_USAGE === "true") {
      console.warn("[title-optimize openai error]", res.status, JSON.stringify(json?.error ?? json));
    }
    return fallback();
  }

  if (process.env.OPENAI_LOG_USAGE === "true") {
    console.info(
      "[title-optimize openai]",
      JSON.stringify({ model, usage: json.usage, ts: new Date().toISOString() }),
    );
    recordOpenAiUsage(json.usage);
  }

  const content = json.choices?.[0]?.message?.content ?? "";
  const parsed = jsonFromModel(content);
  let normalized = normalizeTitleOptimization(parsed, trimmed) ?? fallback();
  let signal: ListenNotesSignal | null = null;
  try {
    signal = await fetchListenNotesSignal(trimmed);
  } catch {
    signal = null;
  }
  if (signal) {
    normalized = {
      ...normalized,
      searchDemand: { level: signal.level, trend: signal.trend },
      suggestedKeywords:
        signal.suggestedKeywords.length > 0
          ? signal.suggestedKeywords
          : normalized.suggestedKeywords,
    };
  }

  // MVP hard lock: ensure English-only output while keeping zh path available for future rollout.
  if (outputLanguage === "en") {
    normalized = {
      ...normalized,
      optimalTitle: sanitizeEnglishText(normalized.optimalTitle),
      variants: normalized.variants.map((v) => ({
        ...v,
        title: sanitizeEnglishText(v.title),
      })),
      suggestedKeywords: normalized.suggestedKeywords
        .map((k) => sanitizeEnglishText(k))
        .filter(Boolean),
    };
  }

  return injectTitleAuditIntoResult(
    applyTitlePostProcessing(normalized, trimmed, outputLanguage),
    trimmed,
    outputLanguage,
  );
}
