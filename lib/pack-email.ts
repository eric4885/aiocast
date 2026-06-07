import { Resend } from "resend";
import { type GeneratedPack, resultPath } from "@/lib/mvp-store";
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
      <p>Includes: SEO article, FAQ blocks, social scripts, SRT, highlights, and local schedule.</p>
      <p style="color:#64748b;font-size:12px;">This link is private — do not share it publicly.</p>
    `,
  });
}
