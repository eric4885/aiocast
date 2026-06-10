import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/data";
import { UnsubscribeClient } from "./unsubscribe-client";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Opt out of non-transactional emails from AioCast.",
  robots: { index: false, follow: true },
};

export default function UnsubscribePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          ← Back home
        </Link>
      </p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Unsubscribe</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Stop non-transactional emails such as the weekly AI tools briefing. Transactional messages (for example a growth
        pack link you requested) may still be sent when you use a tool.
      </p>
      <Suspense fallback={<div className="mt-8 text-sm text-muted-foreground">Loading…</div>}>
        <UnsubscribeClient />
      </Suspense>
      <p className="mt-8 text-xs text-muted-foreground">
        Questions? Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary hover:underline">
          {siteConfig.contactEmail}
        </a>
        . See our{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
