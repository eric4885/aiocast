import { openAiApiKey, openAiUrl } from "@/lib/openai-config";
import { outputLanguageRule } from "@/lib/output-language";
import { chatCompletionContent, parseOpenAiJson, readResponseText } from "@/lib/openai-response";

const CJK_RE = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;

export function containsCjk(text: string): boolean {
  return CJK_RE.test(text);
}

export function englishOutputRequired(): boolean {
  const lang = process.env.TITLE_OUTPUT_LANGUAGE?.trim().toLowerCase() || "en";
  return lang === "en" || lang.startsWith("en-");
}

/** Strip CJK characters as a last-resort fallback when translation is unavailable. */
export function stripCjk(text: string): string {
  return text
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function ensureEnglishTranscript(raw: string): Promise<{
  text: string;
  wasTranslated: boolean;
  originalHadCjk: boolean;
}> {
  const trimmed = raw.trim();
  const originalHadCjk = containsCjk(trimmed);

  if (!trimmed || !englishOutputRequired() || !originalHadCjk) {
    return { text: trimmed, wasTranslated: false, originalHadCjk };
  }

  const key = openAiApiKey();
  if (!key || process.env.OPENAI_ENABLED?.trim().toLowerCase() !== "true") {
    const stripped = stripCjk(trimmed);
    return {
      text: stripped || trimmed,
      wasTranslated: stripped !== trimmed,
      originalHadCjk,
    };
  }

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
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `${outputLanguageRule()} Return only the translated transcript text — no JSON, no commentary.`,
          },
          {
            role: "user",
            content: `Translate this podcast transcript or show notes into natural English. Preserve meaning, names, and structure (paragraph breaks). Do not add new content.\n\n${trimmed.slice(0, 12000)}`,
          },
        ],
      }),
    });

    const body = await readResponseText(res);
    if (!res.ok) {
      const stripped = stripCjk(trimmed);
      return { text: stripped || trimmed, wasTranslated: stripped !== trimmed, originalHadCjk };
    }

    const json = parseOpenAiJson<{ choices?: Array<{ message?: { content?: string } }> }>(body);
    const translated = chatCompletionContent(json)?.trim();
    if (translated && !containsCjk(translated)) {
      return { text: translated, wasTranslated: true, originalHadCjk };
    }

    const stripped = stripCjk(translated || trimmed);
    return { text: stripped || trimmed, wasTranslated: true, originalHadCjk };
  } catch {
    const stripped = stripCjk(trimmed);
    return { text: stripped || trimmed, wasTranslated: stripped !== trimmed, originalHadCjk };
  }
}
