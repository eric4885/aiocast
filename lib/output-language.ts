/** Shared output language rule for AI prompts (server-side). */
export function outputLanguageRule(): string {
  const lang = process.env.TITLE_OUTPUT_LANGUAGE?.trim().toLowerCase() || "en";
  if (lang === "en") {
    return "Write ALL generated text in English only. Never output Chinese or other languages.";
  }
  return `Write ALL generated text in ${lang}.`;
}
