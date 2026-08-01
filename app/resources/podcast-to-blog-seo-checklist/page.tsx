import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/data";
import { InteractiveSeoChecklist, type ChecklistSection } from "./checklist-client";

const path = "/resources/podcast-to-blog-seo-checklist";
const canonical = `${siteConfig.url}${path}`;

const sections: ChecklistSection[] = [
  {
    title: "1. Intent & keyword",
    items: [
      {
        id: "keyword",
        label: "One problem-solving keyword (not Episode 47)",
        detail:
          "Title the post around a listener search query — e.g. remote podcast setup on a budget — not an archive episode number.",
      },
      {
        id: "searcher",
        label: "Clear who this post helps",
        detail: "Solo host, marketer, or beginner? One primary reader keeps headings focused.",
      },
    ],
  },
  {
    title: "2. Source material",
    items: [
      {
        id: "source",
        label: "Transcript or structured show notes ready",
        detail:
          "Hook, 3–5 takeaways, topic seeds, and one listener question are enough if you do not have a full transcript yet.",
      },
      {
        id: "quotes",
        label: "2–3 quotable lines marked (optional)",
        detail: "Verbatim guest lines become strong pull-quotes and social hooks.",
      },
    ],
  },
  {
    title: "3. On-page SEO",
    items: [
      {
        id: "title-tag",
        label: "Title tag includes the keyword + a benefit",
        detail: "Keep it under ~60 characters when possible. Match search intent, not clickbait.",
      },
      {
        id: "meta",
        label: "Meta description written (not left blank)",
        detail: "One sentence: problem + outcome. You can draft this in the growth pack, then edit.",
      },
      {
        id: "h2",
        label: "H2/H3 match questions, not chapter jokes",
        detail: "Replace “Jane’s gear rant” with “Essential hardware for low-cost remote audio”.",
      },
      {
        id: "faq",
        label: "At least 3 FAQ pairs on the page",
        detail: "Real questions from the episode — honest answers help skimmers and AI answer engines.",
      },
      {
        id: "internal",
        label: "Internal links to related posts or tools",
        detail: "Never publish a lone URL. Link from older posts and out to your show notes or tools.",
      },
    ],
  },
  {
    title: "4. Publish & promote",
    items: [
      {
        id: "own-domain",
        label: "Published on your own domain (not only Apple/Spotify)",
        detail: "Search indexes your site. Apps rarely send lasting organic traffic.",
      },
      {
        id: "canonical",
        label: "Canonical URL and preview link resolve",
        detail: "Publish the article before you blast social so Open Graph and shares look correct.",
      },
      {
        id: "social",
        label: "X + LinkedIn (or newsletter) scripts ready",
        detail: "Ship article first, then distribute. Adapt scripts — do not paste AI verbatim.",
      },
    ],
  },
];

const faq = [
  {
    q: "What is a podcast to blog SEO checklist?",
    a: "A publish-ready checklist that turns one episode into an indexable blog post: keyword intent, show notes or transcript, on-page SEO, FAQ, and promotion — so you do not skip the steps that help search.",
  },
  {
    q: "How is this different from a recording preflight checklist?",
    a: "Preflight covers room noise, gain, and backups before you hit Record. This SEO checklist is used after you have notes or a transcript, when you are about to publish the blog post.",
  },
  {
    q: "Do I need a full transcript to use this checklist?",
    a: "No. Structured show notes with a hook, takeaways, topic seeds, and one listener question are enough to draft and check an SEO post. Add transcript quotes when you have them.",
  },
  {
    q: "Can I copy this checklist into Notion or Docs?",
    a: "Yes. Use Copy Markdown above — checkboxes export as GitHub-style task lists you can paste into Notion, Docs, or a GitHub issue.",
  },
  {
    q: "How does this connect to the AioCast growth pack?",
    a: "Run the checklist while you edit. When you want a first draft of the article, FAQ, and social scripts, paste your notes or transcript into the free SEO growth pack, then come back and tick the remaining SEO items.",
  },
  {
    q: "Will this checklist rank my podcast blog overnight?",
    a: "No tool guarantees rankings. This list reduces skipped basics so each episode page is search-ready. Results still need a healthy domain, consistency, and time.",
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

function HowToJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to turn a podcast into an SEO blog post with a checklist",
    description:
      "Use a podcast to blog SEO checklist: pick one keyword, prepare notes, implement on-page SEO, publish on your domain, then promote.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick one problem-solving keyword",
        text: "Choose a searchable listener question instead of an episode archive title.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Prepare transcript or show notes",
        text: "Export a transcript or fill structured show notes with hook, takeaways, and one listener question.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Draft and edit the post",
        text: "Generate a first draft if needed, then edit for voice, claims, and skimmable headings.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Complete on-page SEO checks",
        text: "Title tag, meta description, intent-based H2s, FAQ, and internal links.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Publish and promote",
        text: "Publish on your domain first, then share with social or newsletter scripts.",
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}

function BreadcrumbJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");
  const payload = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Resources", item: `${base}/resources` },
      { "@type": "ListItem", position: 3, name: "Podcast to blog SEO checklist", item: canonical },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}

