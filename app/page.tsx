import type { Metadata } from "next";
import { AnalysisErrorBoundary } from "@/components/AnalysisErrorBoundary";
import { siteConfig } from "@/lib/data";
import { HomeLearnMore } from "@/components/seo/HomeLearnMore";
import { HomeSeoIntro } from "@/components/seo/HomeSeoIntro";
import { homePageJsonLd } from "@/lib/home-page-schema";
import { HomePageClient } from "./home-client";

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
  title: "Paste show notes, get an SEO blog draft — free for solo podcasters",
  description:
    "For solo podcasters without an editor: paste show notes or a transcript, get a free SEO blog draft for your own site. FAQ and social scripts included.",
  openGraph: {
    url: siteConfig.url,
    title: "Paste show notes. Get an SEO blog draft.",
    description:
      "Free SEO blog draft from one episode’s notes — built for indie hosts. Edit and publish on your domain.",
  },
};

function HomePageJsonLd() {
  const payload = homePageJsonLd();
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}

export default function HomePage() {
  return (
    <AnalysisErrorBoundary>
      <HomePageJsonLd />
      <HomeSeoIntro />
      <HomePageClient />
      <HomeLearnMore />
    </AnalysisErrorBoundary>
  );
}
