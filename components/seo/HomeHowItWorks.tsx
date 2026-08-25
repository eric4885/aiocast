import Link from "next/link";

const steps = [
  {
    title: "Paste show notes or a transcript",
    body: "A structured outline is enough — you do not need a perfect export before you draft.",
  },
  {
    title: "Generate an SEO blog draft",
    body: "Get a title, meta, intent-based headings, FAQ blocks, and social scripts in one pack.",
  },
  {
    title: "Edit and publish on your domain",
    body: "Verify claims, match your voice, then ship on your own site — rankings are never guaranteed.",
  },
] as const;

const faq = [
  {
    q: "How do I turn one podcast episode into a blog post?",
    a: "Paste show notes or a transcript into the free generator above, pick one listener question as your angle, edit the draft for your voice, then publish on your own domain with a clear title tag and a short FAQ.",
  },
  {
    q: "Do I need a full transcript?",
    a: "No. Structured show notes with a hook, takeaways, topic seeds, and one listener question are enough for a solid first draft. Add transcript quotes later when you have them.",
  },
  {
    q: "Are show notes enough for an SEO blog draft?",
    a: "Yes — if they solve a searchable problem instead of dumping timestamps. Paste them into the free show notes generator or growth pack, or start from the podcast show notes template.",
  },
  {
    q: "Can AI answer engines cite my podcast?",
    a: "Publishing structured text with clear headings and honest FAQ pairs on your domain gives AI systems extractable content to reference. Citations are never guaranteed.",
  },
] as const;

function HomeFaqJsonLd() {
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

/** Server-rendered how-to + product FAQ for homepage semantic depth (keeps hero short). */
export function HomeHowItWorks() {
  return (
    <section className="border-t border-border bg-background py-12 sm:py-14">
      <HomeFaqJsonLd />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-balance text-2xl font-bold tracking-tight sm:text-[1.75rem]">
          How to turn a podcast into a blog post here
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          Three steps — paste, generate, publish. Full walkthrough in the{" "}
          <Link
            href="/guides/podcast-to-blog-post"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            podcast to blog post guide
          </Link>
          .
        </p>

        <ol className="mt-8 space-y-5">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary"
                aria-hidden
              >
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-foreground">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 text-center text-xl font-bold tracking-tight sm:text-2xl">Common questions</h2>
        <dl className="mt-6 space-y-5">
          {faq.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-foreground">{item.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
