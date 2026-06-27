/** Session handoff from homepage textarea → SEO growth pack tool. */
export const TRANSCRIPT_PREFILL_KEY = "aiocast_transcript_prefill_v1";

export function saveTranscriptPrefill(text: string): void {
  if (typeof window === "undefined") return;
  try {
    if (text.trim()) {
      sessionStorage.setItem(TRANSCRIPT_PREFILL_KEY, text);
    } else {
      sessionStorage.removeItem(TRANSCRIPT_PREFILL_KEY);
    }
  } catch {
    /* private browsing / quota */
  }
}

export function consumeTranscriptPrefill(): string {
  if (typeof window === "undefined") return "";
  try {
    const value = sessionStorage.getItem(TRANSCRIPT_PREFILL_KEY) ?? "";
    sessionStorage.removeItem(TRANSCRIPT_PREFILL_KEY);
    return value;
  } catch {
    return "";
  }
}
