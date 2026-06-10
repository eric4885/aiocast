import { randomBytes, randomUUID } from "crypto";
import {
  getJsonField,
  setJsonField,
  withSnapshot,
  type EmailPackEntry,
} from "@/lib/persistent-backend";
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
  /** Set when generationSource is template — safe to show the user. */
  aiFailureReason?: string;
  /** True when AI article mostly copies the submitted transcript. */
  articleEchoesSource?: boolean;
  /** True when non-English input was translated to English before generation. */
  transcriptTranslated?: boolean;
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
  if (rateLimitsDisabled()) return 999_999;
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

const MAX_PACKS_PER_EMAIL = 20;
const MY_PACKS_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export type { EmailPackEntry };

export async function indexPackForEmail(
  email: string,
  entry: { id: string; accessToken: string; title?: string; createdAt?: number },
) {
  const key = email.trim().toLowerCase();
  if (!key.includes("@")) return;

  await withSnapshot((snapshot) => {
    const list = snapshot.emailPackIndex[key] ?? [];
    const next = list.filter((pack) => pack.id !== entry.id);
    next.unshift({
      id: entry.id,
      accessToken: entry.accessToken,
      title: entry.title?.trim() || "SEO growth pack",
      createdAt: entry.createdAt ?? Date.now(),
    });
    snapshot.emailPackIndex[key] = next.slice(0, MAX_PACKS_PER_EMAIL);
  });
}

export async function createMyPacksAccessToken(email: string): Promise<string> {
  const token = randomBytes(24).toString("hex");
  const key = email.trim().toLowerCase();

  await withSnapshot((snapshot) => {
    snapshot.myPacksTokens[token] = {
      email: key,
      expiresAt: Date.now() + MY_PACKS_TOKEN_TTL_MS,
    };
  });

  return token;
}

export async function getPacksForMyPacksToken(
  token: string,
): Promise<{ email: string; packs: EmailPackEntry[] } | null> {
  return withSnapshot((snapshot) => {
    const record = snapshot.myPacksTokens[token];
    if (!record || record.expiresAt < Date.now()) {
      if (record) delete snapshot.myPacksTokens[token];
      return null;
    }
    return {
      email: record.email,
      packs: snapshot.emailPackIndex[record.email] ?? [],
    };
  });
}

export async function markUnsubscribed(email: string) {
  const key = email.trim().toLowerCase();
  if (!key.includes("@")) return;
  await withSnapshot((snapshot) => {
    snapshot.unsubscribed[key] = Date.now();
  });
}

export async function clearUnsubscribed(email: string) {
  const key = email.trim().toLowerCase();
  if (!key.includes("@")) return;
  await withSnapshot((snapshot) => {
    delete snapshot.unsubscribed[key];
  });
}

export async function isUnsubscribed(email: string): Promise<boolean> {
  const key = email.trim().toLowerCase();
  return withSnapshot((snapshot) => Boolean(snapshot.unsubscribed[key]));
}
