function envFlag(name: string) {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes";
}

function envPositiveInt(name: string, fallback: number): number {
  const raw = Number(process.env[name] ?? String(fallback));
  if (!Number.isFinite(raw) || raw < 1) return fallback;
  return Math.floor(raw);
}

/** Set RATE_LIMIT_DISABLED=true to skip email/IP limits (testing only). */
export function rateLimitsDisabled() {
  return envFlag("RATE_LIMIT_DISABLED");
}

export function ipDailyLimit() {
  if (rateLimitsDisabled()) return 999_999;
  return envPositiveInt("FREE_IP_DAILY_LIMIT", 3);
}

export function ipCooldownMs() {
  if (rateLimitsDisabled()) return 0;
  const raw = Number(process.env.FREE_IP_COOLDOWN_SEC ?? "60");
  if (!Number.isFinite(raw) || raw < 0) return 60_000;
  return Math.floor(raw) * 1000;
}

/** Title optimizer — lighter than full pack, still burns model credits. */
export function titleIpDailyLimit() {
  if (rateLimitsDisabled()) return 999_999;
  return envPositiveInt("TITLE_IP_DAILY_LIMIT", 20);
}

export function titleIpCooldownMs() {
  if (rateLimitsDisabled()) return 0;
  const raw = Number(process.env.TITLE_IP_COOLDOWN_SEC ?? "15");
  if (!Number.isFinite(raw) || raw < 0) return 15_000;
  return Math.floor(raw) * 1000;
}

/**
 * Global ceiling on billable AI ops per UTC day (generate / title / transcribe).
 * Set AI_DAILY_BUDGET=0 to disable the global cap (IP limits still apply).
 */
export function aiDailyBudget(): number | null {
  if (rateLimitsDisabled()) return null;
  const raw = process.env.AI_DAILY_BUDGET?.trim();
  if (raw === undefined || raw === "") return 200;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.floor(n);
}
