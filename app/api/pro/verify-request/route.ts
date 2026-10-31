import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { createEmailProofToken } from "@/lib/email-proof";
import { checkSubscribeIpGuards } from "@/lib/mvp-store";
import { sendProVerifyEmail } from "@/lib/pack-email";
import { assertProductionReady } from "@/lib/production";
import { publicSiteUrl } from "@/lib/subscribe";

function emailValid(value: unknown): value is string {
  return typeof value === "string" && value.includes("@") && value.length < 255;
}

/**
 * Sends a magic link that proves inbox ownership for Pro unlock / status.
 * Always returns ok (no email enumeration).
 */
export async function POST(req: Request) {
  assertProductionReady();

  const ip = getClientIp(req);
  const ipGuard = await checkSubscribeIpGuards(ip);
  if (!ipGuard.allowed) {
    if (ipGuard.code === "IP_COOLDOWN") {
      return NextResponse.json(
        { error: `Please wait ${ipGuard.retryAfterSec}s before trying again.` },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Too many requests from this network today. Try again tomorrow." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const emailRaw = (body as { email?: unknown }).email;
  if (!emailValid(emailRaw)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const email = emailRaw.trim().toLowerCase();

  try {
    const token = await createEmailProofToken(email);
    const verifyUrl = `${publicSiteUrl()}/api/pro/verify?token=${encodeURIComponent(token)}`;
    await sendProVerifyEmail(email, verifyUrl);
  } catch (err) {
    console.error("[pro/verify-request]", err);
    // Still return ok to avoid leaking whether Resend failed for a given address.
  }

  return NextResponse.json({
    ok: true,
    message: "If that address can receive mail, a verify link is on the way. It unlocks Pro limits in this browser for 30 days.",
  });
}
