import { dayKey } from "@/lib/mvp-store";
import { withSnapshot, type DailyIpUsage } from "@/lib/persistent-backend";

type IpGuardOk = {
  allowed: true;
  code: "OK";
  used: number;
  dailyLimit: number;
};

type IpGuardCooldown = {
  allowed: false;
  code: "IP_COOLDOWN";
  retryAfterSec: number;
  dailyLimit: number;
};

type IpGuardDaily = {
  allowed: false;
  code: "IP_DAILY_LIMIT";
  used: number;
  dailyLimit: number;
};

export type IpGuardResult = IpGuardOk | IpGuardCooldown | IpGuardDaily;

type RateLimitOpts = {
  ip: string;
  cooldownMs: number;
  dailyLimit: number;
  usageKey: "ipUsage" | "subscribeIpUsage";
  lastKey: "ipLastSubmit" | "subscribeIpLast";
};

export async function checkIpRateLimit(opts: RateLimitOpts): Promise<IpGuardResult> {
  const normalized = opts.ip.trim() || "unknown";
  const now = Date.now();
  const day = dayKey();

  return withSnapshot((snapshot) => {
    const usageMap = snapshot[opts.usageKey];
    const lastMap = snapshot[opts.lastKey];

    const last = lastMap[normalized];
    if (last && now - last < opts.cooldownMs) {
      return {
        allowed: false as const,
        code: "IP_COOLDOWN" as const,
        retryAfterSec: Math.ceil((opts.cooldownMs - (now - last)) / 1000),
        dailyLimit: opts.dailyLimit,
      };
    }

    const current: DailyIpUsage | undefined = usageMap[normalized];
    if (!current || current.day !== day) {
      usageMap[normalized] = { day, used: 1 };
      lastMap[normalized] = now;
      return { allowed: true as const, code: "OK" as const, used: 1, dailyLimit: opts.dailyLimit };
    }

    if (current.used >= opts.dailyLimit) {
      return {
        allowed: false as const,
        code: "IP_DAILY_LIMIT" as const,
        used: current.used,
        dailyLimit: opts.dailyLimit,
      };
    }

    current.used += 1;
    usageMap[normalized] = current;
    lastMap[normalized] = now;
    return { allowed: true as const, code: "OK" as const, used: current.used, dailyLimit: opts.dailyLimit };
  });
}
