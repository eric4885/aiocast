import { NextResponse } from "next/server";
import { verifyCreemWebhookSignature } from "@/lib/creem-server";
import { handleCreemWebhookEvent } from "@/lib/creem-webhook";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.CREEM_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("creem-signature");

  if (!verifyCreemWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    await handleCreemWebhookEvent(payload as Parameters<typeof handleCreemWebhookEvent>[0]);
  } catch (err) {
    console.error("[creem webhook]", err);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
