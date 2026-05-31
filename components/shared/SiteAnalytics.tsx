"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const STORAGE_KEY = "aiocast_cookie_choice_v2";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

function readChoice(): "essential" | "analytics" | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "essential" || v === "analytics") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function SiteAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const apply = () => setEnabled(readChoice() === "analytics");
    apply();
    const onChoice = () => apply();
    window.addEventListener("aiocast:cookie-choice", onChoice);
    return () => window.removeEventListener("aiocast:cookie-choice", onChoice);
  }, []);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
