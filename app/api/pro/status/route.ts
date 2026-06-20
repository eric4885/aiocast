import { NextResponse } from "next/server";
import { getProRecord } from "@/lib/pro-subscription";
import { getAnnualEarlyBirdRemaining, proRecordForResponse } from "@/lib/pro-early-bird";
import { pricing } from "@/lib/pricing";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const record = await getProRecord(email);
  const annualEarlyBirdRemaining = await getAnnualEarlyBirdRemaining();

  if (!record) {
    return NextResponse.json({
      ok: true,
      pro: false,
      plan: null,
      earlyBird: false,
      annualEarlyBirdRemaining,
      annualEarlyBirdTotal: pricing.pro.annualEarlyBirdSlots,
    });
  }

  return NextResponse.json({
    ok: true,
    ...proRecordForResponse(record),
    annualEarlyBirdRemaining,
    annualEarlyBirdTotal: pricing.pro.annualEarlyBirdSlots,
  });
}
