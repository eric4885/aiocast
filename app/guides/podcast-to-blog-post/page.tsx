import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "How to turn a podcast into a blog post (step-by-step)",
  description:
    "A practical workflow for indie podcasters: transcript to SEO article, FAQ blocks, and social promotion — with a free tool to draft the pack.",
  alternates: { canonical: `${siteConfig.url}/guides/podcast-to-blog-post` },
  openGraph: {
    title: "Podcast to blog post workflow",
    url: `${siteConfig.url}/guides/podcast-to-blog-post`,
  },
};

export default function PodcastToBlogGuidePage() {
  return (
    <GuideLayout
      title="How to turn a podcast episode into a blog post"
      description="Search engines index text, not your RSS audio file. This is a realistic weekly loop for indie hosts — no agency required."
    >
      <h2>Why bother?</h2>
      <p>
        Spotify and Apple Podcasts rarely send organic search traffic to your site. A written article on your domain
        gives Google something to rank — and gives listeners a place to share when they recommend an episode.
      </p>

      <h2>Step 1 — Export a transcript (good enough beats perfect)</h2>
      <p>
        Use Descript, Riverside, or your host&apos;s transcript export. You do not need a literary script — section breaks
        and speaker labels are enough. If you only have bullet show notes, paste those instead.
      </p>

      <h2>Step 2 — Pick one target keyword</h2>
      <p>
        Choose one phrase a listener might type when looking for this topic — not your show name. Example: &quot;remote
        podcast recording setup&quot; instead of &quot;Episode 47 with Jane.&quot; Everything in the article should support
        that angle.
      </p>

      <h2>Step 3 — Generate a draft pack, then edit like a human</h2>
      <p>
        Paste your transcript into the{" "}
        <Link href="/tools/seo-growth-pack" className="text-primary hover:underline">
          free SEO growth pack
        </Link>
        . You get a long-form draft, FAQ blocks, social scripts, and a 7-day rollout plan. Treat the article as a
        first draft: fix facts, cut filler, add your voice, and verify any stats or claims.
      </p>

      <h2>Step 4 — Publish on your blog with basic on-page SEO</h2>
      <ol>
        <li>Set the page title and meta description (the pack includes suggestions).</li>
        <li>Use H2 headings that match search intent, not transcript chapter names.</li>
        <li>Add FAQ as an accordion or a dedicated section — three Q&amp;A pairs is a solid start.</li>
        <li>Link to related episodes from older posts (internal links help discovery).</li>
      </ol>

      <h2>Step 5 — Promote with the social scripts</h2>
      <p>
        Post LinkedIn and X copy after the article is live so links resolve. Use the included 7-day plan as a rhythm
        guide, not autopilot — adapt timing to your audience.
      </p>

      <h2>What this does not do</h2>
      <p>
        No tool guarantees rankings. You still need a domain, consistent publishing, and time for Google to crawl. The
        win is cutting draft time from hours to minutes so you actually ship the post. See a{" "}
        <Link href="/examples/sample-growth-pack" className="text-primary hover:underline">
          full example output
        </Link>{" "}
        before you run your own episode.
      </p>
    </GuideLayout>
  );
}
