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
          Turn show notes into a <span className="text-primary">publish-ready SEO draft pack</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          AioCast helps indie podcasters repurpose one episode into an SEO article draft, FAQ blocks, social scripts,
          and a 7-day publish plan — paste a transcript or upload up to 5 minutes of audio. You edit and publish on your
          own site; rankings take time and are never guaranteed.
          Try the{" "}
          <Link href="#analyze-tool" className="font-medium text-primary underline-offset-4 hover:underline">
            title tryout
          </Link>{" "}
          below, open the{" "}
          <Link href="/tools/seo-growth-pack" className="font-medium text-primary underline-offset-4 hover:underline">
            full SEO growth pack generator
          </Link>
          , or browse the{" "}
          <Link href="/examples/sample-growth-pack" className="font-medium text-primary underline-offset-4 hover:underline">
            sample output
          </Link>{" "}
          and{" "}
          <Link href="/guides/podcast-to-blog-post" className="font-medium text-primary underline-offset-4 hover:underline">
            workflow guide
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
