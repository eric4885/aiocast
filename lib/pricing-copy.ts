import { pricing } from "@/lib/pricing";

/** Homepage hero — short trust line under CTA */
export const freeHeroTagline = `${pricing.free.ipDailyLimit} free packs per day · No credit card required`;

/** Growth pack tool — limits bullet */
export const freeLimitsToolLine = `Per email: ${pricing.free.emailMonthlyLimit} free runs per month · Per IP: ${pricing.free.ipDailyLimit} per day`;

/** Help / FAQ — limits paragraph */
export function freeLimitsHelpLine(): string {
  return `${pricing.free.emailMonthlyLimit} runs per email per calendar month (when an email is provided), ${pricing.free.ipDailyLimit} per IP per day`;
}

/** Guide / Pro upsell — free tier summary */
export function freeTierProMention(): string {
  return `The free tier includes ${pricing.free.ipDailyLimit} runs per IP per day and ${pricing.free.emailMonthlyLimit} per email per month`;
}

/** Pro pricing card — free tier one-liner */
export function freeTierPricingLine(): string {
  return `${pricing.free.ipDailyLimit} packs / day per IP · ${pricing.free.emailMonthlyLimit} / month per email · last ${pricing.free.packHistoryLimit} saved packs`;
}

export const aiDraftDisclaimer =
  "Outputs are AI drafts — edit before publishing on your site. We do not train models on your content.";

export const newsletterHeading = "One podcast SEO tip per week";

export const newsletterBlurb =
  "Template updates, workflow tips, and new free tools — one email per week. Unsubscribe anytime.";
