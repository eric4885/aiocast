import { ensureEnglishTranscript } from "@/lib/ensure-english-transcript";
import { extractTaskId, pollApimartTask } from "@/lib/apimart-task";
import { dayKey, type GeneratedPack } from "@/lib/mvp-store";
import { openAiApiKey, openAiUrl } from "@/lib/openai-config";
import { outputLanguageRule } from "@/lib/output-language";
import { chatCompletionContent, parseOpenAiJson, readResponseText } from "@/lib/openai-response";
import {
  articleNeedsDistinctRewrite,
  highlightsFromTranscript,
  srtFromTranscript,
} from "@/lib/transcript-segments";
import {
  defaultShowNotesClean,
  normalizeShowNotesClean,
  sourceHasTimecodes,
  wordCount,
} from "@/lib/show-notes-clean";

declare global {
  // eslint-disable-next-line no-var
  var __openai_daily_metrics__: {
    day: string;
    requests: number;
    promptTokens: number;
    completionTokens: number;
  } | undefined;
}

export function recordOpenAiUsage(usage?: { prompt_tokens?: number; completion_tokens?: number }) {
  if (process.env.OPENAI_LOG_USAGE !== "true") return;
  const today = dayKey();
  let m = global.__openai_daily_metrics__;
  if (!m || m.day !== today) {
    m = { day: today, requests: 0, promptTokens: 0, completionTokens: 0 };
  }
  m.requests += 1;
  m.promptTokens += usage?.prompt_tokens ?? 0;
  m.completionTokens += usage?.completion_tokens ?? 0;
  global.__openai_daily_metrics__ = m;
  console.info("[openai metrics UTC day]", JSON.stringify(m));
}

type Input = {
  sourceType: "audio" | "transcript" | "url";
  sourceLabel: string;
  transcriptHint?: string;
};

function fallbackTranscript(sourceLabel: string) {
  return `This episode discusses practical podcast growth strategy: turning one conversation into a search-ready article, FAQ blocks, and channel-native promotion scripts. Source: ${sourceLabel}.`;
}

function isPlaceholderSocial(text: string): boolean {
  const t = text.trim();
  if (!t || t.length < 24) return true;
  if (/^https?:\/\/\S+$/i.test(t)) return true;
  if (/^(https?:\/\/\S+\s*){1,3}$/i.test(t)) return true;
  if (/yourpodcast|example\.com|placeholder|yourhandle|yourchannel/i.test(t)) return true;
  return false;
}

function socialFromTranscript(transcript: string) {
  const flat = transcript.replace(/\s+/g, " ").trim();
  const hook = flat.slice(0, 240).trim();
  const detail = flat.slice(0, 900).trim();

  return {
    x:
      (hook.length > 220 ? `${hook.slice(0, 217)}…` : hook) +
      "\n\nWhat stood out to you in this episode?",
    linkedIn:
      `From our latest episode:\n\n${detail.length > 850 ? `${detail.slice(0, 847)}…` : detail}\n\n` +
      "What's your take? Drop a comment below.",
    substack:
      `This week on the show:\n\n${detail.length > 700 ? `${detail.slice(0, 697)}…` : detail}\n\n` +
      "Read the full SEO article draft in your growth pack.",
  };
}

