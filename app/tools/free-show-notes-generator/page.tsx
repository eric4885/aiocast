import type { Metadata } from "next";
import Link from "next/link";
import { GuideDraftPrefill } from "@/components/guides/GuideDraftPrefill";
import { siteConfig } from "@/lib/data";
import { freeShowNotesGeneratorPageJsonLd } from "@/lib/free-show-notes-generator-schema";
import { pricing } from "@/lib/pricing";
import { freeLimitsInline, rankingDisclaimer } from "@/lib/pricing-copy";
import { productPromise } from "@/lib/product-copy";

const canonical = `${siteConfig.url}/tools/free-show-notes-generator`;

const faq = [
  {
    q: "Is this show notes generator free without login?",
    a: `Yes. Paste your text and generate — no account required. The free tier includes ${pricing.free.ipDailyLimit} pack runs per day per IP. Email is optional for backup delivery only.`,
  },
  {
    q: "Do I need a full podcast transcript?",
    a: "No. Structured show notes with a hook, takeaways, topic seeds, and one listener question are enough for a solid first draft. A full transcript adds detail when you have it.",
  },
  {
    q: "What do I get from this tool?",
    a: "An SEO blog article draft with title and meta suggestions, FAQ blocks, and social scripts for LinkedIn and X — all editable before you publish on your own site. You paste show notes or a transcript as input; the output is a publishable draft pack, not a replacement for your episode audio.",
  },
  {
    q: "How is this different from uploading audio?",
    a: "This page is optimized for pasting text — the fastest path when you already have notes or a transcript. For a short audio clip, use the SEO growth pack upload tab instead.",
  },
  {
    q: "Does this help AI cite my podcast?",
    a: "Publishing structured text with clear headings and honest FAQ pairs on your domain gives AI answer engines extractable content to reference. Rankings and AI citations are never guaranteed.",
  },
] as const;

function PageJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(freeShowNotesGeneratorPageJsonLd()) }}
    />
  );
}

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
  title: "Free AI Show Notes Generator from Podcast Transcript (No Login)",
  description: `Free AI tool for solo podcasters: paste show notes or a transcript, get an SEO blog draft, FAQ blocks, and social scripts. No login — ${pricing.free.ipDailyLimit} free runs per day.`,
  alternates: { canonical },
  openGraph: {
    title: "Free AI Show Notes Generator (No Login)",
    description:
      "Paste podcast show notes or transcript text → SEO blog draft, FAQ, and social scripts. Free daily limit, no account required.",
    url: canonical,
    images: [{ url: `${siteConfig.url}/opengraph-image` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Show Notes Generator (No Login)",
    description: "Paste show notes → SEO blog draft + FAQ. Free, no login.",
    images: [`${siteConfig.url}/opengraph-image`],
  },
};

export default function FreeShowNotesGeneratorPage() {
  return (
    <div className="border-b border-border bg-background">
      <PageJsonLd />
      <FaqJsonLd />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Free tool · No login</p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Free AI show notes generator from podcast transcript
        </h1>
        <p className="mt-2 text-base font-medium text-foreground sm:text-lg">
          Paste notes in → get an SEO blog draft out
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          For <strong className="text-foreground">solo podcasters without an editor</strong>: paste show notes or
          transcript text, get a structured SEO blog draft, FAQ blocks, and social scripts — publish on your own site.
          This is not an audio-to-show-notes uploader; it turns text you already have into a publishable draft pack.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{productPromise.geoLine}</p>

        <GuideDraftPrefill
          location="geo_show_notes_generator"
          heading="Generate from show notes or transcript"
          description="Paste below, then continue to the free generator. No signup for the daily free limit."
          fieldId="geo-show-notes-prefill"
          className="my-8 rounded-2xl border border-primary/40 bg-card/90 p-6 shadow-lg shadow-black/10 ring-1 ring-primary/20 sm:p-8"
        />

        <section className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">Who this is for</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Indie hosts who write bullet show notes but do not have time to turn them into a blog post</li>
            <li>Teams repurposing one episode into searchable text on their own domain</li>
            <li>Creators who want FAQ-style blocks AI answer engines can quote — not just audio inside Spotify</li>
          </ul>

          <h2 className="pt-4 text-xl font-semibold text-foreground">How to use it (3 steps)</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Paste</strong> show notes, an outline, or transcript text above (or
              start from the{" "}
              <Link href="/guides/show-notes-template" className="text-primary hover:underline">
                podcast show notes template
              </Link>
              ).
            </li>
            <li>
              <strong className="text-foreground">Generate</strong> — get an SEO article draft, FAQ pairs, and social
              scripts in one pack.
            </li>
            <li>
              <strong className="text-foreground">Edit and publish</strong> on your website. Run the{" "}
              <Link href="/resources/podcast-to-blog-seo-checklist" className="text-primary hover:underline">
                SEO checklist
              </Link>{" "}
              before you hit publish.
            </li>
          </ol>

          <h2 className="pt-4 text-xl font-semibold text-foreground">SEO and GEO: why structured show notes matter</h2>
          <p>
            Google indexes text on your domain — not audio trapped in a podcast app. Clear headings, takeaways, and
            honest FAQ blocks also give AI answer engines (ChatGPT, Perplexity, Google AI Overviews){" "}
            <strong className="text-foreground">extractable answers</strong> to cite when listeners search in plain
            language. {rankingDisclaimer}
          </p>
          <p>
            Need a filled example first? See our{" "}
            <Link href="/examples/sample-growth-pack" className="text-primary hover:underline">
              podcast show notes examples
            </Link>{" "}
            and sample blog structure.
          </p>
        </section>

        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-foreground">Common questions</h2>
          <dl className="mt-5 space-y-5">
            {faq.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-foreground">{item.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-center text-xs text-muted-foreground">{freeLimitsInline()}</p>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Full generator with audio upload:{" "}
            <Link href="/tools/seo-growth-pack#pack-transcript-only" className="text-primary hover:underline">
              SEO growth pack
            </Link>
            {" · "}
            <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
              Podcast to blog guide
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
