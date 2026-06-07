import { pollApimartTask, extractTaskId } from "@/lib/apimart-task";
import { openAiApiKey, openAiUrl } from "@/lib/openai-config";
import { parseOpenAiJson, readResponseText } from "@/lib/openai-response";
import { sanitizePublicError } from "@/lib/public-error-message";

const MAX_BYTES = 10 * 1024 * 1024;

type TranscriptionJson = {
  text?: string;
  error?: { message?: string };
};

export function transcribeEnabled() {
  if (process.env.TRANSCRIBE_ENABLED === "false") return false;
  return Boolean(openAiApiKey());
}

export function assertAudioUpload(file: File) {
  if (file.size <= 0) {
    throw new Error("Upload a non-empty audio file.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Audio must be under 10 MB on the free plan.");
  }
  const type = file.type.toLowerCase();
  if (type && !type.startsWith("audio/") && type !== "application/octet-stream") {
    throw new Error("Upload an audio file (MP3, WAV, M4A, etc.).");
  }
}

function textFromTranscriptionPayload(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (!trimmed.startsWith("{") && !trimmed.includes("data:")) {
    return trimmed;
  }

  const parsed = parseOpenAiJson<TranscriptionJson>(trimmed);
  if (parsed.error?.message) {
    throw new Error(sanitizePublicError(parsed.error.message));
  }
  if (typeof parsed.text === "string" && parsed.text.trim()) {
    return parsed.text.trim();
  }

  return "";
}

export async function transcribeAudioFile(file: File): Promise<string> {
  assertAudioUpload(file);

  const key = openAiApiKey();
  if (!key) {
    throw new Error("Audio transcription is not configured on the server.");
  }

  const model = process.env.OPENAI_TRANSCRIBE_MODEL?.trim() || "whisper-1";
  const form = new FormData();
  form.append("file", file, file.name || "episode.mp3");
  form.append("model", model);
  form.append("response_format", "json");
  form.append("language", "en");

  const res = await fetch(openAiUrl("/audio/transcriptions"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
    body: form,
  });

  const raw = await readResponseText(res);

  if (!res.ok) {
    let detail = raw;
    try {
      const json = parseOpenAiJson<{ error?: { message?: string } }>(raw);
      detail = json.error?.message ?? raw;
    } catch {
      /* use raw */
    }
    throw new Error(
      sanitizePublicError(detail || `Transcription failed (HTTP ${res.status}).`),
    );
  }

  const directText = textFromTranscriptionPayload(raw);
  if (directText) return directText;

  const taskId = extractTaskId(raw);
  if (taskId) {
    return pollApimartTask(taskId);
  }

  throw new Error("Transcription returned empty text. Try a clearer clip or paste show notes.");
}
