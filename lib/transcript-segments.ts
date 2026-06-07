export type TranscriptSourceType = "audio" | "transcript" | "url";

export function splitTranscriptSegments(transcript: string): string[] {
  const trimmed = transcript.trim();
  if (!trimmed) return [];

  const byLine = trimmed
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 8);

  if (byLine.length >= 2) return byLine;

  const block = byLine.length === 1 ? byLine[0] : trimmed;

  const bySentence = block
    .split(/(?<=[.!?。！？])\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 8);

  if (bySentence.length >= 1) return bySentence;

  const flat = block.replace(/\s+/g, " ").trim();
  if (!flat) return [];

  const segments: string[] = [];
  for (let i = 0; i < flat.length; i += 160) {
    const chunk = flat.slice(i, i + 160).trim();
    if (chunk.length >= 8) segments.push(chunk);
  }
  return segments.length > 0 ? segments : [flat];
}

function formatSrtTimestamp(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},000`;
}

function formatClockTimestamp(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function srtFromTranscript(transcript: string, sourceType: TranscriptSourceType = "transcript") {
  const sentences = splitTranscriptSegments(transcript).slice(0, 60);
  if (sentences.length === 0) return "";

  const secondsPerLine = sourceType === "audio" ? 5 : 4;

  return sentences
    .map((text, i) => {
      const start = i * secondsPerLine;
      const end = start + secondsPerLine - 1;
      return `${i + 1}\n${formatSrtTimestamp(start)} --> ${formatSrtTimestamp(end)}\n${text}\n`;
    })
    .join("\n");
}

export type TranscriptHighlight = {
  title: string;
  start: string;
  end: string;
  note: string;
};

export function highlightsFromTranscript(
  transcript: string,
  sourceType: TranscriptSourceType = "transcript",
): TranscriptHighlight[] {
  const segments = splitTranscriptSegments(transcript);
  if (segments.length === 0) return [];

  const secondsPerSegment = sourceType === "audio" ? 45 : 30;
  const pickIndices =
    segments.length === 1 ? [0] : [0, Math.min(segments.length - 1, Math.floor(segments.length / 2))];

  return Array.from(new Set(pickIndices))
    .slice(0, 2)
    .map((idx) => {
      const text = segments[idx];
      const titleWords = text.split(/\s+/).slice(0, 6).join(" ");
      const start = idx * secondsPerSegment;
      const end = start + secondsPerSegment;
      return {
        title: titleWords.length > 48 ? `${titleWords.slice(0, 48)}…` : titleWords || "Highlight",
        start: formatClockTimestamp(start),
        end: formatClockTimestamp(end),
        note: text.length > 160 ? `${text.slice(0, 160)}…` : text,
      };
    });
}

/** Rough overlap check — flags when SEO article mostly echoes the transcript. */
export function articleEchoesTranscript(articleBody: string, transcript: string): boolean {
  const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
  const article = normalize(articleBody);
  const source = normalize(transcript);
  if (!article || !source || source.length < 80) return false;

  const probe = source.slice(0, Math.min(120, source.length));
  if (probe.length >= 40 && article.includes(probe)) return true;

  const articleWords = new Set(article.split(/\s+/).filter((w) => w.length > 3));
  const sourceWords = source.split(/\s+/).filter((w) => w.length > 3);
  if (sourceWords.length < 20) return false;

  let overlap = 0;
  for (const w of sourceWords) {
    if (articleWords.has(w)) overlap += 1;
  }
  return overlap / sourceWords.length > 0.72;
}