function jsonFromModel(raw: string) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function generateWithOpenAI(transcript: string): Promise<{
  data: Record<string, unknown> | null;
  failureReason?: string;
}> {
  const enabled = process.env.OPENAI_ENABLED?.trim().toLowerCase() === "true";
  const key = openAiApiKey();
  if (!enabled) {
    return { data: null, failureReason: "OPENAI_ENABLED is not true on the server." };
  }
  if (!key) {
    return { data: null, failureReason: "OPENAI_API_KEY secret is missing on the server." };
  }

  const allowTimecodes = sourceHasTimecodes(transcript);

  const prompt = `
Return strict JSON with keys:
title, metaDescription, keywords (array of 5), articleBody, faq (array of 3 objects {q,a}), socialX, socialLinkedIn, socialSubstack, schedule (array of 7 short lines), seoReport ({targetKeyword,altTitle,altDescription,estimatedTrafficHint}), showNotesClean ({summary, chapters:[{title,timestamp,summary}], resources:[{name,kind,url,note}], quotes:[{text,speaker,timestamp,condensed}], platformBlurbs:{apple,spotify,website}, suggestedQuestions: string[]})

Evidence-first rules (hard):
- ${outputLanguageRule()}
- ONLY use facts, names, books, tools, prices, dates, stats, and URLs that appear in the source transcript/notes below. Do NOT invent people, links, numbers, or events.
- Timestamps: ${allowTimecodes ? "Source contains timecodes — you may copy MM:SS / HH:MM:SS that appear in the source. Do not invent new times." : "Source has NO timecodes — set every timestamp field to null. Use chapter titles only. NEVER invent timestamps."}
- URLs: only if the exact URL string appears in the source; otherwise set url to "" and note "Mentioned without a URL in source — add manually."
- Quotes: prefer verbatim; if shortened set condensed=true and keep a timestamp only when present in source.
- FAQ: answers must be grounded in the source. If there is no real Q&A material, return faq as [] and fill suggestedQuestions (3–5) for the author instead — do NOT invent FAQ answers.
- Medical, legal, or investment conclusions: add that the listener should consult a professional; do not state absolute advice as fact.

articleBody:
- FULL publishable SEO blog post in Markdown (900–1300 words) for Google search — NOT a podcast script cleanup.
- Cover EVERY major theme from the source. Do NOT mirror transcript headings or section order.
- Required: ## Who this is for, ## Key takeaways (bullets), 4–6 fresh topic sections, ## Conclusion.
- Fresh editorial prose; opening must not reuse any sentence from the source's first 150 words.

showNotesClean:
- summary: 100–180 words; first sentence should include a searchable topic phrase from the episode; no invented stats.
- chapters: 6–12 items; each title is an action-oriented label (not "Discussion continues"); timestamp null when unknown.
- resources: books/tools/people mentioned; split by kind; no guessed URLs.
- quotes: 3–5 max when source supports them.
- platformBlurbs.apple: short (~1–2 sentences); spotify: medium; website: longer episode blurb for the host's site.

socialX / socialLinkedIn / socialSubstack: plain text only — no placeholder URLs.
schedule: 7 lines tied to THIS episode's topics.
seoReport.estimatedTrafficHint: one editorial angle sentence — NO traffic numbers or ranking promises.

Context transcript/notes:
${transcript.slice(0, 8000)}
`;

  const primaryModel = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const models = primaryModel === "gpt-4o" ? [primaryModel] : [primaryModel, "gpt-4o"];

  for (const model of models) {
    try {
      const res = await fetch(openAiUrl("/chat/completions"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          stream: false,
          temperature: 0.4,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                `You are an SEO content operator for podcasters. ${outputLanguageRule()} Return valid JSON only. Never invent facts, URLs, or timestamps not present in the user source. Produce professional marketing copy only: no harassment, hate, illegal instructions, or explicit sexual content.`,
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      const raw = await readResponseText(res);

      if (!res.ok) {
        const taskId = extractTaskId(raw);
        if (taskId) {
          try {
            const polled = await pollApimartTask(taskId);
            const parsed = jsonFromModel(polled);
            if (parsed) return { data: parsed };
          } catch (pollError) {
            const msg = pollError instanceof Error ? pollError.message : "Task polling failed";
            console.error("[openai generate poll]", model, msg);
            return { data: null, failureReason: msg };
          }
        }
        let detail = raw.slice(0, 200);
        try {
          const errJson = parseOpenAiJson<{ error?: { message?: string } }>(raw);
          detail = errJson.error?.message ?? detail;
        } catch {
          /* use raw snippet */
        }
        console.error("[openai generate] HTTP", res.status, model, detail);
        if (model !== models[models.length - 1]) continue;
        return { data: null, failureReason: detail || `APImart HTTP ${res.status}` };
      }

      let json: {
        choices?: Array<{ message?: { content?: string } }>;
        error?: { message?: string };
      };

      try {
        json = parseOpenAiJson(raw);
      } catch {
        const taskId = extractTaskId(raw);
        if (taskId) {
          try {
            const polled = await pollApimartTask(taskId);
            const parsed = jsonFromModel(polled);
            if (parsed) return { data: parsed };
          } catch (pollError) {
            const msg = pollError instanceof Error ? pollError.message : "Task polling failed";
            return { data: null, failureReason: msg };
          }
        }
        if (model !== models[models.length - 1]) continue;
        return { data: null, failureReason: "Unexpected APImart response format." };
      }

      const content = chatCompletionContent(json);
      if (content) {
        const parsed = jsonFromModel(content);
        if (parsed) return { data: parsed };
      }

      const taskId = extractTaskId(raw);
      if (taskId) {
        try {
          const polled = await pollApimartTask(taskId);
          const parsed = jsonFromModel(polled);
          if (parsed) return { data: parsed };
        } catch (pollError) {
          const msg = pollError instanceof Error ? pollError.message : "Task polling failed";
          return { data: null, failureReason: msg };
        }
      }

      if (model !== models[models.length - 1]) continue;
      return { data: null, failureReason: "APImart returned empty content." };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Generation request failed";
      console.error("[openai generate error]", model, msg);
      if (model !== models[models.length - 1]) continue;
      return { data: null, failureReason: msg };
    }
  }

  return { data: null, failureReason: "All configured models failed." };
}

async function rewriteDistinctArticle(
  transcript: string,
  draft: string,
  title: string,
): Promise<string | null> {
  const key = openAiApiKey();
  if (!key || process.env.OPENAI_ENABLED?.trim().toLowerCase() !== "true") return null;

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  try {
    const res = await fetch(openAiUrl("/chat/completions"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        stream: false,
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content: `You are an SEO editor. ${outputLanguageRule()} Return ONLY Markdown for the article body — no JSON, no commentary.`,
          },
          {
            role: "user",
            content: `Rewrite this draft into a distinct SEO blog post (900–1300 words).

Hard rules:
- Cover ALL major themes from the source transcript. If ethics, privacy, or labor are discussed, add a dedicated ## section — do not omit chapters.
- Use NEW section titles (must not match transcript headings like "Chapter 1" or "Introduction: The Pace of Change").
- Do NOT follow the transcript section order. Reorganize for a reader searching on Google.
- Include ## Who this is for, ## Key takeaways (bullets), 4–6 fresh topic sections, ## Conclusion.
- No podcast script tone. No recap-by-abbreviation.

Article title: ${title}

Source transcript (themes to cover):
${transcript.slice(0, 10000)}

Draft to replace (too similar to transcript):
${draft.slice(0, 6000)}`,
          },
        ],
      }),
    });

    const raw = await readResponseText(res);
    if (!res.ok) return null;

    const json = parseOpenAiJson<{ choices?: Array<{ message?: { content?: string } }> }>(raw);
    const body = chatCompletionContent(json)?.trim();
    return body && body.length > 400 ? body : null;
  } catch {
    return null;
  }
}

