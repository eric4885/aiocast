import { NextResponse } from "next/server";
import { sendPackResultEmail } from "@/lib/pack-email";
import { getJob } from "@/lib/mvp-store";

function emailValid(value: unknown): value is string {
  return typeof value === "string" && value.includes("@") && value.length < 255;
}

export async function POST(req: Request) {
  const body = (await req.json()) as { id?: string; token?: string; email?: string };
  const { id, token, email } = body;

  if (!id || !token) {
    return NextResponse.json({ error: "Missing pack id or access token." }, { status: 400 });
  }
  if (!emailValid(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const job = await getJob(id);
  if (!job || job.accessToken !== token) {
    return NextResponse.json({ error: "Pack not found." }, { status: 404 });
  }
  if (job.status !== "done" || !job.pack) {
    return NextResponse.json({ error: "Pack is not ready yet." }, { status: 400 });
  }

  try {
    await sendPackResultEmail(email.trim(), job.pack, job.accessToken);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not send email. Try again shortly." }, { status: 500 });
  }
}
