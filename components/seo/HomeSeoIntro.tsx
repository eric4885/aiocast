import Link from "next/link";

/** Server-rendered homepage intro for crawlers and SEO tools (single H1 on the page). */
export function HomeSeoIntro() {
  return (
    <section className="border-b border-border bg-background bg-grid-subtle">
      <div className="mx-auto max-w-4xl px-4 py-8 text-center sm:px-6 sm:py-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:tracking-[0.2em]">
          Free podcast SEO tool
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-balance text-[clamp(1.55rem,4vw+0.55rem,3rem)] font-bold leading-[1.12] tracking-tight text-foreground">
          Turn show notes into a <span className="text-primary">search-ready SEO growth pack</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          AioCast.com helps indie podcasters repurpose one episode into written assets Google can index: an SEO article
          draft, FAQ blocks, social scripts for X / LinkedIn / Substack, subtitle-ready highlights, and a 7-day publish
          plan. Paste a transcript or upload up to 5 minutes of audio on the free tier — no account required.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground/90">
          Optional: try the{" "}
          <Link href="#analyze-tool" className="font-medium text-primary underline-offset-4 hover:underline">
            title tryout
          </Link>{" "}
          below, or open the{" "}
          <Link href="/tools/seo-growth-pack" className="font-medium text-primary underline-offset-4 hover:underline">
            full SEO growth pack generator
          </Link>
          . See a{" "}
          <Link href="/examples/sample-growth-pack" className="font-medium text-primary underline-offset-4 hover:underline">
            sample output
          </Link>{" "}
          or read the{" "}
          <Link href="/guides/podcast-to-blog-post" className="font-medium text-primary underline-offset-4 hover:underline">
            podcast-to-blog workflow guide
          </Link>{" "}
          before you run your first episode.
        </p>
        <h2 className="mx-auto mt-8 max-w-2xl text-left text-base font-semibold text-foreground sm:text-center">
          What the free pack includes
        </h2>
        <ul className="mx-auto mt-3 max-w-xl list-inside list-disc space-y-1.5 text-left text-sm leading-relaxed text-muted-foreground sm:text-center sm:list-none sm:space-y-2">
          <li>SEO blog post draft with meta description and keyword suggestions</li>
          <li>Three FAQ blocks you can paste into your site or newsletter</li>
          <li>Ready-to-edit social copy for X, LinkedIn, and Substack</li>
          <li>7-day publish schedule with timing hints you adapt locally</li>
        </ul>
      </div>
    </section>
  );
}
