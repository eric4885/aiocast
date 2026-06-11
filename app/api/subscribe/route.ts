import { Resend } from "resend";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { CHECKLIST_MD_PATH } from "@/lib/checklist-markdown";
import { emailFooterHtml, listUnsubscribeHeaders } from "@/lib/email-footer";
import { clearUnsubscribed, checkSubscribeIpGuards } from "@/lib/mvp-store";
import { assertProductionReady } from "@/lib/production";
import {
  isSubscribeSource,
  isValidSubscribeEmail,
  publicSiteUrl,
  type SubscribeSource,
} from "@/lib/subscribe";

function sourceLabel(source: SubscribeSource) {
  switch (source) {
    case "footer":
      return "site footer (weekly briefing)";
    case "editing_stack":
      return "AI podcast editing stack page";
    case "audio_checker":
      return "SEO growth pack tool";
    case "rss_early_access":
      return "home page RSS SEO audit waitlist";
    case "preflight_checklist":
      return "pre-flight checklist page";
    default:
      return source;
  }
}

export async function POST(req: Request) {
  assertProductionReady();

  const ip = getClientIp(req);
  const ipGuard = await checkSubscribeIpGuards(ip);
  if (!ipGuard.allowed) {
    if (ipGuard.code === "IP_COOLDOWN") {
      return NextResponse.json(
        { error: `Please wait ${ipGuard.retryAfterSec}s before trying again.` },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Too many sign-up attempts from this network today. Try again tomorrow." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const rec = body as Record<string, unknown>;
  if (rec.website != null && String(rec.website).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = rec.email;
  const source = rec.source;

  if (!isValidSubscribeEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!isSubscribeSource(source)) {
    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  }

  const baseUrl = publicSiteUrl();
  const checklistUrl = `${baseUrl}/resources/pre-flight-checklist`;
  const mdUrl = `${baseUrl}${CHECKLIST_MD_PATH}`;

  const normalizedEmail = String(email).trim().toLowerCase();
  await clearUnsubscribed(normalizedEmail);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "AioCast <onboarding@resend.dev>";

  if (apiKey) {
    const resend = new Resend(apiKey);
    const isRssWaitlist = source === "rss_early_access";
    const growthPackUrl = `${baseUrl}/tools/seo-growth-pack`;
    const sampleOutputNote =
      source === "editing_stack"
        ? `<p>Preview example SEO output (article, FAQ, social scripts): <a href="${growthPackUrl}"><strong>Open the free growth pack</strong></a> and expand &quot;See example output&quot;.</p>`
        : "";
    const html = isRssWaitlist
      ? `
      <p>You're on the <strong>RSS SEO audit</strong> early-access list.</p>
      <p>Source: <strong>${sourceLabel(source)}</strong>.</p>
      <p>We'll email you when full feed-level scoring and competitor gap reports roll out.</p>
      ${emailFooterHtml({ marketing: true, email: normalizedEmail })}
    `
      : `
      <p>Thanks — here's your pre-flight checklist for cleaner recordings.</p>
      <p>You signed up from: <strong>${sourceLabel(source)}</strong>.</p>
      <p><a href="${checklistUrl}"><strong>Open the checklist (web)</strong></a></p>
      <p><a href="${mdUrl}">Download plain Markdown (.md)</a></p>
      ${sampleOutputNote}
      ${emailFooterHtml({ marketing: true, email: normalizedEmail })}
    `;

    const { error } = await resend.emails.send({
      from,
      to: normalizedEmail,
      subject: isRssWaitlist
        ? "You're on the RSS audit waitlist — AioCast"
        : "Your podcast pre-flight checklist — AioCast",
      html,
      headers: listUnsubscribeHeaders(normalizedEmail),
    });

    if (error) {
      console.error("[subscribe] Resend error:", error);
      return NextResponse.json(
        { error: "Could not send email right now. Try again shortly." },
        { status: 502 },
      );
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Email delivery is not configured. Contact support@aiocast.com." },
      { status: 503 },
    );
  } else {
    console.warn("[subscribe] RESEND_API_KEY missing — skipped send for", email, source);
  }

  return NextResponse.json({
    ok: true,
    checklistUrl,
    mdUrl,
    emailSent: Boolean(apiKey),
  });
}
