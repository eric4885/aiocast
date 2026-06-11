import { siteConfig } from "@/lib/data";
import { publicSiteUrl } from "@/lib/subscribe";

type FooterOptions = {
  /** Include unsubscribe link (newsletter / briefing signup emails). */
  marketing?: boolean;
  email?: string;
};

function mailingLine(): string {
  if (siteConfig.mailingAddress) return siteConfig.mailingAddress;
  return `${siteConfig.legalEntity} · ${siteConfig.contactEmail}`;
}

export function unsubscribeUrl(email?: string): string {
  const base = publicSiteUrl();
  if (!email?.trim()) return `${base}/unsubscribe`;
  return `${base}/unsubscribe?email=${encodeURIComponent(email.trim().toLowerCase())}`;
}

export function emailFooterHtml(options: FooterOptions = {}): string {
  const base = publicSiteUrl();
  const addr = mailingLine().replace(/\n/g, "<br/>");
  let extra = "";
  if (options.marketing) {
    extra = `<br/><a href="${unsubscribeUrl(options.email)}">Unsubscribe</a> from non-transactional emails.`;
  }
  return `<p style="color:#64748b;font-size:12px;margin-top:24px;border-top:1px solid #e2e8f0;padding-top:12px;">
    ${siteConfig.legalEntity}<br/>${addr}${extra}<br/>
    <a href="${base}/privacy">Privacy Policy</a> ·
    Reply to <a href="mailto:${siteConfig.contactEmail}">${siteConfig.contactEmail}</a> if something looks wrong.
  </p>`;
}

export function listUnsubscribeHeaders(email: string): Record<string, string> {
  const url = unsubscribeUrl(email);
  return {
    "List-Unsubscribe": `<${url}>, <mailto:${siteConfig.contactEmail}?subject=Unsubscribe>`,
  };
}
