import { NextResponse } from "next/server";
import { createProCheckout, creemEnabled, type CheckoutPlan } from "@/lib/creem-server";

function parsePlan(value: unknown): CheckoutPlan | null {
  return value === "monthly" || value === "annual" ? value : null;
}

export async function POST(req: Request) {
  if (!creemEnabled()) {
    return NextResponse.json(
      {
        error:
          "Checkout is being configured. Email hello@aiocast.com and we will send you a Creem payment link.",
        code: "CREEM_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  let body: { plan?: unknown; email?: unknown };
  try {
    body = (await req.json()) as { plan?: unknown; email?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const plan = parsePlan(body.plan);
  if (!plan) {
    return NextResponse.json({ error: "plan must be monthly or annual." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" && body.email.includes("@") ? body.email.trim().toLowerCase() : undefined;

  const result = await createProCheckout({ plan, customerEmail: email });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true, url: result.url });
}
