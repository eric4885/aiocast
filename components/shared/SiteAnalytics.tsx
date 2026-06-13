"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const STORAGE_KEY = "aiocast_cookie_choice_v2";

function readChoice(): "essential" | "analytics" | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "essential" || v === "analytics") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function SiteAnalytics({ measurementId }: { measurementId: string }) {
  const gaId = measurementId.trim();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!gaId) return;
    const apply = () => setEnabled(readChoice() === "analytics");
    apply();
    const onChoice = () => apply();
    window.addEventListener("aiocast:cookie-choice", onChoice);
    return () => window.removeEventListener("aiocast:cookie-choice", onChoice);
  }, [gaId]);

  if (!gaId || !enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
