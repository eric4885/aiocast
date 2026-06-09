import type { Metadata } from "next";
import { RemoteRecordingView } from "./remote-recording-view";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Localized publishing strategy — podcast growth by region",
  description:
    "Turn each episode into a region-aware schedule with channel intent mapping for search and social growth.",
  alternates: { canonical: `${siteConfig.url}/remote-recording-setup` },
  openGraph: {
    title: "Localized podcast publishing strategy",
    description:
      "Plan when and where to publish your SEO and social outputs by timezone.",
    url: `${siteConfig.url}/remote-recording-setup`,
  },
};

export default function RemoteRecordingSetupPage() {
  return <RemoteRecordingView />;
}
