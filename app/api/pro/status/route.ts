import { NextResponse } from "next/server";
import { getEmailProof, getEmailProofTokenFromRequest } from "@/lib/email-proof";
import { getAnnualEarlyBirdRemaining, proRecordForResponse } from "@/lib/pro-early-bird";
import { getProRecord } from "@/lib/pro-subscription";
import { pricing } from "@/lib/pricing";

/**
 * Pro status for the verified inbox only (email-proof cookie or ?proof=).
 * Public early-bird slot counts remain available without proof.
 */
export async function GET(req: Request) {
  const annualEarlyBirdRemaining = await getAnnualEarlyBirdRemaining();
  const earlyBirdMeta = {
    annualEarlyBirdRemaining,
    annualEarlyBirdTotal: pricing.pro.annualEarlyBirdSlots,
  };

  const token = getEmailProofTokenFromRequest(req);
  const proof = await getEmailProof(token);
  if (!proof) {
    return NextResponse.json(
      {
        ok: false,
        error: "Verify your email first — we only show Pro status after you open the magic link.",
        code: "PROOF_REQUIRED",
        pro: false,
        ...earlyBirdMeta,
      },
      { status: 401 },
    );
  }

  const record = await getProRecord(proof.email);
  if (!record) {
    return NextResponse.json({
      ok: true,
      email: proof.email,
      pro: false,
      plan: null,
      earlyBird: false,
      ...earlyBirdMeta,
    });
  }

  return NextResponse.json({
    ok: true,
    email: proof.email,
    ...proRecordForResponse(record),
    ...earlyBirdMeta,
  });
}
