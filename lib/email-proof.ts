import { randomBytes } from "crypto";
import { withSnapshot } from "@/lib/persistent-backend";

/** HttpOnly cookie proving the browser owns this email (Pro unlock + status). */
export const EMAIL_PROOF_COOKIE = "aiocast_email_proof";

/** 30 days — long enough for Pro users without becoming forever. */
export const EMAIL_PROOF_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type EmailProofRecord = {
  email: string;
  expiresAt: number;
};

export function parseCookieHeader(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey === name) {
      const value = rest.join("=").trim();
      return value ? decodeURIComponent(value) : null;
    }
  }
  return null;
}

export function getEmailProofTokenFromRequest(req: Request): string | null {
  const fromCookie = parseCookieHeader(req.headers.get("cookie"), EMAIL_PROOF_COOKIE);
  if (fromCookie) return fromCookie;
  const { searchParams } = new URL(req.url);
  const fromQuery = searchParams.get("proof")?.trim();
  return fromQuery || null;
}

export async function createEmailProofToken(email: string): Promise<string> {
  const key = email.trim().toLowerCase();
  const token = randomBytes(24).toString("hex");
  await withSnapshot((snapshot) => {
    snapshot.emailProofTokens[token] = {
      email: key,
      expiresAt: Date.now() + EMAIL_PROOF_TTL_MS,
    };
  });
  return token;
}

export async function getEmailProof(token: string | null | undefined): Promise<EmailProofRecord | null> {
  if (!token?.trim()) return null;
  const t = token.trim();
  return withSnapshot((snapshot) => {
    const record = snapshot.emailProofTokens[t];
    if (!record) return null;
    if (record.expiresAt < Date.now()) {
      delete snapshot.emailProofTokens[t];
      return null;
    }
    return record;
  });
}

/** True when proof token is valid and bound to this email. */
export async function emailProofMatches(
  email: string | null | undefined,
  token: string | null | undefined,
): Promise<boolean> {
  if (!email?.trim() || !token?.trim()) return false;
  const record = await getEmailProof(token);
  if (!record) return false;
  return record.email === email.trim().toLowerCase();
}

export function emailProofCookieOptions(maxAgeSec = Math.floor(EMAIL_PROOF_TTL_MS / 1000)) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}
