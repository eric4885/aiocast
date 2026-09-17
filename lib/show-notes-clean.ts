/** Structured show-notes block inside a publish-ready pack (downstream only). */

export type ShowNotesChapter = {
  title: string;
  /** MM:SS or HH:MM:SS when present in source; null when unknown — never invent. */
  timestamp: string | null;
  summary: string;
};

export type ShowNotesResource = {
  name: string;
  kind: string;
  /** Exact URL from source, or empty when mentioned without a link. */
  url: string;
  note: string;
};

export type ShowNotesQuote = {
  text: string;
  speaker: string;
  timestamp: string | null;
  /** True when the model shortened a longer quote. */
  condensed?: boolean;
};

export type ShowNotesPlatformBlurbs = {
  apple: string;
  spotify: string;
  website: string;
};

export type ShowNotesClean = {
  summary: string;
  chapters: ShowNotesChapter[];
  resources: ShowNotesResource[];
  quotes: ShowNotesQuote[];
  platformBlurbs: ShowNotesPlatformBlurbs;
  /** Questions the host should answer on-page when FAQ cannot be grounded. */
  suggestedQuestions?: string[];
};

const TIMECODE_RE = /\b(?:\d{1,2}:)?\d{1,2}:\d{2}\b/;

export function sourceHasTimecodes(source: string): boolean {
  return TIMECODE_RE.test(source);
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function defaultShowNotesClean(transcript: string): ShowNotesClean {
  const flat = transcript.replace(/\s+/g, " ").trim();
  const summary =
    flat.length > 0
      ? flat.slice(0, 700).trim() + (flat.length > 700 ? "…" : "")
      : "Paste a longer transcript or show notes to generate a structured summary.";

  const chapters: ShowNotesChapter[] = [
    {
      title: "Episode overview",
      timestamp: null,
      summary: "Key themes from your pasted notes or transcript — edit titles to match your episode.",
    },
    {
      title: "Takeaways for listeners",
      timestamp: null,
      summary: "List concrete actions or lessons mentioned in the source text.",
    },
  ];

  return {
    summary: summary.slice(0, 1200),
    chapters,
    resources: [
      {
        name: "Links mentioned in the episode",
        kind: "misc",
        url: "",
        note: "Mentioned without a URL in source — add manually before publish.",
      },
    ],
    quotes: [],
    platformBlurbs: {
      apple: flat.slice(0, 180).trim() || "Short Apple Podcasts description — edit before publish.",
      spotify: flat.slice(0, 320).trim() || "Spotify episode description — edit before publish.",
      website: flat.slice(0, 600).trim() || "Longer website episode blurb — edit before publish.",
    },
    suggestedQuestions: [
      "What problem does this episode help the listener solve?",
      "What is one actionable step from this episode?",
    ],
  };
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeTimestamp(raw: unknown, allowTimecodes: boolean): string | null {
  if (!allowTimecodes) return null;
  const t = asString(raw);
  if (!t) return null;
  if (!TIMECODE_RE.test(t)) return null;
  const match = t.match(TIMECODE_RE);
  return match ? match[0] : null;
}

export function normalizeShowNotesClean(
  raw: unknown,
  sourceText: string,
): ShowNotesClean {
  const allowTimecodes = sourceHasTimecodes(sourceText);
  const fallback = defaultShowNotesClean(sourceText);

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback;
  const row = raw as Record<string, unknown>;

  const chaptersRaw = Array.isArray(row.chapters) ? row.chapters : [];
  const chapters = chaptersRaw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const c = item as Record<string, unknown>;
      const title = asString(c.title ?? c.name);
      if (!title) return null;
      return {
        title,
        timestamp: normalizeTimestamp(c.timestamp ?? c.time ?? c.timecode, allowTimecodes),
        summary: asString(c.summary ?? c.description ?? c.action, "See source notes."),
      };
    })
    .filter((item): item is ShowNotesChapter => item !== null)
    .slice(0, 14);

  const resourcesRaw = Array.isArray(row.resources) ? row.resources : [];
  const resources = resourcesRaw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const r = item as Record<string, unknown>;
      const name = asString(r.name ?? r.title);
      if (!name) return null;
      const url = asString(r.url ?? r.link);
      const urlInSource = url ? sourceText.includes(url) : false;
      return {
        name,
        kind: asString(r.kind ?? r.type, "mention"),
        url: url && urlInSource ? url : "",
        note:
          url && !urlInSource
            ? "Mentioned without a matching URL in source — add manually."
            : asString(r.note, url ? "" : "Mentioned without a URL in source — add manually."),
      };
    })
    .filter((item): item is ShowNotesResource => item !== null)
    .slice(0, 20);

  const quotesRaw = Array.isArray(row.quotes) ? row.quotes : [];
  const quotes = quotesRaw
    .map((item): ShowNotesQuote | null => {
      if (!item || typeof item !== "object") return null;
      const q = item as Record<string, unknown>;
      const text = asString(q.text ?? q.quote);
      if (!text) return null;
      const quote: ShowNotesQuote = {
        text,
        speaker: asString(q.speaker ?? q.who, "Speaker"),
        timestamp: normalizeTimestamp(q.timestamp ?? q.time, allowTimecodes),
      };
      if (q.condensed === true) quote.condensed = true;
      return quote;
    })
    .filter((item): item is ShowNotesQuote => item !== null)
    .slice(0, 5);

  const blurbs =
    row.platformBlurbs && typeof row.platformBlurbs === "object" && !Array.isArray(row.platformBlurbs)
      ? (row.platformBlurbs as Record<string, unknown>)
      : {};

  const suggested = Array.isArray(row.suggestedQuestions)
    ? row.suggestedQuestions.map((q) => asString(q)).filter(Boolean).slice(0, 6)
    : fallback.suggestedQuestions;

  return {
    summary: asString(row.summary, fallback.summary).slice(0, 1400) || fallback.summary,
    chapters: chapters.length > 0 ? chapters : fallback.chapters,
    resources: resources.length > 0 ? resources : fallback.resources,
    quotes,
    platformBlurbs: {
      apple: asString(blurbs.apple, fallback.platformBlurbs.apple).slice(0, 400),
      spotify: asString(blurbs.spotify, fallback.platformBlurbs.spotify).slice(0, 600),
      website: asString(blurbs.website, fallback.platformBlurbs.website).slice(0, 1200),
    },
    suggestedQuestions: suggested,
  };
}

