import { NextResponse } from "next/server";
import { markUnsubscribed } from "@/lib/mvp-store";
import { isValidSubscribeEmail } from "@/lib/subscribe";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body as { email?: unknown }).email;
  if (!isValidSubscribeEmail(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  await markUnsubscribed(String(email).trim());
  return NextResponse.json({ ok: true });
}
