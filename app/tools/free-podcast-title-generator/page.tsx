import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { siteConfig } from "@/lib/data";
import { TitleGeneratorClient } from "./title-generator-client";

const canonical = `${siteConfig.url}/tools/free-podcast-title-generator`;

export const metadata: Metadata = {
  title: "Free podcast title generator — SEO episode title ideas",
  description:
    "Enter your episode topic and get searchable title options, keyword angles, and a quick audit of your current wording. Free, no credit card.",
  alternates: { canonical },
  openGraph: {
    title: "Free podcast title generator",
    description: "Free title ideas and keyword angles for your next podcast episode.",
    url: canonical,
  },
};

export default function FreePodcastTitleGeneratorPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-4 pb-4 pt-8 text-center sm:px-6 sm:pt-10">
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Free podcast title generator
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Sharpen your episode headline before you record. For the SEO article, FAQ blocks, and social scripts, use{" "}
          <Link
            href="/tools/seo-growth-pack#pack-transcript-only"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Generate Draft Pack
          </Link>
          .
        </p>
      </div>
      <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
        <TitleGeneratorClient />
      </Suspense>
    </div>
  );
}
