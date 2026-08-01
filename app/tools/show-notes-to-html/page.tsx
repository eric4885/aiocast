import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/data";
import { ShowNotesToHtmlClient } from "./show-notes-to-html-client";

const path = "/tools/show-notes-to-html";
const canonical = `${siteConfig.url}${path}`;

const faq = [
  {
    q: "What does this show notes to HTML converter do?",
    a: "It turns plain-text or simple Markdown show notes into an HTML article block you can paste into WordPress, Ghost, Webflow, or any CMS — headings, paragraphs, and bullet lists included.",
  },
  {
    q: "Do I need a full transcript?",
    a: "No. A structured outline or polished show notes are enough for HTML formatting. For an SEO blog draft, FAQ blocks, and social scripts, use the AioCast growth pack with your transcript or notes.",
  },
  {
    q: "Is this the same as the SEO growth pack?",
    a: "No. This tool only converts formatting. The growth pack generates an AI-edited SEO article, metadata, FAQ, and distribution scripts from your episode content.",
  },
];

function FaqJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}

export const metadata: Metadata = {
  title: "Show notes to HTML converter — free paste tool for podcasters",
  description:
    "Convert podcast show notes or Markdown outlines to paste-ready HTML for WordPress and Ghost. Free, runs in your browser.",
  alternates: { canonical },
  openGraph: {
    title: "Show notes to HTML converter",
    description: "Paste show notes — get HTML for your episode page.",
    url: canonical,
  },
};

export default function ShowNotesToHtmlPage() {
  return (
    <div className="border-b border-border bg-background bg-grid-subtle">
      <FaqJsonLd />
      <div className="mx-auto max-w-3xl px-4 pb-4 pt-10 text-center sm:px-6 sm:pt-12">
        <p className="text-sm font-semibold text-primary">Free tool · No signup</p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Show notes to HTML converter
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Paste your episode outline or show notes — get a clean HTML block for WordPress, Ghost, or Blogger. Runs in
          your browser. Need the outline first? Use the{" "}
          <Link href="/guides/show-notes-template" className="font-medium text-primary underline-offset-4 hover:underline">
            show notes template
          </Link>
          .
        </p>
      </div>

      <ShowNotesToHtmlClient />

      <section className="mx-auto max-w-2xl space-y-4 px-4 pb-8 text-sm leading-relaxed text-muted-foreground sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">How to convert podcast show notes to HTML</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Fill the show notes template (hook, takeaways, topic seeds, one listener question).</li>
          <li>Paste the outline into the converter above — Markdown headings and bullets work.</li>
          <li>Copy the HTML into your CMS (Blogger: switch to HTML view).</li>
          <li>
            For a full SEO article + FAQ + social scripts, paste the same notes into the{" "}
            <Link href="/tools/seo-growth-pack#pack-transcript-only" className="text-primary underline-offset-4 hover:underline">
              free growth pack
            </Link>
            , then finish with the{" "}
            <Link href="/resources/podcast-to-blog-seo-checklist" className="text-primary underline-offset-4 hover:underline">
              podcast to blog SEO checklist
            </Link>
            .
          </li>
        </ol>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">Common questions</h2>
        <dl className="mt-4 space-y-4">
          {faq.map((item) => (
            <div key={item.q}>
              <dt className="text-sm font-semibold text-foreground">{item.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
          <p className="text-sm font-semibold text-foreground">Want SEO draft + FAQ, not just HTML?</p>
          <Button size="lg" asChild className="mt-4">
            <Link href="/tools/seo-growth-pack#pack-transcript-only">Open free SEO growth pack</Link>
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/guides/show-notes-template" className="text-primary underline-offset-4 hover:underline">
            Show notes template
          </Link>
          {" · "}
          <Link href="/guides/podcast-to-blog-post" className="text-primary underline-offset-4 hover:underline">
            Podcast to blog guide
          </Link>
        </p>
      </section>
    </div>
  );
}
