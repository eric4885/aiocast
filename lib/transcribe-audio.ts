import { openAiApiKey, openAiUrl } from "@/lib/openai-config";
import { chatCompletionContent, chatCompletionError, parseOpenAiJson, parseTranscriptionText, readResponseText } from "@/lib/openai-response";

const MAX_BYTES = 10 * 1024 * 1024;

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

export async function transcribeAudioFile(file: File): Promise<string> {
  assertAudioUpload(file);

  const key = openAiApiKey();
  if (!key) {
    throw new Error("Audio transcription is not configured on the server.");
  }

  const model = process.env.OPENAI_TRANSCRIBE_MODEL?.trim() || "gpt-4o-mini-transcribe";
  const form = new FormData();
  form.append("file", file, file.name || "episode.mp3");
  form.append("model", model);
  form.append("response_format", "text");

  const res = await fetch(openAiUrl("/audio/transcriptions"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
    },
    body: form,
  });

  if (!res.ok) {
    const raw = await readResponseText(res);
    let detail = raw;
    try {
      const json = parseOpenAiJson<{ error?: { message?: string } }>(raw);
      detail = json.error?.message ?? raw;
    } catch {
      /* use raw text */
    }
    throw new Error(detail || `Transcription failed (HTTP ${res.status}).`);
  }

  const text = parseTranscriptionText(await readResponseText(res));
  if (!text) {
    throw new Error("Transcription returned empty text. Try a clearer clip or paste show notes.");
  }
  return text;
}
