/** Public pricing copy — keep in sync with Creem products. */
export const pricing = {
  free: {
    ipDailyLimit: 3,
    emailMonthlyLimit: 3,
    packHistoryLimit: 5,
    label: "Free",
  },
  pro: {
    monthlyUsd: 12,
    annualUsd: 99,
    firstMonthUsd: 1.9,
    annualBonusMonths: 2,
    annualEarlyBirdSlots: 50,
    label: "Pro",
  },
} as const;

export const proPerks = [
  "Unlimited SEO growth pack generations",
  "Unlimited pack history in Find my packs (free tier keeps last 5)",
  "Priority when daily free IP limits are busy",
  "Everything in free: structured show notes, article, FAQ, schema JSON-LD, social, SRT, schedule",
] as const;

export const freePerks = [
  `${pricing.free.ipDailyLimit} generations per day per IP`,
  `${pricing.free.emailMonthlyLimit} generations per month per email`,
  "Structured show notes, SEO article, FAQ (when grounded), social scripts",
  "BlogPosting + PodcastEpisode + FAQ JSON-LD copy",
  "Markdown & HTML download",
  "Email backup & pack recovery",
] as const;
