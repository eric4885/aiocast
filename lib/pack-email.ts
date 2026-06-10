import { Resend } from "resend";
import { type GeneratedPack, resultPath } from "@/lib/mvp-store";
import { emailFooterHtml } from "@/lib/email-footer";
import { publicSiteUrl } from "@/lib/subscribe";

export async function sendPackResultEmail(email: string, pack: GeneratedPack, accessToken: string) {
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
      <p>Includes: SEO article, FAQ blocks, social scripts, SRT, highlights, and 7-day publish plan.</p>
      <p style="color:#64748b;font-size:12px;">This link is private — do not share it publicly. Lost the link? Use <a href="${baseUrl}/my-packs">Find my packs</a> with this email.</p>
      ${emailFooterHtml()}
    `,
  });
}

export async function sendMyPacksAccessEmail(email: string, accessUrl: string, packCount: number) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Email is not configured.");
  const resend = new Resend(apiKey);
  const countLine =
    packCount > 0
      ? `We found ${packCount} pack${packCount === 1 ? "" : "s"} linked to this address.`
      : "No packs are indexed for this address yet — generate one and include this email for backup.";

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "AioCast <onboarding@resend.dev>",
    to: email,
    subject: "Your AioCast pack links",
    html: `
      <p>${countLine}</p>
      <p><a href="${accessUrl}"><strong>Open my packs</strong></a></p>
      <p style="color:#64748b;font-size:12px;">This link expires in 24 hours. Each pack link inside is also private — do not share publicly.</p>
      ${emailFooterHtml()}
    `,
  });
}
