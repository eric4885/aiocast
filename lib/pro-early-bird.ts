import { pricing } from "@/lib/pricing";
import { withSnapshot } from "@/lib/persistent-backend";
import type { ProPlan, ProRecord } from "@/lib/pro-subscription";

const MS_PER_MONTH = Math.round((365.25 / 12) * 24 * 60 * 60 * 1000);

export function monthsFromNow(months: number): number {
  return Date.now() + months * MS_PER_MONTH;
}

export type ActivateProOpts = {
  plan: ProPlan;
  creemPeriodEnd: number;
  creemCustomerId?: string;
  creemSubscriptionId?: string;
};

export type ActivateProResult = {
  earlyBird: boolean;
  currentPeriodEnd: number;
  annualEarlyBirdRemaining: number;
};

/** Atomically activate Pro; grants 14-month Early Bird window for first 50 annual checkouts. */
export async function activateProWithEarlyBird(
  email: string,
  opts: ActivateProOpts,
): Promise<ActivateProResult> {
  const key = email.trim().toLowerCase();
  const limit = pricing.pro.annualEarlyBirdSlots;
  const bonusMonths = 12 + pricing.pro.annualBonusMonths;

  return withSnapshot((snapshot) => {
    const existing = snapshot.proSubscribers[key];
    let earlyBird = false;
    let periodEnd = opts.creemPeriodEnd;

    if (opts.plan === "annual") {
      if (existing?.earlyBird) {
        earlyBird = true;
        periodEnd = Math.max(opts.creemPeriodEnd, existing.currentPeriodEnd);
      } else if ((snapshot.annualEarlyBirdCount ?? 0) < limit) {
        snapshot.annualEarlyBirdCount = (snapshot.annualEarlyBirdCount ?? 0) + 1;
        earlyBird = true;
        periodEnd = monthsFromNow(bonusMonths);
      }
    }

    snapshot.proSubscribers[key] = {
      status: "active",
      plan: opts.plan,
      currentPeriodEnd: periodEnd,
      creemCustomerId: opts.creemCustomerId,
      creemSubscriptionId: opts.creemSubscriptionId,
      earlyBird: earlyBird || undefined,
      updatedAt: Date.now(),
    };

    const used = snapshot.annualEarlyBirdCount ?? 0;
    return {
      earlyBird,
      currentPeriodEnd: periodEnd,
      annualEarlyBirdRemaining: Math.max(0, limit - used),
    };
  });
}

export async function getAnnualEarlyBirdRemaining(): Promise<number> {
  return withSnapshot((snapshot) => {
    const used = snapshot.annualEarlyBirdCount ?? 0;
    return Math.max(0, pricing.pro.annualEarlyBirdSlots - used);
  });
}

export function proRecordForResponse(record: ProRecord) {
  return {
    pro: true,
    plan: record.plan,
    currentPeriodEnd: record.currentPeriodEnd,
    earlyBird: Boolean(record.earlyBird),
    expiresAt: new Date(record.currentPeriodEnd).toISOString(),
  };
}
