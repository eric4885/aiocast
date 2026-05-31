import { NextResponse } from "next/server";
import type { AudioAnalysisResult, AudioAnalysisStatus } from "@/lib/data";

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function scoreFromSeed(seed: number, offset: number) {
  const raw = ((Math.sin(seed * 12.9898 + offset * 78.233) + 1) / 2) * 100;
  return Math.round(clamp(raw, 45, 95));
}

function statusFromScore(score: number): AudioAnalysisStatus {
  if (score >= 78) return "good";
  if (score >= 62) return "warning";
  return "bad";
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  let seed = Date.now() % 997;
  if (file instanceof File) {
    seed = (file.name.length + (file.size % 500)) * 13;
  }

  const noise = scoreFromSeed(seed, 1);
  const volume = scoreFromSeed(seed, 2);
  const clarity = scoreFromSeed(seed, 3);
  const plosives = scoreFromSeed(seed, 4);

  const overall = Math.round((noise + volume + clarity + plosives) / 4);

  const payload: AudioAnalysisResult = {
    overallScore: overall,
    dimensions: {
      noiseFloor: {
        score: noise,
        value: `${-(42 + (noise % 8))} dBFS`,
        status: statusFromScore(noise),
        suggestion:
          noise >= 78
            ? "Noise floor looks healthy. Keep HVAC off during takes."
            : "Consider closing windows, adding a noise gate, and enabling light room tone reduction.",
      },
      volumeConsistency: {
        score: volume,
        value: `Integrated LUFS ~${(-18 + (volume % 5) / 10).toFixed(1)}`,
        status: statusFromScore(volume),
        suggestion:
          volume >= 78
            ? "Levels are podcast-loudness friendly. Maintain headroom around 3–6 dB."
            : "Normalize dialogue, then use gentle compression before enhancing with AI tools.",
      },
      clarity: {
        score: clarity,
        value: `RT60 est. ${(0.15 + (clarity % 15) / 100).toFixed(2)}s`,
        status: statusFromScore(clarity),
        suggestion:
          clarity >= 78
            ? "Clarity is strong—light de-essing is probably all you need."
            : "Add absorption (blankets/rugs) and steer mics away from reflective walls.",
      },
      plosives: {
        score: plosives,
        value: `${Math.max(0, Math.round((100 - plosives) / 12))} bursts`,
        status: statusFromScore(plosives),
        suggestion:
          plosives >= 78
            ? "Plosives under control — keep your pop filter tight to the capsule."
            : "Offset mic 15° off-axis, enable a high-pass ~80 Hz, and re-take dense sections.",
      },
    },
    recommendedTools: [
      "Adobe Podcast Enhance",
      "Descript Studio Sound",
      "Acon Digital DeVerberate (if room heavy)",
    ],
    emailCapture: false,
  };

  return NextResponse.json(payload);
}
