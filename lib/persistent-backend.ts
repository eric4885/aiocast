import { Redis } from "@upstash/redis";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type UsageBucket = { month: string; used: number };
export type DailyIpUsage = { day: string; used: number };

export type PersistedSnapshot = {
  jobs: Record<string, string>;
  usage: Record<string, UsageBucket>;
  ipUsage: Record<string, DailyIpUsage>;
  ipLastSubmit: Record<string, number>;
  subscribeIpUsage: Record<string, DailyIpUsage>;
  subscribeIpLast: Record<string, number>;
};

const REDIS_KEY = "aiocast:v1:snapshot";
const FILE_PATH = path.join(process.cwd(), ".data", "aiocast-store.json");

let redisClient: Redis | null | undefined;
let memorySnapshot: PersistedSnapshot | null = null;
let fileLoadPromise: Promise<PersistedSnapshot> | null = null;

function emptySnapshot(): PersistedSnapshot {
  return {
    jobs: {},
    usage: {},
    ipUsage: {},
    ipLastSubmit: {},
    subscribeIpUsage: {},
    subscribeIpLast: {},
  };
}

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    redisClient = null;
    return null;
  }
  redisClient = new Redis({ url, token });
  return redisClient;
}

export function persistenceMode(): "redis" | "file" | "memory" {
  if (getRedis()) return "redis";
  if (process.env.NODE_ENV === "production") return "file";
  return "memory";
}

export function warnIfEphemeralProduction() {
  if (process.env.NODE_ENV !== "production") return;
  if (getRedis()) return;
  console.warn(
    "[aiocast] Production without UPSTASH_REDIS_REST_URL — using file store (.data/). " +
      "For Vercel/serverless, set Upstash Redis env vars.",
  );
}

async function loadFromFile(): Promise<PersistedSnapshot> {
  try {
    const raw = await readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as PersistedSnapshot;
    return { ...emptySnapshot(), ...parsed };
  } catch {
    return emptySnapshot();
  }
}

async function saveToFile(snapshot: PersistedSnapshot): Promise<void> {
  await mkdir(path.dirname(FILE_PATH), { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify(snapshot), "utf8");
}

async function loadSnapshot(): Promise<PersistedSnapshot> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<PersistedSnapshot>(REDIS_KEY);
    return data ? { ...emptySnapshot(), ...data } : emptySnapshot();
  }

  if (process.env.NODE_ENV !== "production") {
    if (!memorySnapshot) memorySnapshot = emptySnapshot();
    return memorySnapshot;
  }

  if (!fileLoadPromise) {
    fileLoadPromise = loadFromFile();
  }
  return fileLoadPromise;
}

async function saveSnapshot(snapshot: PersistedSnapshot): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, snapshot);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    memorySnapshot = snapshot;
    return;
  }

  await saveToFile(snapshot);
  fileLoadPromise = Promise.resolve(snapshot);
}

export async function withSnapshot<T>(
  mutate: (snapshot: PersistedSnapshot) => T | Promise<T>,
): Promise<T> {
  const snapshot = await loadSnapshot();
  const result = await mutate(snapshot);
  await saveSnapshot(snapshot);
  return result;
}

export async function getJsonField<T>(jobId: string): Promise<T | null> {
  const snapshot = await loadSnapshot();
  const raw = snapshot.jobs[jobId];
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJsonField(jobId: string, value: unknown): Promise<void> {
  await withSnapshot((snapshot) => {
    snapshot.jobs[jobId] = JSON.stringify(value);
  });
}
