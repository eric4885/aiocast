import { NextResponse } from "next/server";
import { aiBudgetExceededMessage, consumeAiBudget } from "@/lib/ai-budget";
import { getClientIp } from "@/lib/client-ip";
import { checkTitleIpGuards } from "@/lib/mvp-store";
import {
  buildOfflineTitleResult,
  fetchTitleOptimization,
  type OutputLanguage,
} from "@/lib/title-optimization";
import {
  API_TOPIC_ERROR_MESSAGE,
  isValidTopicInput,
  normalizeEnglishTopicInput,
} from "@/lib/topic-input";

function detectLanguage(input: string): OutputLanguage {
  const force = process.env.TITLE_OUTPUT_LANGUAGE?.toLowerCase();
  if (force === "zh") return "zh"; // Reserved for future bilingual rollout.
  if (force === "auto") {
    const zhCount = (input.match(/[\u4e00-\u9fff]/g) ?? []).length;
    const enCount = (input.match(/[a-zA-Z]/g) ?? []).length;
    return zhCount >= enCount ? "zh" : "en";
  }
  // MVP default: English-only output.
  if (force === "en" || !force) return "en";
  const zhCount = (input.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const enCount = (input.match(/[a-zA-Z]/g) ?? []).length;
  return zhCount >= enCount ? "zh" : "en";
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipGuard = await checkTitleIpGuards(ip);
    if (!ipGuard.allowed) {
      if (ipGuard.code === "IP_COOLDOWN") {
        return NextResponse.json(
          {
            error: `Please wait ${ipGuard.retryAfterSec}s before another title request.`,
            code: "IP_COOLDOWN",
          },
          { status: 429 },
        );
      }
      return NextResponse.json(
        {
          error: `Daily title-idea limit reached (${ipGuard.dailyLimit}/day from this network). Try again tomorrow.`,
          code: "IP_DAILY_LIMIT",
        },
        { status: 429 },
      );
    }

    let body: { topic?: unknown };
    try {
      body = (await req.json()) as { topic?: unknown };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const topic = typeof body.topic === "string" ? body.topic : "";
    const trimmed = normalizeEnglishTopicInput(topic);
    if (!isValidTopicInput(trimmed)) {
      return NextResponse.json({ error: API_TOPIC_ERROR_MESSAGE }, { status: 400 });
    }

    const force = process.env.TITLE_OUTPUT_LANGUAGE?.toLowerCase();
    const outputLanguage = detectLanguage(trimmed);

    const budget = await consumeAiBudget(1);
    if (!budget.allowed) {
      // Still return offline titles so the UI keeps working without burning credits.
      const data = buildOfflineTitleResult(trimmed, outputLanguage);
      return NextResponse.json({
        ok: true,
        data,
        meta: {
          outputLanguage,
          mode: force === "en" || force === "zh" ? "forced" : "auto",
          normalizedTopic: trimmed,
          warning: aiBudgetExceededMessage(budget.limit),
        },
      });
    }

    try {
      const data = await fetchTitleOptimization(trimmed, outputLanguage);
      return NextResponse.json({
        ok: true,
        data,
        meta: {
          outputLanguage,
          mode: force === "en" || force === "zh" ? "forced" : "auto",
          normalizedTopic: trimmed,
        },
      });
    } catch (err) {
      console.error("[title-optimize] falling back to offline pack:", err);
      const data = buildOfflineTitleResult(trimmed, outputLanguage);
      return NextResponse.json({
        ok: true,
        data,
        meta: {
          outputLanguage,
          mode: force === "en" || force === "zh" ? "forced" : "auto",
          normalizedTopic: trimmed,
          warning: "Using template-based suggestions due to API limit.",
        },
      });
    }
  } catch {
    return NextResponse.json({ error: "Title optimization failed." }, { status: 500 });
  }
}
