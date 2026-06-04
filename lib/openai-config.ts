const DEFAULT_BASE = "https://api.openai.com/v1";

export function openAiApiKey() {
  return process.env.OPENAI_API_KEY?.trim() ?? "";
}

/** Base URL ending in /v1, e.g. https://api.openai.com/v1 or your relay endpoint. */
export function openAiBaseUrl() {
  const raw = process.env.OPENAI_BASE_URL?.trim() || DEFAULT_BASE;
  return raw.replace(/\/+$/, "");
}

export function openAiUrl(path: string) {
  const base = openAiBaseUrl();
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
