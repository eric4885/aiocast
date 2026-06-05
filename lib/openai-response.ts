type ChatCompletionJson = {
  choices?: Array<{ message?: { content?: string }; delta?: { content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  error?: { message?: string };
  text?: string;
};

export async function readResponseText(res: Response): Promise<string> {
  return res.text();
}

function parseSsePayload(raw: string): ChatCompletionJson | null {
  if (!raw.includes("data:")) return null;

  const contentParts: string[] = [];
  let lastObject: ChatCompletionJson | null = null;

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const payload = trimmed.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;

    try {
      const parsed = JSON.parse(payload) as ChatCompletionJson;
      lastObject = parsed;
      if (parsed.error?.message) {
        throw new Error(parsed.error.message);
      }
      const delta = parsed.choices?.[0]?.delta?.content;
      const message = parsed.choices?.[0]?.message?.content;
      if (typeof delta === "string") contentParts.push(delta);
      if (typeof message === "string") contentParts.push(message);
      if (typeof parsed.text === "string") contentParts.push(parsed.text);
    } catch (error) {
      if (error instanceof Error && !error.message.startsWith("Unexpected")) throw error;
    }
  }

  if (contentParts.length > 0) {
    return { choices: [{ message: { content: contentParts.join("") } }] };
  }

  return lastObject;
}

export function parseOpenAiJson<T>(raw: string): T {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Empty API response.");
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed) as T;
  }

  const sse = parseSsePayload(trimmed);
  if (sse) return sse as T;

  throw new Error(`Unexpected API response format: ${trimmed.slice(0, 120)}`);
}

export async function parseOpenAiResponse<T>(res: Response): Promise<T> {
  const raw = await readResponseText(res);
  return parseOpenAiJson<T>(raw);
}

export function parseTranscriptionText(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (!trimmed.startsWith("{") && !trimmed.includes("data:")) {
    return trimmed;
  }

  try {
    const parsed = parseOpenAiJson<ChatCompletionJson & { text?: string }>(trimmed);
    if (typeof parsed.text === "string" && parsed.text.trim()) {
      return parsed.text.trim();
    }
    const fromChoice = parsed.choices?.[0]?.message?.content;
    if (typeof fromChoice === "string" && fromChoice.trim()) {
      return fromChoice.trim();
    }
  } catch {
    /* fall through */
  }

  if (trimmed.includes('"id"') && trimmed.includes("data:")) {
    throw new Error(
      "Transcription provider returned an async task instead of text. Try again or paste show notes.",
    );
  }

  return trimmed;
}

export function chatCompletionContent(json: ChatCompletionJson): string {
  return json.choices?.[0]?.message?.content ?? "";
}

export function chatCompletionError(json: ChatCompletionJson): string | undefined {
  return json.error?.message;
}
