import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Podcast Show Notes Template (Free Copy-Paste Outline)",
  description:
    "Free podcast show notes template with SEO-ready fields — hook, takeaways, topic seeds, and one listener question. Copy-paste before you record or publish.",
  alternates: { canonical: `${siteConfig.url}/guides/show-notes-template` },
  openGraph: {
    title: "Podcast show notes template (free copy-paste outline)",
    description:
      "Hook, takeaways, topic seeds, and one listener question — a minimal podcast show notes template for faster SEO repurposing.",
    url: `${siteConfig.url}/guides/show-notes-template`,
  },
};

export default function ShowNotesTemplateGuidePage() {
  return (
    <GuideLayout
      title="Podcast show notes template (SEO-ready outline)"
      description="Most hosts either skip show notes or paste timestamp dumps nobody reads. This outline is the middle path — enough structure for SEO repurposing without writing a novel."
    >
      <h2>Copy-paste outline</h2>
      <p>
        Use this <strong>podcast show notes template</strong> before you record when you can. Better inputs mean cleaner
        blog drafts, FAQ blocks, and social hooks after you publish.
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

      <h2>How show notes feed SEO</h2>
      <p>
        The hook feeds your meta description. Takeaways become FAQ pairs and social scripts. Topic seeds become H2
        headings after you edit for search intent. The listener question anchors one long-tail keyword per episode.
      </p>
      <p>
        Paste this filled template — or a full transcript — into the{" "}
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

      <h2>Related guides</h2>
      <ul>
        <li>
          <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
            Podcast → blog post (5-step framework)
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
  );
}
