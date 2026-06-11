import type { Metadata } from "next";
import Link from "next/link";
import { faqItems, siteConfig } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description: "Common questions about AioCast tools, transcripts, limits, and billing.",
  alternates: { canonical: `${siteConfig.url}/help` },
  openGraph: {
    title: "Help & FAQ — AioCast",
    url: `${siteConfig.url}/help`,
  },
};

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-foreground">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          ← Back home
        </Link>
      </p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Help &amp; FAQ</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Quick answers about the English-language tools on {siteConfig.name}. For anything else, email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary hover:underline">
          {siteConfig.contactEmail}
        </a>{" "}
        or use the{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Contact
        </Link>{" "}
        page.
      </p>

      <section className="mt-10 rounded-xl border border-border bg-secondary/30 p-5 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">Generate pack (free tool)</h2>
        <ul className="mt-3 list-inside list-disc space-y-2">
          <li>
            <strong className="text-foreground">Input options:</strong> Paste a transcript or show notes, or upload up
            to 5 minutes of audio (MP3, M4A, or WAV) for automatic transcription on the free tier.
          </li>
          <li>
            <strong className="text-foreground">Limits:</strong> When enabled: three runs per email per calendar month
            (when an email is provided), three per IP per day, and about one minute between submissions from the same IP.
            During launch we may temporarily relax caps — check the tool page for the current status.
          </li>
          <li>
            <strong className="text-foreground">Delivery:</strong> Your pack opens on-site as soon as generation
            finishes. Add an email for an optional backup link.
          </li>
        </ul>
        <p className="mt-4">
          <Link href="/tools/seo-growth-pack" className="font-medium text-primary hover:underline">
            Open Generate pack →
          </Link>
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">General questions</h2>
        <Accordion type="single" collapsible className="mt-6 w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-12 space-y-3 text-sm text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">Policies</h2>
        <p>
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
        </p>
      </section>
    </div>
  );
}
