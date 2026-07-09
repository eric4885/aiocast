import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { siteConfig } from "@/lib/data";

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
  title: "Show Notes for Podcast — Free Template + HTML Converter",
  description:
    "Free show notes for podcast — copy-paste template with hook, takeaways, and topic seeds. Format notes as HTML for WordPress or Ghost in one paste.",
  alternates: { canonical: `${siteConfig.url}/guides/show-notes-template` },
  openGraph: {
    title: "Show notes for podcast — free template + HTML converter",
    description:
      "Structured show notes for podcast episodes — hook, takeaways, topic seeds, and one listener question. Paste into our HTML converter for your site.",
    url: `${siteConfig.url}/guides/show-notes-template`,
  },
};

export default function ShowNotesTemplateGuidePage() {
  return (
    <>
    <FaqJsonLd />
    <GuideLayout
      title="Show notes for podcast — free SEO-ready template"
      description="Good show notes for podcast episodes are more than timestamp dumps. This copy-paste outline gives Google and skimmers something searchable — then paste into our HTML converter for your site."
    >
      <h2>What are show notes for podcast episodes?</h2>
      <p>
        <strong>Show notes for podcast</strong> episodes are the written summary on your website or in your RSS feed —
        hook, takeaways, links, and the one question this episode answers. Apple and Spotify show a thin blurb; your
        domain should carry the full, indexable version. This template is that starting point.
      </p>

      <h2>Copy-paste outline</h2>
      <p>
        Use this <strong>podcast show notes template</strong> before you record when you can. Better inputs mean cleaner
        blog drafts, FAQ blocks, and social hooks after you publish. Part of the full{" "}
        <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
          podcast to blog post workflow
        </Link>
        .
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

      <h2>Filled example</h2>
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
      <p>
        If you only have five minutes after recording, fill the template fields first and expand later. A structured
        outline beats waiting for a perfect transcript export.
      </p>

      <h2>Podcast show notes vs transcript — which is better for SEO?</h2>
      <p>
        A full transcript gives richer quotes and subheadings, but <strong>structured show notes often ship faster</strong>{" "}
        and still feed SEO drafts when they include topic seeds and a searchable listener question. Timestamps alone do
        not help Google understand intent — semantic fields do.
      </p>
      <p>
        Practical rule: use show notes when you want to publish this week; add transcript quotes when you have them.
        Either path works with the{" "}
        <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
          podcast to blog post framework
        </Link>{" "}
        — paste notes or transcript into the growth pack and edit the draft before publish.
      </p>

      <h2>How show notes feed SEO</h2>
      <p>
        The hook feeds your meta description. Takeaways become FAQ pairs and social scripts. Topic seeds become H2
        headings after you edit for search intent. The listener question anchors one long-tail keyword per episode.
      </p>
      <p>
        Ready to publish on your site? Paste the filled outline into the{" "}
        <Link href="/tools/show-notes-to-html" className="text-primary hover:underline">
          show notes to HTML converter
        </Link>{" "}
        — get heading and list tags for WordPress, Ghost, or Webflow without writing markup by hand.
      </p>
      <p>
        Want a full SEO article draft instead of formatted notes? Paste the template — or a full transcript — into the{" "}
        <Link href="/tools/seo-growth-pack#pack-transcript-only" className="text-primary hover:underline">
          Generate SEO pack
        </Link>{" "}
        tool. Pasted text is the fastest path; short audio samples work when you do not have notes yet.
      </p>

      <h2>Before you record</h2>
      <p>
        Clean audio means cleaner transcripts. Run through our{" "}
        <Link href="/resources/pre-flight-checklist" className="text-primary hover:underline">
          preflight checklist for podcast recording
        </Link>{" "}
        for gain staging, backups, and room noise — especially if you plan to upload audio for auto-transcription.
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
          <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
            How to turn a podcast into a blog post
          </Link>
        </li>
        <li>
          <Link href="/guides/podcast-faq-for-seo" className="text-primary hover:underline">
            FAQ blocks for SEO
          </Link>
        </li>
        <li>
          <Link href="/examples/sample-growth-pack" className="text-primary hover:underline">
            Example growth pack output
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
