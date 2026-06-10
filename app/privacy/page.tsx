import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AioCast collects, uses, and protects information — including audio and text you submit.",
  alternates: { canonical: `${siteConfig.url}/privacy` },
  openGraph: {
    title: "Privacy Policy — AioCast",
    url: `${siteConfig.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-foreground">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          ← Back home
        </Link>
      </p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {siteConfig.legalLastUpdated}</p>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          This policy describes how <strong className="text-foreground">{siteConfig.legalEntity}</strong> (“we”, “us”)
          operates <strong className="text-foreground">{siteConfig.name}</strong> and handles information when you use our
          website and tools. The site is operated in English for creators worldwide. If you use the service, you agree to
          this policy.
        </p>

        <h2 className="text-lg font-semibold text-foreground">1. What we collect</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Account and contact data:</strong> email address when you subscribe to
            updates, join a waitlist, request delivery of generated outputs, or use &quot;Find my packs&quot; recovery.
          </li>
          <li>
            <strong className="text-foreground">Content you submit:</strong> episode topics, RSS feed URLs, pasted
            transcripts or show notes, optional episode URLs, and audio files you upload for automatic transcription when
            you do not paste text.
          </li>
          <li>
            <strong className="text-foreground">Pack recovery index:</strong> when you provide an email at generation or
            on a result page, we associate that address with pack identifiers and titles (up to 20 recent packs per email)
            so you can request a private recovery link.
          </li>
          <li>
            <strong className="text-foreground">Private result links:</strong> generated pack URLs include an access token.
            Anyone with the full link can view that pack — treat links like passwords and do not share them publicly.
          </li>
          <li>
            <strong className="text-foreground">Technical data:</strong> standard server logs (for example IP address,
            approximate timestamp, user agent) used for security, abuse prevention, and rate limiting.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground">2. Audio and transcript processing</h2>
        <p>
          The SEO growth pack tool accepts <strong className="text-foreground">pasted transcripts or show notes</strong>{" "}
          and, on the free tier, <strong className="text-foreground">uploaded audio clips</strong> (currently up to 5
          minutes and 10 MB). When you upload audio without pasting text, we send that file to our configured speech-to-text
          provider (OpenAI Whisper or an equivalent model via our API gateway) to produce a transcript, then use that text
          to generate your pack. We do not retain uploaded audio files after transcription completes — only the resulting
          text and generated outputs are stored for delivery.
        </p>
        <p>
          Non-English pasted notes may be translated to English before generation when the site is configured for English
          output. Episode URLs you provide are treated as reference metadata; we do not automatically crawl arbitrary URLs
          for content unless we document that capability separately.
        </p>
        <p>
          When server-side AI is enabled, text you submit (including transcripts produced from audio) may be sent to our
          configured model provider to produce drafts (for example article structure, FAQs, and social copy). Do not submit
          highly sensitive personal data or content you are not allowed to share.
        </p>

        <h2 className="text-lg font-semibold text-foreground">3. Why we use data (purposes)</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>Provide, operate, and improve the tools you request.</li>
          <li>Deliver results by email and enforce fair usage limits.</li>
          <li>Send transactional messages related to your requests.</li>
          <li>
            With separate consent where required: send product updates or newsletters (you can opt out via unsubscribe
            instructions in those emails).
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground">4. Legal bases (including EEA/UK visitors)</h2>
        <p>
          Depending on your region, we rely on <strong className="text-foreground">contract</strong> (to deliver what you
          asked for), <strong className="text-foreground">legitimate interests</strong> (security, abuse prevention,
          product improvement), and <strong className="text-foreground">consent</strong> where required (for example
          marketing email when no other basis applies).
        </p>

        <h2 className="text-lg font-semibold text-foreground">5. Sharing and subprocessors</h2>
        <p>
          We use infrastructure and service providers to run the Service. Those vendors process data under their terms as
          processors where applicable. Typical categories include:
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Hosting:</strong> Cloudflare (Workers, CDN, and related edge services).
          </li>
          <li>
            <strong className="text-foreground">Persistence:</strong> Upstash Redis (when configured) for job metadata and
            usage counters; otherwise ephemeral or file-based storage in development.
          </li>
          <li>
            <strong className="text-foreground">Email:</strong> Resend for transactional messages (pack links, pack
            recovery, checklist delivery) and briefing/waitlist messages when you subscribe. Subscriber addresses are
            processed to send what you requested; you can opt out of non-transactional mail via{" "}
            <Link href="/unsubscribe" className="text-primary hover:underline">
              Unsubscribe
            </Link>
            .
          </li>
          <li>
            <strong className="text-foreground">AI inference:</strong> APImart and/or OpenAI-compatible endpoints for text
            generation and Whisper-style audio transcription when enabled.
          </li>
        </ul>
        <p>
          <strong className="text-foreground">We do not sell your personal information.</strong>
        </p>

        <h2 className="text-lg font-semibold text-foreground">6. International transfers</h2>
        <p>
          Our servers and vendors may be located in the United States or other countries. If we transfer personal data
          from the EEA, UK, or Switzerland, we use appropriate safeguards where required (for example standard contractual
          clauses) in line with provider documentation.
        </p>

        <h2 className="text-lg font-semibold text-foreground">7. Retention</h2>
        <p>
          We keep information only as long as needed for the purposes above. In general:
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Uploaded audio:</strong> processed in memory for transcription and not kept
            as a separate file after the request completes.
          </li>
          <li>
            <strong className="text-foreground">Generated packs:</strong> stored so you can reopen your private result link
            for at least 90 days under normal operation; email-indexed packs (last 20 per address) support recovery.
            Storage may be cleared earlier on deploy or routine maintenance — use email backup or export downloads for
            long-term copies.
          </li>
          <li>
            <strong className="text-foreground">Unsubscribe flags:</strong> retained while you remain opted out of
            non-transactional email.
          </li>
          <li>
            <strong className="text-foreground">Usage limits:</strong> monthly email counters and daily IP counters rotate
            with the calendar; magic-link tokens for pack recovery expire after 24 hours.
          </li>
          <li>
            <strong className="text-foreground">Newsletter:</strong> until you unsubscribe or we delete the list entry.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground">8. Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, delete, restrict, or export personal data,
          and to object to certain processing. California residents may have additional rights under the CCPA/CPRA
          (including knowing categories of data collected, requesting deletion where applicable, and opting out of sale —
          we do not sell personal data). To exercise rights, contact us via the{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact
          </Link>{" "}
          page.
        </p>

        <h2 className="text-lg font-semibold text-foreground">9. Children</h2>
        <p>The service is not directed at children under 16. Do not submit children’s personal data.</p>

        <h2 className="text-lg font-semibold text-foreground">10. Cookies and similar technologies</h2>
        <p>
          We use <strong className="text-foreground">essential storage</strong> (cookies and local storage) so the site
          works — for example remembering your cookie choice. If you choose &quot;Accept analytics&quot; in our banner and
          we have configured a measurement ID, we may load <strong className="text-foreground">Google Analytics 4</strong>{" "}
          to understand aggregate usage. Analytics does not run until you opt in via that banner. You can change your
          choice by clearing site data for {siteConfig.name} in your browser. See Google&apos;s privacy documentation for
          how GA processes data.
        </p>

        <h2 className="text-lg font-semibold text-foreground">11. Changes</h2>
        <p>
          We may update this policy as features evolve. Material changes will be reflected by updating the “Last updated”
          date above.
        </p>

        <h2 className="text-lg font-semibold text-foreground">12. Contact</h2>
        <p>
          Data controller: {siteConfig.legalEntity}. Questions or privacy requests:{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary hover:underline">
            {siteConfig.contactEmail}
          </a>{" "}
          or the{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact page
          </Link>
          . We aim to respond to verifiable requests within 30 days where applicable law requires.
        </p>
        {siteConfig.mailingAddress ? (
          <p className="text-sm">
            Postal correspondence: {siteConfig.mailingAddress.split("\n").join(", ")}
          </p>
        ) : null}

      </div>
    </div>
  );
}
