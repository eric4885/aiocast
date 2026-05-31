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
            <strong className="text-foreground">Transcript required:</strong> Paste a transcript, show notes, or a solid
            outline. We do not auto-transcribe uploads or fetch episode pages from URLs on this tier.
          </li>
          <li>
            <strong className="text-foreground">Limits:</strong> Three runs per email per calendar month, three per IP
            per day, and about one minute between submissions from the same IP.
          </li>
          <li>
            <strong className="text-foreground">Delivery:</strong> You get a link to a results page and a confirmation
            email when outbound mail is configured.
          </li>
        </ul>
        <p className="mt-4">
          <Link href="/tools/audio-quality-checker" className="font-medium text-primary hover:underline">
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
