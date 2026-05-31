export const SUBSCRIBE_SOURCES = [
  "footer",
  "editing_stack",
  "audio_checker",
  "rss_early_access",
  "preflight_checklist",
] as const;

export type SubscribeSource = (typeof SUBSCRIBE_SOURCES)[number];

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidSubscribeEmail(email: unknown): email is string {
  return typeof email === "string" && email.length <= 254 && EMAIL_RE.test(email);
}

export function isSubscribeSource(s: unknown): s is SubscribeSource {
  return typeof s === "string" && SUBSCRIBE_SOURCES.includes(s as SubscribeSource);
}

export function publicSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (!raw) return "https://aiocast.com";
  if (raw.startsWith("http")) return raw.replace(/\/$/, "");
  return `https://${raw.replace(/\/$/, "")}`;
}
