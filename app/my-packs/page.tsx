import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/lib/data";
import { MyPacksClient } from "./my-packs-client";

export const metadata: Metadata = {
  title: "Find my packs",
  description: "Recover private links to your AioCast SEO growth packs by email.",
  alternates: { canonical: `${siteConfig.url}/my-packs` },
  robots: { index: false, follow: true },
};

export default function MyPacksPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
      <MyPacksClient />
    </Suspense>
  );
}