function defaultSchedule() {
  return [
    "Mon 09:00 local: Publish long-form SEO article",
    "Tue 11:00 local: Publish FAQ snippet post",
    "Wed 13:00 local: Post X thread version",
    "Thu 10:00 local: Publish LinkedIn deep post",
    "Fri 15:00 local: Send Substack summary",
    "Sat 12:00 local: Republish highlight quote card",
    "Sun 20:00 local: Review performance and pick next topic",
  ];
}


function defaultSeoReport() {
  return {
    targetKeyword: "podcast seo workflow",
    altTitle: "Podcast SEO Workflow: From Audio to Search Traffic",
    altDescription: "A step-by-step loop to convert podcast episodes into discoverable content assets.",
    estimatedTrafficHint:
      "Frame around a specific listener problem and one concrete outcome — avoid generic 'podcast tips' phrasing.",
  };
}

function normalizeFaq(raw: unknown) {
  if (!Array.isArray(raw)) return [] as Array<{ q: string; a: string }>;
  const items = raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const q = String(row.q ?? row.question ?? "").trim();
      const a = String(row.a ?? row.answer ?? "").trim();
      // Require both question and answer grounded — never invent "Answer N".
      if (!q || !a) return null;
      return { q, a };
    })
    .filter((item): item is { q: string; a: string } => item !== null);
  return items.slice(0, 6);
}

function normalizeSchedule(raw: unknown) {
  if (!Array.isArray(raw)) return defaultSchedule();
  const items = raw.map((line) => String(line).trim()).filter(Boolean);
  return items.length > 0 ? items.slice(0, 7) : defaultSchedule();
}

function normalizeSeoReport(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return defaultSeoReport();
  const row = raw as Record<string, unknown>;
  const fallback = defaultSeoReport();
  return {
    targetKeyword: String(row.targetKeyword ?? fallback.targetKeyword),
    altTitle: String(row.altTitle ?? fallback.altTitle),
    altDescription: String(row.altDescription ?? fallback.altDescription),
    estimatedTrafficHint: String(row.estimatedTrafficHint ?? fallback.estimatedTrafficHint),
  };
}

