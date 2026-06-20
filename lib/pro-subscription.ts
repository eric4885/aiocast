import { withSnapshot } from "@/lib/persistent-backend";

export type ProPlan = "monthly" | "annual";

export type ProRecord = {
  status: "active" | "canceled" | "past_due";
  plan: ProPlan;
  currentPeriodEnd: number;
  creemCustomerId?: string;
  creemSubscriptionId?: string;
  /** First 50 annual subscribers get +2 months (14 months total). */
  earlyBird?: boolean;
  updatedAt: number;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function isProEmail(email: string): Promise<boolean> {
  const key = normalizeEmail(email);
  if (!key.includes("@")) return false;

  return withSnapshot((snapshot) => {
    const record = snapshot.proSubscribers[key];
    if (!record) return false;
    if (record.status !== "active") return false;
    return record.currentPeriodEnd > Date.now();
  });
}

export async function getProRecord(email: string): Promise<ProRecord | null> {
  const key = normalizeEmail(email);
  if (!key.includes("@")) return null;

  return withSnapshot((snapshot) => {
    const record = snapshot.proSubscribers[key];
    if (!record) return null;
    if (record.status !== "active" || record.currentPeriodEnd <= Date.now()) return null;
    return record;
  });
}

export async function setProActive(
  email: string,
  opts: {
    plan: ProPlan;
    currentPeriodEnd: number;
    creemCustomerId?: string;
    creemSubscriptionId?: string;
  },
) {
  const key = normalizeEmail(email);
  if (!key.includes("@")) return;

  await withSnapshot((snapshot) => {
    snapshot.proSubscribers[key] = {
      status: "active",
      plan: opts.plan,
      currentPeriodEnd: opts.currentPeriodEnd,
      creemCustomerId: opts.creemCustomerId,
      creemSubscriptionId: opts.creemSubscriptionId,
      updatedAt: Date.now(),
    };
  });
}

export async function setProCanceled(email: string) {
  const key = normalizeEmail(email);
  if (!key.includes("@")) return;

  await withSnapshot((snapshot) => {
    const current = snapshot.proSubscribers[key];
    if (!current) return;
    snapshot.proSubscribers[key] = {
      ...current,
      status: "canceled",
      updatedAt: Date.now(),
    };
  });
}

export async function setProBySubscriptionId(
  subscriptionId: string,
  patch: Partial<Pick<ProRecord, "status" | "currentPeriodEnd" | "plan">>,
): Promise<boolean> {
  return withSnapshot((snapshot) => {
    const entry = Object.entries(snapshot.proSubscribers).find(
      ([, record]) => record.creemSubscriptionId === subscriptionId,
    );
    if (!entry) return false;
    const [email, current] = entry;
    snapshot.proSubscribers[email] = {
      ...current,
      ...patch,
      updatedAt: Date.now(),
    };
    return true;
  });
}