export const metadata: Metadata = {
  title: "Podcast to blog SEO checklist (free, interactive) — 2026",
  description:
    "Free podcast to blog SEO checklist: keyword, show notes, on-page SEO, FAQ, and promotion. Interactive checkboxes + Markdown export. No signup.",
  alternates: { canonical },
  openGraph: {
    title: "Podcast to blog SEO checklist (free)",
    description:
      "Interactive SEO checklist for turning a podcast episode into a publish-ready blog post — no signup.",
    url: canonical,
  },
};

export default function PodcastToBlogSeoChecklistPage() {
  return (
    <>
      <FaqJsonLd />
      <HowToJsonLd />
      <BreadcrumbJsonLd />
      <div className="border-b border-border bg-background bg-grid-subtle">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="text-primary hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li>
                <Link href="/resources" className="text-primary hover:underline">
                  Resources
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li className="text-foreground/80">SEO checklist</li>
            </ol>
          </nav>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">Free resource</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Podcast to blog SEO checklist
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A practical, interactive checklist for indie hosts — turn one episode into a search-ready blog post without
            skipping on-page basics. No signup. Updated for 2026 workflows.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href="/tools/seo-growth-pack#pack-transcript-only">Paste notes → get draft pack</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/guides/podcast-to-blog-post">Full podcast to blog guide</Link>
            </Button>
          </div>

          {/* Screen 1: tool */}
          <div className="mt-10">
            <InteractiveSeoChecklist sections={sections} />
          </div>

          {/* Screen 2: explanatory content */}
          <article className="mt-14 space-y-6 text-[15px] leading-relaxed text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground">
              How to turn a podcast into an SEO blog post (2026)
            </h2>
            <p>
              Spotify and Apple rarely send lasting organic traffic to your domain. To compound search visibility, each
              episode needs structured text on a URL you control. Use this checklist after recording — when you have a
              transcript or{" "}
              <Link href="/guides/show-notes-template" className="text-primary underline-offset-4 hover:underline">
                show notes
              </Link>
              — and before you hit publish.
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Pick one keyword</strong> that matches a listener problem, not an
                episode number.
              </li>
              <li>
                <strong className="text-foreground">Draft from notes or a transcript</strong> — paste into the{" "}
                <Link href="/tools/seo-growth-pack" className="text-primary underline-offset-4 hover:underline">
                  free SEO growth pack
                </Link>{" "}
                if you want headings, FAQ, and social scripts in one pass.
              </li>
              <li>
                <strong className="text-foreground">Tick every on-page item</strong> above — title, meta, H2s, FAQ,
                internal links.
              </li>
              <li>
                <strong className="text-foreground">Publish on your site first</strong>, then promote. Compare with our{" "}
                <Link href="/examples/sample-growth-pack" className="text-primary underline-offset-4 hover:underline">
                  podcast to blog example
                </Link>{" "}
                if you want to see structure before you write.
              </li>
            </ol>
            <p>
              Recording next week? Use the{" "}
              <Link href="/resources/pre-flight-checklist" className="text-primary underline-offset-4 hover:underline">
                printable preflight checklist
              </Link>{" "}
              for room noise and gain — different job, earlier in the workflow.
            </p>
          </article>

          {/* Screen 3: FAQ + CTA */}
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-foreground">Common questions</h2>
            <dl className="mt-5 space-y-5">
              {faq.map((item) => (
                <div key={item.q}>
                  <dt className="font-semibold text-foreground">{item.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center sm:p-8">
            <p className="text-lg font-semibold text-foreground">Ready for a first draft?</p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
              Paste your show notes or transcript into the free growth pack — get an SEO article draft, FAQ blocks, and
              social scripts, then finish the checklist items above.
            </p>
            <Button size="lg" asChild className="mt-5">
              <Link href="/tools/seo-growth-pack#pack-transcript-only">Open free SEO growth pack</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
