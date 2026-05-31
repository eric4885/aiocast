import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getClientIp } from "@/lib/client-ip";
import { buildPack } from "@/lib/mvp-generate";
import {
  checkAndConsumeUsage,
  checkIpGuards,
  createJob,
  getJobIfAuthorized,
  resultPath,
  setJobDone,
  setJobFailed,
  type GeneratedPack,
} from "@/lib/mvp-store";
import { warnIfEphemeralProduction } from "@/lib/persistent-backend";
import { assertProductionReady } from "@/lib/production";
import { publicSiteUrl } from "@/lib/subscribe";

function emailValid(value: unknown): value is string {
  return typeof value === "string" && value.includes("@") && value.length < 255;
}

async function sendResultEmail(email: string, pack: GeneratedPack, accessToken: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  const baseUrl = publicSiteUrl();
  const resultUrl = `${baseUrl}${resultPath(pack.id, accessToken)}`;
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "AioCast <onboarding@resend.dev>",
    to: email,
    subject: "Your AioCast growth pack is ready",
    html: `
      <p>Your SEO growth pack is ready.</p>
      <p><a href="${resultUrl}"><strong>Open your pack</strong></a></p>
      <p>Includes: SEO article, FAQ blocks, social scripts, SRT, highlights, and local schedule.</p>
      <p style="color:#64748b;font-size:12px;">This link is private — do not share it publicly.</p>
    `,
  });
}

export async function POST(req: Request) {
  warnIfEphemeralProduction();
  assertProductionReady();

  const ip = getClientIp(req);
  const form = await req.formData();
  const email = form.get("email");
  const transcriptRaw = form.get("transcript");
  const sourceUrlRaw = form.get("sourceUrl");
  const file = form.get("file");

  if (!emailValid(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const transcriptStr = typeof transcriptRaw === "string" ? transcriptRaw.trim() : "";
  const sourceUrlStr = typeof sourceUrlRaw === "string" ? sourceUrlRaw.trim() : "";
  const hasFile = file instanceof File && file.size > 0;
  const hasUrl = sourceUrlStr.length > 0;

  if (!transcriptStr) {
    if (hasFile) {
      return NextResponse.json(
        {
          error:
            "Add your episode transcript or show notes. Automatic transcription from uploaded audio is not available yet.",
          code: "TRANSCRIPT_REQUIRED",
        },
        { status: 400 },
      );
    }
    if (hasUrl) {
      return NextResponse.json(
        {
          error:
            "Add your episode transcript or show notes. We do not fetch episode pages from URLs automatically yet.",
          code: "TRANSCRIPT_REQUIRED",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error: "Paste a transcript, show notes, or episode outline to generate your pack.",
        code: "TRANSCRIPT_REQUIRED",
      },
      { status: 400 },
    );
  }

  const ipGuard = await checkIpGuards(ip);
  if (!ipGuard.allowed) {
    if (ipGuard.code === "IP_COOLDOWN") {
      return NextResponse.json(
        {
          error: `Please wait ${ipGuard.retryAfterSec}s before the next request from this IP.`,
          code: "IP_COOLDOWN",
        },
        { status: 429 },
      );
    }
    return NextResponse.json(
      {
        error: "Free daily IP limit reached (3/day). Try again tomorrow.",
        code: "IP_DAILY_LIMIT",
      },
      { status: 429 },
    );
  }

  const usage = await checkAndConsumeUsage(email);
  if (!usage.allowed) {
    return NextResponse.json(
      {
        error: `Free monthly email limit reached (${usage.used}/${usage.limit}). Try again next month.`,
        code: "LIMIT_REACHED",
      },
      { status: 429 },
    );
  }

  let sourceType: "audio" | "transcript" | "url";
  let sourceLabel: string;
  if (hasFile) {
    sourceType = "audio";
    sourceLabel = (file as File).name;
  } else if (hasUrl) {
    sourceType = "url";
    sourceLabel = sourceUrlStr;
  } else {
    sourceType = "transcript";
    sourceLabel = "pasted transcript";
  }

  const job = await createJob(email);
  try {
    const pack = await buildPack({ sourceType, sourceLabel, transcriptHint: transcriptStr });
    pack.id = job.id;
    await setJobDone(job.id, pack);
    await sendResultEmail(email, pack, job.accessToken);
    const resultUrl = resultPath(job.id, job.accessToken);
    return NextResponse.json({
      ok: true,
      id: job.id,
      status: "done",
      resultUrl,
      usage,
    });
  } catch (error) {
    await setJobFailed(job.id, error instanceof Error ? error.message : "Generation failed");
    return NextResponse.json({ error: "Generation failed." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!token) return NextResponse.json({ error: "Missing access token" }, { status: 401 });

  const job = await getJobIfAuthorized(id, token);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, job });
}
