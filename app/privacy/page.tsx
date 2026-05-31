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
          This policy describes how <strong className="text-foreground">{siteConfig.name}</strong> (“we”, “us”) handles
          information when you use our website and tools. The site is operated in English for creators worldwide. If you
          use the service, you agree to this policy.
        </p>

        <h2 className="text-lg font-semibold text-foreground">1. What we collect</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Account and contact data:</strong> email address when you subscribe to
            updates, join a waitlist, or request delivery of generated outputs.
          </li>
          <li>
            <strong className="text-foreground">Content you submit:</strong> episode topics, RSS feed URLs, pasted
            transcripts or show notes, optional episode URLs, and audio files you upload for validation or future
            processing features.
          </li>
          <li>
            <strong className="text-foreground">Technical data:</strong> standard server logs (for example IP address,
            approximate timestamp, user agent) used for security, abuse prevention, and rate limiting.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground">2. Audio and transcript processing</h2>
        <p>
          On the current free tier, <strong className="text-foreground">generation is driven by text you paste</strong>{" "}
          (transcript, show notes, or outline). Uploaded audio may be used to validate format and duration in the
          browser and on the server;{" "}
          <strong className="text-foreground">we do not automatically transcribe uploaded audio</strong> unless we
          ship and announce a separate transcription feature. Episode URLs you provide are treated as reference metadata;
          we do not automatically crawl arbitrary URLs for content unless we document that capability.
        </p>
        <p>
          When server-side AI is enabled, text you submit may be sent to our configured model provider to produce drafts
          (for example article structure, FAQs, social copy). Do not submit highly sensitive personal data or content you
          are not allowed to share.
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
          We use infrastructure and service providers (for example hosting, email delivery, and optional AI inference).
          Those vendors process data under their terms as processors where applicable.{" "}
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
          We keep information only as long as needed for the purposes above — for example while processing your request,
          maintaining usage limits, meeting legal obligations, or resolving disputes. Ephemeral or demo storage may be
          cleared on deploy; production retention limits will be documented as the product matures.
        </p>

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
          We use strictly necessary cookies and local storage where needed for the site to function (for example remembering
          that you acknowledged our cookie notice). If we add analytics or marketing cookies later, we will update this
          policy and provide an appropriate consent mechanism where required by law.
        </p>

        <h2 className="text-lg font-semibold text-foreground">11. Changes</h2>
        <p>
          We may update this policy as features evolve. Material changes will be reflected by updating the “Last updated”
          date above.
        </p>

        <h2 className="text-lg font-semibold text-foreground">12. Contact</h2>
        <p>
          Questions:{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary hover:underline">
            {siteConfig.contactEmail}
          </a>{" "}
          or the{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact page
          </Link>
          .
        </p>

      </div>
    </div>
  );
}
