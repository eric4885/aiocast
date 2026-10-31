import { NextResponse } from "next/server";
import {
  EMAIL_PROOF_COOKIE,
  emailProofCookieOptions,
  getEmailProof,
} from "@/lib/email-proof";
import { publicSiteUrl } from "@/lib/subscribe";

/**
 * Magic-link landing: set HttpOnly proof cookie and send user to Pro page.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token")?.trim() ?? "";
  const base = publicSiteUrl().replace(/\/$/, "");

  const record = await getEmailProof(token);
  if (!record) {
    return NextResponse.redirect(`${base}/pro-toolkit?verified=0`);
  }

  const res = NextResponse.redirect(`${base}/pro-toolkit?verified=1`);
  res.cookies.set(EMAIL_PROOF_COOKIE, token, emailProofCookieOptions());
  return res;
}
