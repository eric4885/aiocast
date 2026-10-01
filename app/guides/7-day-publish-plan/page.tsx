import type { Metadata } from "next";
import { PublishPlanView } from "./publish-plan-view";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: { absolute: "7-Day Podcast Publish Plan Guide" },
  description:
    "Cadence template for SEO articles and social posts. The free growth pack includes a 7-day plan you adapt to your regions.",
  alternates: { canonical: `${siteConfig.url}/guides/7-day-publish-plan` },
  openGraph: {
    title: "Podcast publish schedule guide",
    description:
      "Plan when to ship SEO and social outputs — free pack includes a 7-day rollout you adapt locally.",
    url: `${siteConfig.url}/guides/7-day-publish-plan`,
  },
};

export default function SevenDayPublishPlanPage() {
  return <PublishPlanView />;
}
