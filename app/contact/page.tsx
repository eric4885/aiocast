import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the AioCast team.",
  alternates: { canonical: `${siteConfig.url}/contact` },
  openGraph: {
    title: "Contact — AioCast",
    url: `${siteConfig.url}/contact`,
  },
};

function ContactFormEmbed() {
  const src = process.env.NEXT_PUBLIC_CONTACT_FORM_EMBED_URL?.trim();
  if (!src) return null;
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-inner">
      <iframe
        src={src}
        title="Contact form"
        width="100%"
        height={560}
        className="min-h-[520px] w-full border-0 bg-background"
        loading="lazy"
      />
    </div>
  );
}

export default function ContactPage() {
  const embedSrc = process.env.NEXT_PUBLIC_CONTACT_FORM_EMBED_URL?.trim();
  const mail = `mailto:${siteConfig.contactEmail}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-foreground">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          ← Back home
        </Link>
      </p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Send us a message and we reply within 24 hours on business days. For quick questions, email{" "}
        <a href={mail} className="font-semibold text-primary underline-offset-4 hover:underline">
          {siteConfig.contactEmail}
        </a>
        .
      </p>

      {embedSrc ? (
        <>
          <p className="mt-6 text-sm text-muted-foreground">Use the form below — no account required.</p>
          <ContactFormEmbed />
        </>
      ) : (
        <div className="mt-8">
          <a
            href={mail}
            className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-105"
          >
            Email {siteConfig.contactEmail}
          </a>
        </div>
      )}
    </div>
  );
}
