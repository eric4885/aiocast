import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function GuideLayout({
  title,
  description,
  children,
  showTopCta = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  showTopCta?: boolean;
}) {
  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          {" · "}
          <Link href="/guides/podcast-to-blog-post" className="text-primary hover:underline">
            Guides
          </Link>
        </p>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">Guide</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:leading-loose">{description}</p>
        {showTopCta ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href="/tools/seo-growth-pack#pack-transcript-only">Paste transcript → get blog draft</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/examples/sample-growth-pack">See example output</Link>
            </Button>
          </div>
        ) : null}
        <article className="prose prose-invert mt-10 max-w-none space-y-6 text-[15px] leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-foreground [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-secondary/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-foreground [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </article>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center">
          <Button size="lg" asChild>
            <Link href="/tools/seo-growth-pack">Generate SEO pack</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/examples/sample-growth-pack">See example output</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
