import { openAiApiKey, openAiUrl } from "@/lib/openai-config";
import { parseOpenAiJson, readResponseText } from "@/lib/openai-response";

type TaskEnvelope = {
  code?: number;
  data?: {
    id?: string;
    status?: string;
    error?: string | { message?: string };
    result?: unknown;
  };
  id?: string;
  status?: string;
  error?: string | { message?: string };
  result?: unknown;
  text?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function taskErrorMessage(error: unknown): string {
  if (typeof error === "string" && error.trim()) return error.trim();
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message.trim();
  }
  return "Task failed.";
}

export function extractTaskId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = parseOpenAiJson<TaskEnvelope>(trimmed);
    const id = parsed.data?.id ?? parsed.id;
    if (typeof id === "string" && id.length > 0) return id;
  } catch {
    const match = trimmed.match(/"id"\s*:\s*"(task[^"]+)"/i);
    if (match?.[1]) return match[1];
  }

  return null;
}

function textFromUnknown(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const nested = textFromUnknown(JSON.parse(trimmed) as unknown);
        if (nested) return nested;
      } catch {
        /* treat as plain text below */
      }
    }
    return trimmed;
  }

  if (!value || typeof value !== "object") return "";
  const row = value as Record<string, unknown>;

  if (typeof row.text === "string" && row.text.trim()) return row.text.trim();
  if (typeof row.transcript === "string" && row.transcript.trim()) return row.transcript.trim();

  const message = row.message;
  if (message && typeof message === "object") {
    const content = (message as Record<string, unknown>).content;
    if (typeof content === "string" && content.trim()) return content.trim();
  }

  if (Array.isArray(row.choices)) {
    for (const choice of row.choices) {
      if (!choice || typeof choice !== "object") continue;
      const msg = (choice as Record<string, unknown>).message;
      if (msg && typeof msg === "object") {
        const content = (msg as Record<string, unknown>).content;
        if (typeof content === "string" && content.trim()) return content.trim();
      }
    }
  }

  if (Array.isArray(row.segments)) {
    const joined = row.segments
      .map((segment) => {
        if (!segment || typeof segment !== "object") return "";
        return String((segment as Record<string, unknown>).text ?? "").trim();
      })
      .filter(Boolean)
      .join(" ");
    if (joined) return joined;
  }

  if (row.result) {
    const nested = textFromUnknown(row.result);
    if (nested) return nested;
  }

  if (row.data) {
    const nested = textFromUnknown(row.data);
    if (nested) return nested;
  }

  return "";
}

export async function pollApimartTask(taskId: string, maxWaitMs = 120_000): Promise<string> {
  const key = openAiApiKey();
  if (!key) throw new Error("Missing API key for task polling.");

  await sleep(3000);
  const started = Date.now();

  while (Date.now() - started < maxWaitMs) {
    const res = await fetch(openAiUrl(`/tasks/${encodeURIComponent(taskId)}`), {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
      cache: "no-store",
    });
    const raw = await readResponseText(res);

    if (!res.ok) {
      let detail = raw.slice(0, 200);
      try {
        const err = parseOpenAiJson<{ error?: { message?: string } }>(raw);
        detail = err.error?.message ?? detail;
      } catch {
        /* use raw snippet */
      }
      throw new Error(detail || `Task polling failed (HTTP ${res.status}).`);
    }

    const parsed = parseOpenAiJson<TaskEnvelope>(raw);
    const data = parsed.data ?? parsed;
    const status = String(data.status ?? "").toLowerCase();

    if (status === "failed" || status === "cancelled") {
      throw new Error(taskErrorMessage(data.error));
    }

    if (status === "completed") {
      const text = textFromUnknown(data.result ?? data);
      if (text) return text;
      throw new Error("Transcription task completed without text. Try again or paste show notes.");
    }

    await sleep(3000);
  }

  throw new Error("Transcription is taking longer than expected. Try again or paste show notes.");
}
