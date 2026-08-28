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
    q: "Why not just use ChatGPT to rewrite my transcript?",
    a: "You can rewrite text in any AI chat. This free show notes generator is for the publish path: a fixed pack (SEO title, article draft, FAQ, social scripts) shaped for podcast episodes, plus guidance so you ship on your own domain — not a one-off chat reply. Rankings are never guaranteed.",
  },
  {
    q: "Does this help AI cite my podcast?",
    a: "Publishing structured text with clear headings and honest FAQ pairs on your domain gives AI answer engines extractable content to reference. Rankings and AI citations are never guaranteed.",
  },
  {
    q: "Is there an AI that can summarize a podcast?",
    a: "Yes — if you already have show notes or a transcript. Paste that text here and this free AI show notes generator returns a structured summary-style blog draft with FAQ blocks you can publish on your site. It does not upload or transcribe audio files; for a short clip, use the SEO growth pack upload tab.",
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
  title: { absolute: "Free AI Show Notes Generator (No Login)" },
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
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{productPromise.vsGenericAi}</p>
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
            Google indexes text on your domain — not audio trapped in a podcast app. A free AI show notes generator that
            outputs clear headings, takeaways, and honest FAQ blocks also gives AI answer engines (ChatGPT, Perplexity,
            Google AI Overviews) <strong className="text-foreground">extractable answers</strong> to cite when listeners
            search in plain language. {rankingDisclaimer}
          </p>
          <p>
            Need a filled example first? See our{" "}
            <Link href="/examples/sample-growth-pack" className="text-primary hover:underline">
              podcast show notes examples
            </Link>{" "}
            and sample blog structure.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-foreground">Which podcast formats work best</h2>
          <p>
            This free show notes generator is built for text you already have — not for replacing a full audio
            workflow. Different episode types need slightly different inputs:
          </p>
          <h3 className="pt-2 text-lg font-semibold text-foreground">Interview episodes</h3>
          <p>
            Paste your guest intro, three to five bullet takeaways, and one listener question from the episode. The
            generator turns that into an SEO blog draft with subheadings and FAQ pairs — a faster path than writing from
            scratch when the conversation was wide-ranging.
          </p>
          <h3 className="pt-2 text-lg font-semibold text-foreground">Solo / monologue shows</h3>
          <p>
            A short outline with your hook, main argument, and one actionable takeaway is enough. The AI show notes tool
            expands that into a publishable article draft with meta suggestions and social scripts for LinkedIn and X.
          </p>
          <h3 className="pt-2 text-lg font-semibold text-foreground">Multi-host or panel discussions</h3>
          <p>
            Include who said what in your bullet notes, or paste a partial transcript of the key segment. The draft pack
            groups ideas by topic instead of by speaker, so you can edit for clarity before publishing on your domain.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-foreground">Before and after: what you get</h2>
          <p>
            Here is a realistic input → output flow for a solo episode about podcast SEO:
          </p>
          <p>
            <strong className="text-foreground">Before (what you paste):</strong> Hook — &ldquo;Most indie hosts skip
            blog posts because show notes feel like busywork.&rdquo; Takeaways — one listener question per episode,
            paste-ready FAQ, title tag under 60 characters. Topic seeds — podcast show notes template, podcast to blog
            post, free AI show notes.
          </p>
          <p>
            <strong className="text-foreground">After (what the generator returns):</strong> A titled SEO article draft
            with intent-based H2s, a short meta description, three FAQ pairs formatted for search features, and two
            social scripts you can edit in minutes. See the full structure in our{" "}
            <Link href="/examples/sample-growth-pack" className="text-primary hover:underline">
              sample growth pack
            </Link>
            .
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
