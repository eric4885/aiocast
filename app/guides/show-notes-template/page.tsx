import type { Metadata } from "next";
import Link from "next/link";
import { GuideDraftPrefill } from "@/components/guides/GuideDraftPrefill";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { siteConfig } from "@/lib/data";
import { productPromise } from "@/lib/product-copy";

const faq = [
  {
    q: "How long should podcast show notes be?",
    a: "Aim for 150–400 words on your own domain — enough for a hook, three to five takeaways, topic seeds, and one listener question. Apple and Spotify blurbs can stay shorter; your site should carry the full, indexable version that feeds blog drafts and FAQ blocks.",
  },
  {
    q: "Can podcast show notes replace a transcript for SEO?",
    a: "For many episodes, yes — if your notes include searchable topic seeds and a listener question, not just timestamps. A full transcript adds detail, but structured show notes are enough to generate an SEO article draft with the growth pack.",
  },
  {
    q: "How do I add podcast show notes to WordPress or Blogger?",
    a: "Fill this template, paste the outline into AioCast's show notes to HTML converter, then paste the HTML block into WordPress (block or classic editor) or Blogger (HTML view). Add your audio embed or episode link above the notes.",
  },
  {
    q: "What's the difference between show notes and an episode description?",
    a: "Episode descriptions in Apple or Spotify are short discovery blurbs. Show notes on your website are the full written summary — hook, takeaways, links, and the question the episode answers — that Google can index and you can expand into a blog post.",
  },
  {
    q: "Can I reuse my Spotify show notes on my own site?",
    a: "Yes. Copy the episode description or show notes you already wrote for Spotify, paste them into AioCast's free paste-notes → draft tool, and get an SEO blog draft plus FAQ for your own domain. Spotify stays your listening surface; your website becomes the indexable page. This is not a Spotify transcription tool — you paste text you already have.",
  },
  {
    q: "Is there an AI that can summarize a podcast?",
    a: "Yes — if you already have show notes, episode notes, or a transcript. Paste that text into AioCast to get a structured summary-style SEO draft with FAQ blocks. We do not upload or transcribe full episode audio here; for a short clip, use the SEO growth pack upload tab. No login for the daily free limit.",
  },
  {
    q: "Is there a free podcast show notes generator?",
    a: "Yes. Paste your filled template into AioCast's free paste-notes → draft tool — no login for the daily free limit — to get an SEO blog draft, FAQ blocks, and social scripts.",
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
  title: "Podcast Show Notes — Free Template & AI Generator",
  description:
    "Free podcast show notes template (also called episode notes): hook, takeaways, listener question. Reuse Spotify show notes on your site, then paste into our free AI generator — no login.",
  alternates: { canonical: `${siteConfig.url}/guides/show-notes-template` },
  openGraph: {
    title: "Podcast Show Notes — Free Template",
    description:
      "Copy-paste podcast show notes template + free AI draft generator. Reuse Spotify notes as a publish-ready SEO pack.",
    url: `${siteConfig.url}/guides/show-notes-template`,
    images: [{ url: `${siteConfig.url}/opengraph-image` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Podcast Show Notes — Free Template",
    images: [`${siteConfig.url}/opengraph-image`],
  },
};

export default function ShowNotesTemplateGuidePage() {
  return (
    <>
      <FaqJsonLd />
      <GuideLayout
        title="Podcast show notes — free template & format"
        description="Learn how to write podcast show notes (episode notes) that Google and skimmers can use — then turn them into an SEO blog draft with our free generator. Includes a copy-paste podcast show notes template."
        path="/guides/show-notes-template"
        datePublished="2026-06-18"
        dateModified="2026-08-29"
        showTopCta
      >
        <h2>What are podcast show notes?</h2>
        <p>
          <strong>Podcast show notes</strong> — also called <strong>podcast episode notes</strong> — are the written
          summary on your website: hook, takeaways, links, and the one question this episode answers. Apple and Spotify
          only show a thin blurb; your domain should carry the full, indexable version. This page gives you a{" "}
          <strong>podcast show notes template</strong> plus a path to an SEO blog draft.
        </p>
        <p className="text-sm text-muted-foreground">{productPromise.geoLine}</p>

        <h2>How to write podcast show notes</h2>
        <p>
          Start with one searchable listener question, not an inside-joke episode title. Stuck on the headline? Try the{" "}
          <Link href="/tools/free-podcast-title-generator" className="text-primary hover:underline">
            free podcast title generator
          </Link>{" "}
          before you fill the template. Then complete four fields: hook, takeaways, topic seeds (future H2s), and
          resources. Skip timestamp walls — they do not help Google understand intent. Need a filled walkthrough? See{" "}
          <Link href="/examples/sample-growth-pack" className="text-primary hover:underline">
            podcast show notes examples
          </Link>{" "}
          in our sample pack.
        </p>
        <ol>
          <li>
            <strong>Pick one angle</strong> — the problem this episode solves in plain language.
          </li>
          <li>
            <strong>Write the hook</strong> — who it is for + outcome in one or two sentences.
          </li>
          <li>
            <strong>List 3–5 takeaways</strong> — these become FAQ and social hooks later.
          </li>
          <li>
            <strong>Add topic seeds</strong> — draft H2 headings before you record when you can.
          </li>
        </ol>

        <GuideDraftPrefill
          location="guide_show_notes_template"
          heading="Turn your show notes into a blog draft"
          fieldId="show-notes-template-prefill"
        />

        <h2>Free podcast show notes template (copy-paste)</h2>
        <p>
          Use this outline before you record when you can. Better inputs mean cleaner blog drafts, FAQ blocks, and social
          hooks after you publish. Part of the full{" "}
          <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
            podcast to blog
          </Link>{" "}
          workflow — or jump straight to the{" "}
          <Link href="/tools/free-show-notes-generator" className="text-primary hover:underline">
            free paste-notes → draft tool
          </Link>{" "}
          (no login).
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/40 p-4 text-sm text-foreground/90">{`Episode title:
One-sentence hook (who this is for + outcome):

3–5 bullet takeaways:
-
-
-

Topics covered (H2 seeds):
-
-

Guest / links mentioned:
-

One listener question this episode answers:`}</pre>

        <h2>Podcast show notes example (filled)</h2>
        <p>Here is what the template looks like with real content — not a timestamp dump:</p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/40 p-4 text-sm text-foreground/90">{`Episode title: How to Set Up a Remote Podcast Studio on a Budget

One-sentence hook: Indie hosts can record interview-quality audio for under $200 if you prioritize the room and gain staging over fancy mics.

3–5 bullet takeaways:
- Treat the room before you upgrade the mic
- Aim for -12 to -6 dBFS on speech with headroom
- Ask remote guests for separate tracks, not a mixed Zoom file
- Back up to cloud and local disk before you edit

Topics covered (H2 seeds):
- USB vs XLR on a budget
- Room treatment without foam everywhere
- Backup workflow before Riverside export

Guest / links mentioned: Riverside FAQ on multitrack, Descript export guide

One listener question this episode answers: What is the cheapest way to get separate tracks for remote guests?`}</pre>

        <h2>Why each field matters</h2>
        <ul>
          <li>
            <strong>Hook</strong> — becomes meta description fodder; keep under ~155 characters when you adapt it for
            your blog post.
          </li>
          <li>
            <strong>Takeaways</strong> — map directly to FAQ questions and social hooks in your growth pack output.
          </li>
          <li>
            <strong>Topics covered</strong> — seed H2 headings for the article (rename before publish so they match search
            intent, not transcript chapter titles).
          </li>
          <li>
            <strong>Listener question</strong> — pick one for your primary keyword angle; one episode, one searchable
            promise.
          </li>
        </ul>

        <h2>Common show notes mistakes</h2>
        <ul>
          <li>
            <strong>Episode title only</strong> — no searchable angle for Google or skimmers.
          </li>
          <li>
            <strong>Timestamp walls</strong> — fine for superfans, useless as SEO input.
          </li>
          <li>
            <strong>Generic blurbs</strong> — &quot;Great episode!&quot; with no takeaway or listener question.
          </li>
          <li>
            <strong>Duplicate thin copy</strong> — pasting the same two sentences on Apple, Spotify, and your blog without
            expanding on your domain.
          </li>
        </ul>

        <h2>How long should podcast show notes be?</h2>
        <p>
          On your own domain, aim for <strong>150–400 words</strong> — not a timestamp wall, not a two-sentence blurb.
          That range fits a hook, three to five takeaways, topic seeds, and one listener question without overwhelming
          skimmers. Apple and Spotify can keep shorter discovery copy; your website should carry the full version Google
          can index.
        </p>

        <h2>Podcast show notes vs transcript — which is better for SEO?</h2>
        <p>
          A full transcript gives richer quotes and subheadings, but <strong>structured show notes often ship faster</strong>{" "}
          and still feed SEO drafts when they include topic seeds and a searchable listener question. Either path works
          with the{" "}
          <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
            podcast to blog post framework
          </Link>
          .
        </p>

        <h2>Published on Spotify? Reuse those show notes on your own site</h2>
        <p>
          If you already write <strong>Spotify show notes</strong> (the episode description in Spotify for Creators or
          your host), you do not need to start from a blank page. Copy that text, then paste it into our{" "}
          <Link href="/tools/free-show-notes-generator" className="text-primary hover:underline">
            free paste-notes → draft tool
          </Link>{" "}
          to turn it into a publish-ready SEO pack for <strong>your own domain</strong> — title suggestions, article
          draft, FAQ blocks, and social scripts.
        </p>
        <p>
          Spotify remains where people listen; Google and AI answer engines mainly read text on a website you control.
          AioCast is not a Spotify transcription or chapter tool — it takes show notes or episode notes you already
          have and expands them into indexable content. After you publish, run the{" "}
          <Link href="/resources/podcast-to-blog-seo-checklist" className="text-primary hover:underline">
            podcast to blog SEO checklist
          </Link>
          .
        </p>

        <h2>Publish show notes on your site</h2>
        <p>
          Paste the filled outline into the{" "}
          <Link href="/tools/show-notes-to-html" className="text-primary hover:underline">
            show notes to HTML converter
          </Link>{" "}
          for WordPress, Ghost, or Webflow. For a full SEO article draft from the same notes, use the{" "}
          <Link href="/tools/free-show-notes-generator" className="text-primary hover:underline">
            free paste-notes → draft tool
          </Link>{" "}
          or the{" "}
          <Link href="/tools/seo-growth-pack#pack-transcript-only" className="text-primary hover:underline">
            SEO growth pack
          </Link>
          .
        </p>

        <h2>Before you record</h2>
        <p>
          Clean audio means cleaner transcripts. Run through our{" "}
          <Link href="/resources/pre-flight-checklist" className="text-primary hover:underline">
            preflight checklist for podcast recording
          </Link>{" "}
          for gain staging, backups, and room noise.
        </p>

        <h2>Common questions</h2>
        <dl className="space-y-4">
          {faq.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-foreground">{item.q}</dt>
              <dd className="mt-1 text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>

        <h2>Related guides</h2>
        <ul>
          <li>
            <Link href="/tools/free-show-notes-generator" className="text-primary hover:underline">
              Paste notes → blog draft
            </Link>
          </li>
          <li>
            <Link href="/tools/free-podcast-title-generator" className="text-primary hover:underline">
              Free podcast title generator
            </Link>
          </li>
          <li>
            <Link href="/resources/podcast-to-blog-seo-checklist" className="text-primary hover:underline">
              Podcast to blog SEO checklist
            </Link>
          </li>
          <li>
            <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
              How to turn a podcast into a blog post
            </Link>
          </li>
          <li>
            <Link href="/examples/sample-growth-pack" className="text-primary hover:underline">
              Podcast show notes examples
            </Link>
          </li>
          <li>
            <Link href="/tools/show-notes-to-html" className="text-primary hover:underline">
              Show notes → HTML converter
            </Link>
          </li>
        </ul>
      </GuideLayout>
    </>
  );
}
