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
  type JobRecord,
} from "@/lib/mvp-store";
import { warnIfEphemeralProduction } from "@/lib/persistent-backend";
import { assertProductionReady } from "@/lib/production";
import { publicSiteUrl } from "@/lib/subscribe";
import { transcribeAudioFile, transcribeEnabled } from "@/lib/transcribe-audio";

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

async function finishJob(
  job: JobRecord,
  email: string,
  input: {
    sourceType: "audio" | "transcript";
    sourceLabel: string;
    transcriptHint: string;
  },
) {
  const pack = await buildPack(input);
  pack.id = job.id;
  await setJobDone(job.id, pack);
  await sendResultEmail(email, pack, job.accessToken);
  return resultPath(job.id, job.accessToken);
}

export async function POST(req: Request) {
  warnIfEphemeralProduction();
  assertProductionReady();

  const ip = getClientIp(req);
  const form = await req.formData();
  const email = form.get("email");
  const transcriptRaw = form.get("transcript");
  const file = form.get("file");

  if (!emailValid(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const transcriptStr = typeof transcriptRaw === "string" ? transcriptRaw.trim() : "";
  const hasFile = file instanceof File && file.size > 0;
  const needsTranscribe = hasFile && !transcriptStr;

  if (!transcriptStr && !hasFile) {
    return NextResponse.json(
      {
        error: "Paste a transcript or upload an audio file to generate your pack.",
        code: "INPUT_REQUIRED",
      },
      { status: 400 },
    );
  }

  if (needsTranscribe && !transcribeEnabled()) {
    return NextResponse.json(
      {
        error:
          "Audio transcription is not enabled yet. Paste show notes instead, or ask the site owner to configure OPENAI_API_KEY.",
        code: "TRANSCRIBE_UNAVAILABLE",
      },
      { status: 503 },
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

  const job = await createJob(email);
  try {
    const transcript = needsTranscribe ? await transcribeAudioFile(file as File) : transcriptStr;
    const sourceType = hasFile ? "audio" : "transcript";
    const sourceLabel = hasFile ? (file as File).name : "pasted transcript";
    const resultUrl = await finishJob(job, email, {
      sourceType,
      sourceLabel,
      transcriptHint: transcript,
    });

    return NextResponse.json({
      ok: true,
      id: job.id,
      status: "done",
      resultUrl,
      usage,
      transcribed: needsTranscribe,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    await setJobFailed(job.id, message);
    const status = needsTranscribe && message.toLowerCase().includes("transcri") ? 502 : 500;
    return NextResponse.json({ error: message, code: needsTranscribe ? "TRANSCRIBE_FAILED" : "GENERATION_FAILED" }, { status });
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
