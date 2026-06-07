/** Set RATE_LIMIT_DISABLED=true to skip email/IP limits (testing only). */
export function rateLimitsDisabled() {
  return process.env.RATE_LIMIT_DISABLED === "true";
}

export function ipDailyLimit() {
  const raw = Number(process.env.FREE_IP_DAILY_LIMIT ?? "3");
  if (!Number.isFinite(raw) || raw < 1) return 3;
  return Math.floor(raw);
}

export function ipCooldownMs() {
  const raw = Number(process.env.FREE_IP_COOLDOWN_SEC ?? "60");
  if (!Number.isFinite(raw) || raw < 0) return 60_000;
  return Math.floor(raw) * 1000;
}
