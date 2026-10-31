import { NextResponse } from "next/server";
import {
  EMAIL_PROOF_COOKIE,
  createEmailProofToken,
  emailProofCookieOptions,
} from "@/lib/email-proof";
import { getPacksForMyPacksToken, resultPath } from "@/lib/mvp-store";
import { publicSiteUrl } from "@/lib/subscribe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing access token." }, { status: 400 });
  }

  const data = await getPacksForMyPacksToken(token);
  if (!data) {
    return NextResponse.json({ error: "Link expired or invalid. Request a new one." }, { status: 401 });
  }

  const baseUrl = publicSiteUrl();
  // Opening a my-packs magic link also proves inbox ownership for Pro unlock.
  const proofToken = await createEmailProofToken(data.email);
  const res = NextResponse.json({
    ok: true,
    email: data.email,
    packs: data.packs.map((pack) => ({
      id: pack.id,
      title: pack.title,
      createdAt: pack.createdAt,
      resultUrl: `${baseUrl}${resultPath(pack.id, pack.accessToken)}`,
    })),
  });
  res.cookies.set(EMAIL_PROOF_COOKIE, proofToken, emailProofCookieOptions());
  return res;
}
