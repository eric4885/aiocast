import { randomBytes, randomUUID } from "crypto";
import { getJsonField, setJsonField, withSnapshot } from "@/lib/persistent-backend";
import { checkIpRateLimit, type IpGuardResult } from "@/lib/rate-limit";
import { ipCooldownMs, ipDailyLimit, rateLimitsDisabled } from "@/lib/rate-limit-config";

export type { IpGuardResult };

type JobStatus = "processing" | "done" | "failed";

export type GeneratedPack = {
  id: string;
  createdAt: string;
  sourceType: "audio" | "transcript" | "url";
  sourceLabel: string;
  transcript: string;
  seoArticle: {
    title: string;
    metaDescription: string;
    keywords: string[];
    body: string;
  };
  faq: Array<{ q: string; a: string }>;
  socialPack: {
    x: string;
    linkedIn: string;
    substack: string;
  };
  localSchedule: string[];
  srt: string;
  highlights: Array<{ title: string; start: string; end: string; note: string }>;
  seoReport: {
    targetKeyword: string;
    altTitle: string;
    altDescription: string;
    estimatedTrafficHint: string;
  };
  /** Whether content came from the AI model or the built-in template fallback. */
  generationSource?: "ai" | "template";
};

export type JobRecord = {
  id: string;
  email: string;
  accessToken: string;
  status: JobStatus;
  createdAt: number;
  error?: string;
  pack?: GeneratedPack;
};

export type PublicJobRecord = Omit<JobRecord, "email" | "accessToken">;

export function monthKey(now = new Date()) {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function dayKey(now = new Date()) {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(
    now.getUTCDate(),
  ).padStart(2, "0")}`;
}

export function freeLimit() {
  const raw = Number(process.env.FREE_MONTHLY_LIMIT ?? "3");
  if (!Number.isFinite(raw) || raw < 1) return 3;
  return Math.floor(raw);
}

export function toPublicJob(job: JobRecord): PublicJobRecord {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip private fields
  const { email, accessToken, ...rest } = job;
  void email;
  void accessToken;
  return rest;
}

export async function checkAndConsumeUsage(email: string) {
  const limit = freeLimit();
  if (rateLimitsDisabled()) {
    return { allowed: true, used: 0, limit };
  }

  const key = email.trim().toLowerCase();
  const currentMonth = monthKey();

  return withSnapshot((snapshot) => {
    const current = snapshot.usage[key];
    if (!current || current.month !== currentMonth) {
      snapshot.usage[key] = { month: currentMonth, used: 1 };
      return { allowed: true, used: 1, limit };
    }
    if (current.used >= limit) {
      return { allowed: false, used: current.used, limit };
    }
    current.used += 1;
    snapshot.usage[key] = current;
    return { allowed: true, used: current.used, limit };
  });
}

export async function checkIpGuards(ip: string): Promise<IpGuardResult> {
  if (rateLimitsDisabled()) {
    return { allowed: true, code: "OK", used: 0, dailyLimit: ipDailyLimit() };
  }
  return checkIpRateLimit({
    ip,
    cooldownMs: ipCooldownMs(),
    dailyLimit: ipDailyLimit(),
    usageKey: "ipUsage",
    lastKey: "ipLastSubmit",
  });
}

export async function checkSubscribeIpGuards(ip: string): Promise<IpGuardResult> {
  return checkIpRateLimit({
    ip,
    cooldownMs: 30_000,
    dailyLimit: 20,
    usageKey: "subscribeIpUsage",
    lastKey: "subscribeIpLast",
  });
}

export async function createJob(email: string): Promise<JobRecord> {
  const job: JobRecord = {
    id: randomUUID(),
    accessToken: randomBytes(24).toString("hex"),
    email: email.trim().toLowerCase(),
    status: "processing",
    createdAt: Date.now(),
  };
  await setJsonField(job.id, job);
  return job;
}

export async function setJobDone(id: string, pack: GeneratedPack) {
  const current = await getJsonField<JobRecord>(id);
  if (!current) return;
  await setJsonField(id, { ...current, status: "done", pack });
}

export async function setJobFailed(id: string, error: string) {
  const current = await getJsonField<JobRecord>(id);
  if (!current) return;
  await setJsonField(id, { ...current, status: "failed", error });
}

export async function getJob(id: string): Promise<JobRecord | null> {
  return getJsonField<JobRecord>(id);
}

export async function getJobIfAuthorized(
  id: string,
  token: string | null,
): Promise<PublicJobRecord | null> {
  const job = await getJob(id);
  if (!job) return null;
  if (!token || token !== job.accessToken) return null;
  return toPublicJob(job);
}

export function resultPath(id: string, accessToken: string) {
  return `/results/${id}?token=${encodeURIComponent(accessToken)}`;
}
