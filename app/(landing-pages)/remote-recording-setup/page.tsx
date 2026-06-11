import type { Metadata } from "next";
import { RemoteRecordingView } from "./remote-recording-view";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "7-day publish plan guide — podcast rollout by region",
  description:
    "Cadence template for lining up SEO articles and social posts. The free growth pack includes a 7-day plan you adapt to your regions.",
  alternates: { canonical: `${siteConfig.url}/remote-recording-setup` },
  openGraph: {
    title: "Podcast publish schedule guide",
    description:
      "Plan when to ship SEO and social outputs — free pack includes a 7-day rollout you adapt locally.",
    url: `${siteConfig.url}/remote-recording-setup`,
  },
};

export default function RemoteRecordingSetupPage() {
  return <RemoteRecordingView />;
}
