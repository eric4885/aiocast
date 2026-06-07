import { ensureEnglishTranscript } from "@/lib/ensure-english-transcript";
import { extractTaskId, pollApimartTask } from "@/lib/apimart-task";
import { dayKey, type GeneratedPack } from "@/lib/mvp-store";
import { openAiApiKey, openAiUrl } from "@/lib/openai-config";
import { outputLanguageRule } from "@/lib/output-language";
import { chatCompletionContent, parseOpenAiJson, readResponseText } from "@/lib/openai-response";
import {
  articleEchoesTranscript,
  highlightsFromTranscript,
  srtFromTranscript,
} from "@/lib/transcript-segments";

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

  const prompt = `
Return strict JSON with keys:
title, metaDescription, keywords (array of 5), articleBody, faq (array of 3 objects {q,a}), socialX, socialLinkedIn, socialSubstack, schedule (array of 7 short lines), seoReport ({targetKeyword,altTitle,altDescription,estimatedTrafficHint})

Rules:
- ${outputLanguageRule()}
- articleBody: a FULL publishable SEO blog post in Markdown (800–1200 words) with ## section headers. Expand and rewrite ideas from the transcript into fresh editorial prose for Google search. Do NOT paste or lightly paraphrase the transcript — every section must be newly written. The opening paragraph must use completely different wording from the transcript's first two sentences. Do NOT write a short recap or bullet summary.
- socialX: ready-to-post tweet text (≤280 chars). Plain text only — NO profile URLs, NO "https://" links, NO placeholders like yourpodcast.
- socialLinkedIn: ready-to-post LinkedIn post (2–4 short paragraphs). Plain text only — NO URLs unless quoting a specific fact from the episode.
- socialSubstack: ready-to-post newsletter intro (150–400 words). Plain text only — NO placeholder links.
- schedule: 7 lines tied to THIS episode's topics, not generic "publish episode" filler.
- faq: 3 Q&A pairs grounded in the transcript.

Context transcript:
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
                `You are an SEO content operator for podcasters. ${outputLanguageRule()} Return valid JSON only. Produce professional marketing copy only: no harassment, hate, illegal instructions, or explicit sexual content.`,
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

function defaultFaq() {
  return [
    {
      q: "How can podcasters rank on Google faster?",
      a: "Publish intent-structured long-form articles from each episode, then support them with FAQ blocks and internal links.",
    },
    {
      q: "What content should I post after publishing an episode?",
      a: "Use a script matrix per channel: one X hook thread, one LinkedIn insight post, and one newsletter takeaway.",
    },
    {
      q: "Do I need a team to run podcast SEO?",
      a: "No. A repeatable weekly workflow plus templates can produce consistent growth assets solo.",
    },
  ];
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
      "Early stage topics in this cluster often reach 200-800 monthly impressions within 4-8 weeks.",
  };
}

function normalizeFaq(raw: unknown) {
  if (!Array.isArray(raw)) return defaultFaq();
  const items = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const q = String(row.q ?? row.question ?? "").trim();
      const a = String(row.a ?? row.answer ?? "").trim();
      if (!q) return null;
      return { q, a: a || `Answer ${index + 1}` };
    })
    .filter((item): item is { q: string; a: string } => item !== null);
  return items.length > 0 ? items.slice(0, 3) : defaultFaq();
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
  const aiResult = await generateWithOpenAI(transcript);
  const ai = aiResult.data;
  const usedAi = Boolean(ai && (ai.articleBody || ai.title));
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
  const articleBodyRaw = aiStr("articleBody");
  const articleEchoesSource =
    Boolean(articleBodyRaw) && articleEchoesTranscript(articleBodyRaw!, transcript);

  return {
    id: "",
    createdAt: now,
    sourceType: input.sourceType,
    sourceLabel: input.sourceLabel,
    transcript,
    seoArticle: {
      title,
      metaDescription,
      keywords,
      body:
        articleBodyRaw ??
        `## Executive Summary\n${transcript}\n\n## Why Most Podcast Episodes Underperform\nMost episodes are published once and forgotten.\n\n## Build an AIO-Ready Content Loop\nTurn each episode into a long-form article, three FAQ answers, and a script matrix.\n\n## Execution Framework\nShip article first, then social distribution within 24 hours.\n`,
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
    generationSource: usedAi ? "ai" : "template",
    aiFailureReason: usedAi ? undefined : aiResult.failureReason,
    articleEchoesSource: articleEchoesSource || undefined,
    transcriptTranslated: normalized.wasTranslated || undefined,
  };
}

