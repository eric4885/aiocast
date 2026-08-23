import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/data";

export function GuideLayout({
  title,
  description,
  path,
  datePublished,
  dateModified,
  children,
  showTopCta = false,
}: {
  title: string;
  description: string;
  /** Canonical path, e.g. /guides/podcast-to-blog-post */
  path: string;
  datePublished?: string;
  dateModified?: string;
  children: ReactNode;
  showTopCta?: boolean;
}) {
  const base = siteConfig.url.replace(/\/$/, "");
  const pageUrl = `${base}${path}`;
  const published = datePublished ?? "2026-06-15";
  const modified = dateModified ?? published;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Resources", item: `${base}/resources` },
      { "@type": "ListItem", position: 3, name: title, item: pageUrl },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: published,
    dateModified: modified,
    author: { "@type": "Organization", name: siteConfig.name, url: base },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: base,
      logo: { "@type": "ImageObject", url: `${base}/opengraph-image` },
    },
    mainEntityOfPage: pageUrl,
    image: [`${base}/opengraph-image`],
    inLanguage: "en-US",
  };

  return (
    <div className="border-b border-border bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
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
            <li className="text-foreground/80">{title}</li>
          </ol>
        </nav>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">Guide</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Updated{" "}
          <time dateTime={modified}>
            {new Date(modified + "T00:00:00Z").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </time>
        </p>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:leading-loose">{description}</p>
        {showTopCta ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href="/tools/free-show-notes-generator">Free show notes generator</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/tools/seo-growth-pack#pack-transcript-only">Paste transcript → blog draft</Link>
            </Button>
          </div>
        ) : null}
        <article className="prose prose-invert mt-10 max-w-none space-y-6 text-[15px] leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-foreground [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-secondary/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-foreground [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </article>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center">
          <Button size="lg" asChild>
            <Link href="/tools/seo-growth-pack#pack-transcript-only">Generate free blog draft</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/examples/sample-growth-pack">See example output</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
