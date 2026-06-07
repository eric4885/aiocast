import { NextResponse } from "next/server";
import { getJobIfAuthorized } from "@/lib/mvp-store";
import { srtFromTranscript } from "@/lib/transcript-segments";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  if (!id || !token) {
    return NextResponse.json({ error: "Missing id or token" }, { status: 400 });
  }

  const job = await getJobIfAuthorized(id, token);
  if (!job?.pack?.transcript?.trim()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const srt = srtFromTranscript(job.pack.transcript, job.pack.sourceType ?? "transcript");
  if (!srt) {
    return NextResponse.json({ error: "Transcript too short for SRT" }, { status: 422 });
  }

  const filename = `aiocast-${id}.srt`;
  return new Response(`\uFEFF${srt}`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
    },
  });
}
