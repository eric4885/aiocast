import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { checkSubscribeIpGuards, createMyPacksAccessToken } from "@/lib/mvp-store";
import { sendMyPacksAccessEmail } from "@/lib/pack-email";
import { withSnapshot } from "@/lib/persistent-backend";
import { assertProductionReady } from "@/lib/production";
import { publicSiteUrl } from "@/lib/subscribe";

function emailValid(value: unknown): value is string {
  return typeof value === "string" && value.includes("@") && value.length < 255;
}

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
  const packCount = await withSnapshot((snapshot) => (snapshot.emailPackIndex[email] ?? []).length);

  try {
    const token = await createMyPacksAccessToken(email);
    const accessUrl = `${publicSiteUrl()}/my-packs?token=${encodeURIComponent(token)}`;
    await sendMyPacksAccessEmail(email, accessUrl, packCount);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not send email. Try again shortly." }, { status: 500 });
  }
}
