function envFlag(name: string) {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes";
}

/** Set RATE_LIMIT_DISABLED=true to skip email/IP limits (testing only). */
export function rateLimitsDisabled() {
  return envFlag("RATE_LIMIT_DISABLED");
}

export function ipDailyLimit() {
  if (rateLimitsDisabled()) return 999_999;
  const raw = Number(process.env.FREE_IP_DAILY_LIMIT ?? "3");
  if (!Number.isFinite(raw) || raw < 1) return 3;
  return Math.floor(raw);
}

export function ipCooldownMs() {
  if (rateLimitsDisabled()) return 0;
  const raw = Number(process.env.FREE_IP_COOLDOWN_SEC ?? "60");
  if (!Number.isFinite(raw) || raw < 0) return 60_000;
  return Math.floor(raw) * 1000;
}
