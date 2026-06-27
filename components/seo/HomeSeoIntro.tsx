import Link from "next/link";

/** Server-rendered homepage intro for crawlers and SEO tools (single H1 on the page). */
export function HomeSeoIntro() {
  return (
    <section className="border-b border-border bg-background bg-grid-subtle">
      <div className="mx-auto max-w-4xl px-4 py-6 text-center sm:px-6 sm:py-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:tracking-[0.2em]">
          Free podcast SEO tool
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-balance text-[clamp(1.55rem,4vw+0.55rem,3rem)] font-bold leading-[1.12] tracking-tight text-foreground">
          Turn your podcast into <span className="text-primary">SEO blog posts in minutes</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed sm:leading-loose text-muted-foreground">
          Stop wasting traffic trapped in Spotify and Apple Podcasts. Paste your transcript or show notes to instantly
          generate an SEO article draft, FAQ blocks, and social scripts — then edit and publish on your own site.
          Browse the{" "}
          <Link href="/examples/sample-growth-pack" className="font-medium text-primary underline-offset-4 hover:underline">
            sample output
          </Link>{" "}
          or read the{" "}
          <Link href="/guides/podcast-to-blog-post" className="font-medium text-primary underline-offset-4 hover:underline">
            workflow guide
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