export async function buildPack(input: Input): Promise<GeneratedPack> {
  const rawTranscript = input.transcriptHint?.trim() || fallbackTranscript(input.sourceLabel);
  const normalized = await ensureEnglishTranscript(rawTranscript);
  const transcript = normalized.text;
  const words = wordCount(transcript);
  const inputTooShort = words < 80;

  // Thin pastes: structure show notes from template; skip full AI blog inventiveness.
  const aiResult = inputTooShort
    ? {
        data: null as Record<string, unknown> | null,
        failureReason:
          "Source is under ~80 words. Paste more show notes or a longer transcript for a full SEO blog — template pack returned instead.",
      }
    : await generateWithOpenAI(transcript);
  const ai = aiResult.data;
  const usedAi = Boolean(ai && (ai.articleBody || ai.title || ai.showNotesClean));
  const now = new Date().toISOString();
  const aiStr = (key: string) => {
    const v = ai?.[key];
    return typeof v === "string" ? v : undefined;
  };

  const title =
    aiStr("title") ??
    "How to Turn One Podcast Episode Into a Weekly SEO Growth Pipeline";
  const metaDescription =
    aiStr("metaDescription") ??
    "Convert one podcast episode into a searchable long-form article, FAQ blocks, and a multi-platform social script pack.";
  const keywords = Array.isArray(ai?.keywords)
    ? ai.keywords.map((k) => String(k)).slice(0, 5)
    : ["podcast SEO", "audio to article", "FAQ snippets", "social scripts", "content repurposing"];

  const faq = normalizeFaq(ai?.faq);

  const schedule = normalizeSchedule(ai?.schedule);

  const socialFallback = socialFromTranscript(transcript);
  const pickSocial = (key: string, fallback: string) => {
    const raw = aiStr(key);
    return raw && !isPlaceholderSocial(raw) ? raw : fallback;
  };

  const highlights = highlightsFromTranscript(transcript, input.sourceType);
  const srt = srtFromTranscript(transcript, input.sourceType);

  let articleBody =
    aiStr("articleBody") ??
    `## Executive Summary\n${transcript}\n\n## Why Most Podcast Episodes Underperform\nMost episodes are published once and forgotten.\n\n## Build an AIO-Ready Content Loop\nTurn each episode into a long-form article, three FAQ answers, and a script matrix.\n\n## Execution Framework\nShip article first, then social distribution within 24 hours.\n`;

  if (inputTooShort) {
    articleBody = `## Short source — expand before publishing\n\nYour paste was only about ${words} words. Use the **Show notes clean** block below as a template, then paste a fuller transcript or outline and regenerate for a complete SEO article.\n\n## What you pasted\n\n${transcript.slice(0, 2000)}\n`;
  }

  if (!inputTooShort && aiStr("articleBody") && articleNeedsDistinctRewrite(articleBody, transcript)) {
    const rewritten = await rewriteDistinctArticle(transcript, articleBody, title);
    if (rewritten) articleBody = rewritten;
  }

  const articleEchoesSource =
    !inputTooShort && Boolean(aiStr("articleBody")) && articleNeedsDistinctRewrite(articleBody, transcript);

  const showNotesClean = ai?.showNotesClean
    ? normalizeShowNotesClean(ai.showNotesClean, transcript)
    : defaultShowNotesClean(transcript);

  return {
    id: "",
    createdAt: now,
    sourceType: input.sourceType,
    sourceLabel: input.sourceLabel,
    transcript,
    seoArticle: {
      title: inputTooShort ? "Expand your notes — then regenerate the SEO pack" : title,
      metaDescription: inputTooShort
        ? "Your paste was too short for a full blog draft. Add more show notes or transcript text and run generate again."
        : metaDescription,
      keywords,
      body: articleBody,
    },
    faq,
    socialPack: {
      x: pickSocial("socialX", socialFallback.x),
      linkedIn: pickSocial("socialLinkedIn", socialFallback.linkedIn),
      substack: pickSocial("socialSubstack", socialFallback.substack),
    },
    localSchedule: schedule,
    srt,
    highlights,
    seoReport: normalizeSeoReport(ai?.seoReport),
    showNotesClean,
    generationSource: usedAi ? "ai" : "template",
    aiFailureReason: usedAi ? undefined : aiResult.failureReason,
    articleEchoesSource: articleEchoesSource || undefined,
    transcriptTranslated: normalized.wasTranslated || undefined,
    inputTooShort: inputTooShort || undefined,
  };
}