export type ValidationFlag = {
  level: "yellow" | "gray" | "blue" | "red";
  message: string;
};

/** Client-side checks against the source transcript/notes. */
export function validateShowNotesAgainstSource(
  notes: ShowNotesClean,
  sourceText: string,
): ValidationFlag[] {
  const flags: ValidationFlag[] = [];
  const hasCodes = sourceHasTimecodes(sourceText);
  const outputCodes = [
    ...notes.chapters.map((c) => c.timestamp),
    ...notes.quotes.map((q) => q.timestamp),
  ].filter(Boolean) as string[];

  if (!hasCodes && outputCodes.length >= 3) {
    flags.push({
      level: "gray",
      message: "Source has no timecodes, but several timestamps appear — treat as estimates and verify against audio.",
    });
  }

  for (const r of notes.resources) {
    if (r.url && !sourceText.includes(r.url)) {
      flags.push({
        level: "yellow",
        message: `URL not found in source: ${r.url}`,
      });
    }
  }

  const numberRe = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?%?|\$\d+(?:,\d{3})*(?:\.\d+)?|\b20\d{2}\b/g;
  const sourceNums = new Set((sourceText.match(numberRe) ?? []).map((n) => n.toLowerCase()));
  const blob = [
    notes.summary,
    ...notes.chapters.map((c) => c.summary),
    ...notes.quotes.map((q) => q.text),
    notes.platformBlurbs.website,
  ].join(" ");
  const outNums = blob.match(numberRe) ?? [];
  const missing = Array.from(new Set(outNums.map((n) => n.toLowerCase()))).filter(
    (n) => !sourceNums.has(n),
  );
  if (missing.length > 0) {
    flags.push({
      level: "blue",
      message: `Numbers to verify (not clearly in source): ${missing.slice(0, 6).join(", ")}`,
    });
  }

  if (notes.platformBlurbs.apple.length > 280) {
    flags.push({
      level: "red",
      message: "Apple short blurb is over ~280 characters — trim before paste into Apple Podcasts.",
    });
  }

  if (wordCount(notes.summary) > 200) {
    flags.push({
      level: "red",
      message: "Show-notes summary is over ~200 words — trim for platform descriptions.",
    });
  }

  return flags;
}

