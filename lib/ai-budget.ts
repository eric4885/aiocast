import { dayKey } from "@/lib/mvp-store";
import { withSnapshot } from "@/lib/persistent-backend";
import { aiDailyBudget } from "@/lib/rate-limit-config";

export type AiBudgetResult =
  | { allowed: true; used: number; limit: number | null }
  | { allowed: false; used: number; limit: number; code: "AI_DAILY_BUDGET" };

/**
 * Reserve one (or more) billable AI ops against the global UTC-day ceiling.
 * No-op when AI_DAILY_BUDGET is unset/disabled or rate limits are off.
 */
export async function consumeAiBudget(units = 1): Promise<AiBudgetResult> {
  const limit = aiDailyBudget();
  if (limit === null) {
    return { allowed: true, used: 0, limit: null };
  }

  const day = dayKey();
  const need = Math.max(1, Math.floor(units));

  return withSnapshot((snapshot) => {
    const current = snapshot.aiDaily;
    if (!current || current.day !== day) {
      if (need > limit) {
        snapshot.aiDaily = { day, used: 0 };
        return { allowed: false as const, used: 0, limit, code: "AI_DAILY_BUDGET" as const };
      }
      snapshot.aiDaily = { day, used: need };
      return { allowed: true as const, used: need, limit };
    }

    if (current.used + need > limit) {
      return {
        allowed: false as const,
        used: current.used,
        limit,
        code: "AI_DAILY_BUDGET" as const,
      };
    }

    current.used += need;
    snapshot.aiDaily = current;
    return { allowed: true as const, used: current.used, limit };
  });
}

export function aiBudgetExceededMessage(limit: number): string {
  return `Site-wide AI capacity for today is full (${limit} ops). Please try again tomorrow.`;
}
