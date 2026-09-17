import type { Metadata } from "next";
import Link from "next/link";
import { GuideDraftPrefill } from "@/components/guides/GuideDraftPrefill";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { siteConfig } from "@/lib/data";
import { productPromise } from "@/lib/product-copy";

const PACK_HREF = "/tools/seo-growth-pack#pack-transcript-only";
const GEO_HREF = "/tools/free-show-notes-generator";

/** PAA-style questions — visible H3 + FAQPage JSON-LD for GEO. */
const faq = [
  {
    q: "How to write podcast show notes for SEO?",
    a: "Write for your own domain, not only the podcast app: a searchable title, 100–180 word summary, chapter-style takeaways, real resource links, and FAQ grounded in the episode. Publish one URL with FAQ / PodcastEpisode schema. Paste existing notes or a transcript into AioCast’s growth pack to structure the draft — do not invent timestamps or URLs that were not in your source.",
  },
  {
    q: "How long should podcast show notes be?",
    a: "Aim for about 150–400 words on your website (hook, takeaways, links, one listener question). Apple and Spotify blurbs stay shorter for discovery; the long version belongs on your site so Google and AI answer engines can index and cite it.",
  },
  {
    q: "Do podcast show notes help with SEO?",
    a: "Yes when they live as crawlable HTML on your domain. Audio alone is hard to index; structured notes plus a blog-style episode page give search engines text, FAQ pairs, and internal links. Notes trapped only inside Spotify or Apple help listeners in-app, not your Google rankings.",
  },
  {
    q: "Should I put timestamps in show notes?",
    a: "Only when your transcript or editor export includes real times. Fake MM:SS looks precise and erodes trust. Without timecodes, use clear chapter titles and action labels — AioCast keeps timestamp null rather than inventing clocks.",
  },
  {
    q: "What is the difference between a podcast description and show notes?",
    a: "A podcast or episode description is the short discovery blurb in Apple, Spotify, or YouTube. Show notes on your website are the full written page: summary, chapters, resources, FAQ, and schema. Reuse the short blurb in apps; publish the long version on your domain.",
  },
  {
    q: "Can I create SEO show notes from a transcript without uploading audio?",
    a: "Yes. AioCast is downstream-only: paste show notes or a transcript you already have (including Otter, Descript, or Riverside exports) and get structured notes, an article draft, FAQ, and copy-ready schema. Full-episode audio transcription belongs in those upstream tools — not as AioCast’s main promise.",
  },
] as const;

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
  title: { absolute: "Podcast Show Notes for SEO — Timestamps, FAQ, Schema" },
  description:
    "How to write podcast show notes for SEO: chapters, FAQ, platform blurbs, and schema on your domain. Paste notes → publish-ready pack — no fake timestamps.",
  alternates: { canonical: `${siteConfig.url}/guides/podcast-show-notes-for-seo` },
  openGraph: {
    title: "Podcast Show Notes for SEO",
    description:
      "Timestamps only when real, FAQ from the episode, PodcastEpisode schema — then publish on your site.",
    url: `${siteConfig.url}/guides/podcast-show-notes-for-seo`,
    images: [{ url: `${siteConfig.url}/opengraph-image` }],
  },
};

export default function PodcastShowNotesForSeoGuidePage() {
  return (
    <>
      <FaqJsonLd />
      <GuideLayout
        title="Podcast show notes for SEO: timestamps, FAQ, schema"
        description="Turn thin episode notes into indexable pages on your own domain — without pretending to be an audio transcription suite."
        path="/guides/podcast-show-notes-for-seo"
        datePublished="2026-09-17"
        dateModified="2026-09-17"
      >
        <p>
          Most indie shows ship two-line Spotify blurbs and wonder why Google never surfaces the episode.{" "}
          <strong className="text-foreground">Show notes for SEO</strong> means a structured written page: summary,
          chapters, resources, FAQ, and schema — published on <em>your</em> domain. AioCast sits on the downstream half
          of that job: you paste notes or a transcript you already have; we structure a publish-ready pack. We do not
          sell “upload MP3 → invent a whole episode.”
        </p>

        <h2 className="text-xl font-semibold text-foreground">1. Start from text you trust</h2>
        <p>
          Paste show notes, an Otter/Descript/Riverside export, or a rough transcript. If the paste is under ~80 words,
          expand it first — a full blog from three bullet points will hallucinate. Prefer evidence over filler.
        </p>

        <h2 className="text-xl font-semibold text-foreground">2. Chapters without fake timestamps</h2>
        <p>
          When your source includes <code className="text-foreground">[MM:SS]</code> markers, keep them. When it does
          not, label chapters by topic only. Invented times look precise and are wrong — listeners notice.
        </p>

        <h2 className="text-xl font-semibold text-foreground">3. Platform blurbs vs website page</h2>
        <p>
          Apple and Spotify need short discovery copy. Your website should carry the long version: takeaways, quotes,
          links, and FAQ. Same episode, two lengths — do not trap the only copy inside the apps.
        </p>

        <h2 className="text-xl font-semibold text-foreground">4. FAQ + schema on one URL</h2>
        <p>
          Publish one episode URL. Add FAQ answers that appear in the episode (or mark questions for you to answer).
          Paste BlogPosting + PodcastEpisode + FAQ JSON-LD from the growth pack results page. Leave{" "}
          <code className="text-foreground">duration</code> blank unless you know the real length.
        </p>

        <h2 className="text-xl font-semibold text-foreground">5. Generate the pack</h2>
        <p>
          Use the box below, or open the{" "}
          <Link href={PACK_HREF} className="text-primary hover:underline">
            SEO growth pack
          </Link>{" "}
          /{" "}
          <Link href={GEO_HREF} className="text-primary hover:underline">
            free paste-notes tool
          </Link>
          . Edit truncation bars and flags on the results page, run the publish checklist, then ship on your CMS.
        </p>

        <GuideDraftPrefill
          description="Paste existing show notes or a transcript. AioCast structures summary, chapters, FAQ, and schema-ready copy — it does not transcribe audio for you."
        />

        <h2 className="text-xl font-semibold text-foreground">People also ask</h2>
        <p className="text-sm text-muted-foreground">
          Short answers for common searches — then paste your notes into the{" "}
          <Link href={PACK_HREF} className="text-primary hover:underline">
            publish-ready pack
          </Link>{" "}
          to structure chapters, FAQ, and schema for your domain.
        </p>
        <div className="space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border border-border/70 bg-background/40 px-4 py-3 open:border-primary/30"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                <h3 className="inline text-base font-semibold">{item.q}</h3>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.a}{" "}
                <Link href={PACK_HREF} className="font-medium text-primary underline-offset-4 hover:underline">
                  Open the growth pack
                </Link>
                .
              </p>
            </details>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Also see the{" "}
          <Link href="/guides/show-notes-template" className="text-primary hover:underline">
            show notes template
          </Link>{" "}
          and {productPromise.primaryOutput.toLowerCase()} workflow on the{" "}
          <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
            podcast to blog guide
          </Link>
          .
        </p>
      </GuideLayout>
    </>
  );
}
