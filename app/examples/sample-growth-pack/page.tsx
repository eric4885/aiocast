import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicPackPreview } from "@/components/examples/PublicPackPreview";
import { ProStickyPromo } from "@/components/pricing/ProStickyPromo";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sample SEO growth pack output — podcast to blog example",
  description:
    "See a full podcast to blog example: SEO article draft, FAQ blocks, social scripts, and 7-day publish plan from one episode — before you generate your own.",
  alternates: { canonical: `${siteConfig.url}/examples/sample-growth-pack` },
  openGraph: {
    title: "Sample podcast SEO growth pack",
    description: "Example article, FAQ, social scripts, and publish schedule from AioCast.com.",
    url: `${siteConfig.url}/examples/sample-growth-pack`,
  },
};

const faq = [
  {
    q: "What is a podcast to blog example?",
    a: "A sample of what one episode can become on your website: a long-form SEO article draft, FAQ pairs, channel-native social scripts, and a simple publish schedule — not a live RSS feed or guaranteed rankings.",
  },
  {
    q: "Who is this sample growth pack for?",
    a: "Solo podcasters and small teams who want to see output before pasting a transcript or show notes into the free generator — especially if you do not have an editor or content agency.",
  },
  {
    q: "Do I need a full transcript to get results like this?",
    a: "A full transcript helps, but structured show notes with a hook, takeaways, and one listener question are enough for a solid first draft. Run the preflight checklist before recording so your capture is transcript-ready.",
  },
] as const;

function ExampleArticleJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");
  const payload = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How Indie Podcasters Turn One Episode Into a Week of SEO Content",
    description:
      "Example SEO article draft from the AioCast growth pack — illustrative output for podcast-to-blog repurposing.",
    datePublished: "2026-06-20",
    dateModified: "2026-07-20",
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: base,
      logo: { "@type": "ImageObject", url: `${base}/opengraph-image` },
    },
    image: [`${base}/opengraph-image`],
    mainEntityOfPage: `${base}/examples/sample-growth-pack`,
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
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

export default function SampleGrowthPackExamplePage() {
  return (
    <>
      <ExampleArticleJsonLd />
      <FaqJsonLd />
      <div className="border-b border-border bg-gradient-hero bg-grid-subtle">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            {" · "}
            <Link href="/tools/seo-growth-pack" className="text-primary hover:underline">
              Generate SEO pack
            </Link>
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">Public example</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Sample SEO growth pack output</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            This is a static demo of what the free tool delivers — not a live user pack. Generate your own from your
            transcript or show notes; always edit before publishing.
          </p>

          <section className="mt-10 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground">
            <h2 className="text-lg font-semibold text-foreground">What&apos;s in this podcast to blog example</h2>
            <p>
              One episode becomes a <strong className="text-foreground">publish workflow</strong>, not a magic ranking
              button. The sample below shows four deliverables indie podcasters actually use: an SEO article draft with
              title tag and meta description, FAQ blocks you can paste under the post, social scripts sized for X and
              LinkedIn, and a lightweight 7-day publish plan so you are not guessing what to ship first.
            </p>
            <p>
              This is different from copying your Apple Podcasts blurb into WordPress. The draft is structured for
              search intent — headings, takeaways, and a listener question — so you edit for voice instead of staring at
              a blank page. AioCast does not host your blog or promise traffic; you publish on your domain and Google
              indexes your URL over time.
            </p>
            <p>
              <strong className="text-foreground">Good fit if you:</strong>
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Record solo or interview episodes and want one repeatable repurposing pass</li>
              <li>Have show notes or a rough transcript but no content team</li>
              <li>Want to preview output before pasting your own episode into the generator</li>
            </ul>
            <p>
              Before you generate, run the{" "}
              <Link href="/resources/pre-flight-checklist" className="text-primary underline-offset-4 hover:underline">
                printable preflight checklist
              </Link>{" "}
              so your audio is transcript-ready — cleaner captures mean less cleanup in the draft. For the full{" "}
              <Link href="/guides/podcast-to-blog-post" className="text-primary underline-offset-4 hover:underline">
                podcast to blog
              </Link>{" "}
              workflow after you generate, follow the step-by-step guide.
            </p>
            <Button size="lg" asChild className="mt-2">
              <Link href="/tools/seo-growth-pack">Generate your own growth pack</Link>
            </Button>
          </section>

          <PublicPackPreview />
          <ProStickyPromo className="mt-10" />

          <section className="mt-12 max-w-2xl space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Common questions</h2>
            {faq.map((item) => (
              <div key={item.q}>
                <p className="text-sm font-semibold text-foreground">{item.q}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
