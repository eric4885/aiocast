import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using AioCast tools, AI-assisted outputs, and related content.",
  alternates: { canonical: `${siteConfig.url}/terms` },
  openGraph: {
    title: "Terms of Service — AioCast",
    url: `${siteConfig.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-foreground">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          ← Back home
        </Link>
      </p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {siteConfig.legalLastUpdated}</p>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          By accessing or using <strong className="text-foreground">{siteConfig.name}</strong> (“Service”), you agree to
          these Terms. If you do not agree, do not use the Service.
        </p>

        <h2 className="text-lg font-semibold text-foreground">1. The Service</h2>
        <p>
          We provide web-based tools and educational content to help podcasters produce SEO-oriented drafts, social
          scripts, subtitles, and related assets. The SEO growth pack may accept pasted show notes or short audio uploads
          that we transcribe before generation. Features and limits may change; we may add or remove functionality with
          reasonable notice where appropriate.
        </p>

        <h2 className="text-lg font-semibold text-foreground">2. Eligibility and email</h2>
        <p>
          You must be able to form a binding contract in your jurisdiction. Where the Service collects an email address,
          you agree to provide accurate contact information. There is no password-based account — access is via private
          pack links and optional email recovery.
        </p>
        <p>
          If you subscribe to the weekly briefing, checklist, or a waitlist, you agree to receive the resource you
          requested and occasional non-transactional product updates as described in our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          . You may opt out of non-transactional mail at any time via{" "}
          <Link href="/unsubscribe" className="text-primary hover:underline">
            Unsubscribe
          </Link>
          .
        </p>

        <h2 className="text-lg font-semibold text-foreground">3. Your content</h2>
        <p>
          You retain rights to content you submit (for example transcripts, audio clips, and topics). To operate the
          Service, you grant us a limited license to host, process, transmit, and display that content solely to provide
          and improve the Service — including sending portions to speech-to-text and AI subprocessors when those features
          are enabled.
        </p>
        <p>
          You represent that you have the rights needed to submit your content and that it does not violate applicable
          law or third-party rights.
        </p>

        <h2 className="text-lg font-semibold text-foreground">4. Private pack links and recovery</h2>
        <p>
          SEO growth pack results are delivered via private URLs that include an access token. Anyone with the full link
          can view that pack. You are responsible for keeping links confidential. If you lose a link, use the email backup
          or &quot;Find my packs&quot; recovery flow with the same address you used at generation. We are not responsible
          for unauthorized access caused by links you share publicly.
        </p>

        <h2 className="text-lg font-semibold text-foreground">5. AI-assisted outputs</h2>
        <p>
          Outputs may be generated or templated using automated systems.{" "}
          <strong className="text-foreground">
            They are starting points for human review, not legal, medical, financial, or guaranteed marketing advice.
          </strong>{" "}
          You are responsible for fact-checking, tone, accessibility, platform compliance, and publication decisions.
        </p>

        <h2 className="text-lg font-semibold text-foreground">6. Intellectual property (site)</h2>
        <p>
          The Service UI, branding, text templates we provide outside your submissions, and our curated materials are
          owned by us or our licensors. Except for the rights expressly granted here, no rights are transferred to you.
        </p>
        <p>
          You may not scrape, reverse engineer, or misuse the Service; copy our marketing or layout to imply endorsement;
          or remove proprietary notices.
        </p>

        <h2 className="text-lg font-semibold text-foreground">7. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL
          WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT. WE DO NOT WARRANT SPECIFIC SEARCH RANKINGS, DOWNLOADS, REVENUE, OR PLATFORM ACCEPTANCE OF
          YOUR CONTENT.
        </p>

        <h2 className="text-lg font-semibold text-foreground">8. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL. OUR AGGREGATE LIABILITY FOR CLAIMS
          ARISING OUT OF THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID US FOR THE SERVICE IN THE
          THREE MONTHS BEFORE THE CLAIM OR (B) FIFTY U.S. DOLLARS (USD $50), IF NO FEES APPLIED.
        </p>
        <p>Some jurisdictions do not allow certain limitations; in those cases, our liability is limited to the extent permitted by law.</p>

        <h2 className="text-lg font-semibold text-foreground">9. Free tiers, fair use, and paid offerings</h2>
        <p>
          We may apply rate limits on free tools (for example per email and per IP daily caps, plus a short cooldown
          between submissions from the same IP). Limits are described on the tool page and may change. You agree not to
          circumvent limits or abuse the Service. Paid Pro subscriptions are billed through our payment provider (Creem);
          price, billing interval, and refund terms are shown at checkout and on the{" "}
          <Link href="/pro-toolkit" className="text-primary underline-offset-4 hover:underline">
            pricing page
          </Link>
          .
        </p>

        <h2 className="text-lg font-semibold text-foreground">10. Indemnity</h2>
        <p>
          You will defend and indemnify us against claims arising from your content, your use of outputs, or your breach of
          these Terms, except to the extent caused by our willful misconduct.
        </p>

        <h2 className="text-lg font-semibold text-foreground">11. Termination</h2>
        <p>
          We may suspend or terminate access for violations or risk to the Service. You may stop using the Service at any
          time.
        </p>

        <h2 className="text-lg font-semibold text-foreground">12. Governing law and disputes</h2>
        <p>
          These Terms are governed by applicable law where the operator is established, excluding conflict-of-law rules.
          Mandatory consumer protections in your country of residence remain unaffected. Disputes should first be raised
          via{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary hover:underline">
            {siteConfig.contactEmail}
          </a>
          .
        </p>

        <h2 className="text-lg font-semibold text-foreground">13. Changes</h2>
        <p>
          We may update these Terms. Continued use after changes become effective constitutes acceptance of the revised
          Terms. If you do not agree, discontinue use.
        </p>

        <h2 className="text-lg font-semibold text-foreground">14. Contact</h2>
        <p>
          Operator: {siteConfig.legalEntity}.{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact page
          </Link>{" "}
          ·{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary hover:underline">
            {siteConfig.contactEmail}
          </a>
        </p>

      </div>
    </div>
  );
}
