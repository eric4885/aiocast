/** Redact secrets and map provider errors to safe user-facing copy. */
export function sanitizePublicError(message: string): string {
  const redacted = message
    .replace(/sk-[A-Za-z0-9_-]{8,}/g, "sk-***")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer ***");

  const lower = redacted.toLowerCase();

  if (
    lower.includes("incorrect api key") ||
    lower.includes("invalid api key") ||
    lower.includes("invalid authentication") ||
    lower.includes("authentication") && lower.includes("api key")
  ) {
    return "AI service is not configured correctly on the server. Try pasting show notes instead of uploading audio, or contact support.";
  }

  if (lower.includes("insufficient_quota") || lower.includes("exceeded your current quota")) {
    return "AI service quota exceeded. Try again later or paste show notes to use the template fallback.";
  }

  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "AI service is busy. Please wait a minute and try again.";
  }

  if (lower.includes("model") && (lower.includes("not found") || lower.includes("does not exist"))) {
    return "AI model is misconfigured on the server. Try pasting show notes or contact support.";
  }

  return redacted;
}

export function toPublicApiError(error: unknown, fallback: string): string {
  const raw = error instanceof Error ? error.message : fallback;
  console.error("[public-api-error]", raw);
  const sanitized = sanitizePublicError(raw);
  if (sanitized !== raw) return sanitized;
  if (raw.length > 200 || /https?:\/\//i.test(raw)) {
    return fallback;
  }
  return sanitized;
}
