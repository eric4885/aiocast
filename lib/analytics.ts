/** GA4 events — only fire after cookie banner "Accept analytics". */

const STORAGE_KEY = "aiocast_cookie_choice_v2";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

function analyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "analytics";
  } catch {
    return false;
  }
}

/** @see https://developers.google.com/analytics/devguides/collection/ga4/events */
export function trackEvent(eventName: string, params?: AnalyticsParams): void {
  if (!analyticsAllowed()) return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  const clean: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) clean[k] = v;
    }
  }
  gtag("event", eventName, clean);
}

export const AnalyticsEvents = {
  titleIdeasSubmit: "title_ideas_submit",
  titleIdeasSuccess: "title_ideas_success",
  titleIdeasCopy: "title_ideas_copy",
  titleIdeasRegenerate: "title_ideas_regenerate",
  generatePackStart: "generate_pack_start",
  generatePackSuccess: "generate_pack_success",
  packEmailBackup: "pack_email_backup",
  ctaClick: "cta_click",
} as const;