export function showNotesToMarkdown(notes: ShowNotesClean): string {
  const lines: string[] = ["## Episode summary", "", notes.summary, "", "## Chapters", ""];
  for (const c of notes.chapters) {
    const t = c.timestamp ? `[${c.timestamp}] ` : "";
    lines.push(`- ${t}**${c.title}** — ${c.summary}`);
  }
  lines.push("", "## Resources", "");
  for (const r of notes.resources) {
    const link = r.url ? ` — ${r.url}` : "";
    const note = r.note ? ` (${r.note})` : "";
    lines.push(`- ${r.name} [${r.kind}]${link}${note}`);
  }
  if (notes.quotes.length > 0) {
    lines.push("", "## Quotes", "");
    for (const q of notes.quotes) {
      const t = q.timestamp ? ` (${q.timestamp})` : "";
      const tag = q.condensed ? " [condensed]" : "";
      lines.push(`- “${q.text}” — ${q.speaker}${t}${tag}`);
    }
  }
  lines.push(
    "",
    "## Platform blurbs",
    "",
    `### Apple (short)`,
    notes.platformBlurbs.apple,
    "",
    `### Spotify (medium)`,
    notes.platformBlurbs.spotify,
    "",
    `### Website (long)`,
    notes.platformBlurbs.website,
  );
  if (notes.suggestedQuestions && notes.suggestedQuestions.length > 0) {
    lines.push("", "## Suggested FAQ questions for the author", "");
    for (const q of notes.suggestedQuestions) lines.push(`- ${q}`);
  }
  return lines.join("\n");
}

/** Lightweight audit of pasted notes/transcript (no RSS crawl). */
export type NotesAuditItem = {
  id: string;
  ok: boolean;
  label: string;
  hint: string;
};

export function auditPastedNotes(sourceText: string, episodeTitle?: string): NotesAuditItem[] {
  const words = wordCount(sourceText);
  const hasTime = sourceHasTimecodes(sourceText);
  const hasUrl = /https?:\/\/\S+/i.test(sourceText);
  const hasQa =
    /\?/.test(sourceText) &&
    /(answer|because|here's|here is|we recommend|you should)/i.test(sourceText);

  const title = (episodeTitle ?? "").trim();
  const titleItems: NotesAuditItem[] = [];
  if (title) {
    if (title.length > 60) {
      const start = Math.max(0, 58);
      const end = Math.min(title.length, 66);
      const slice = title.slice(start, end);
      titleItems.push({
        id: "title-apple",
        ok: false,
        label: `Apple truncation risk (${title.length} chars)`,
        hint: `⚠️ Chars ${start + 1}–${end} may be cut: “${slice}”. Move the main keyword earlier and keep the Apple title ≤60 characters.`,
      });
    } else {
      titleItems.push({
        id: "title-apple",
        ok: true,
        label: `Title length OK for Apple window (${title.length}/60)`,
        hint: "Under the common ~60-character Apple search/list truncation line.",
      });
    }
    if (title.length > 70) {
      titleItems.push({
        id: "title-spotify",
        ok: false,
        label: `Spotify list truncation risk (${title.length} chars)`,
        hint: "Spotify list rows often clip around ~70 characters — shorten or front-load the searchable phrase.",
      });
    }
  }

  return [
    ...titleItems,
    {
      id: "length",
      ok: words >= 80,
      label: words >= 80 ? `Source length OK (${words} words)` : `Source thin (${words} words)`,
      hint:
        words >= 80
          ? "Enough text to structure show notes and a draft."
          : "Aim for 80+ words of notes or a partial transcript before generating a full blog.",
    },
    {
      id: "timecodes",
      ok: hasTime,
      label: hasTime ? "Timecodes detected" : "No timecodes in source",
      hint: hasTime
        ? "Chapters can keep MM:SS from your paste."
        : "We will use chapter titles only — we will not invent timestamps.",
    },
    {
      id: "links",
      ok: hasUrl,
      label: hasUrl ? "URLs found in source" : "No URLs in source",
      hint: hasUrl
        ? "Resource links can be copied when they match the text exactly."
        : "Add guest/site links manually — we will not invent URLs.",
    },
    {
      id: "faq-signal",
      ok: hasQa,
      label: hasQa ? "Q&A-like content detected" : "Little Q&A signal",
      hint: hasQa
        ? "FAQ answers can be grounded in the source."
        : "Expect suggested questions for you to answer — we will not invent FAQ facts.",
    },
    {
      id: "schema",
      ok: false,
      label: "PodcastEpisode / FAQPage schema not on your live page yet",
      hint: "After you publish, paste JSON-LD from this results page into your CMS.",
    },
  ];
}
