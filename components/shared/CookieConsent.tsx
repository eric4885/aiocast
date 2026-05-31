"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "aiocast_cookie_choice_v2";

type Choice = "essential" | "analytics";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setVisible(saved !== "essential" && saved !== "analytics");
    } catch {
      setVisible(true);
    }
  }, []);

  function save(choice: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent("aiocast:cookie-choice", { detail: choice }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-card/95 px-4 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-sm text-muted-foreground">
          <p id="cookie-consent-title" className="font-semibold text-foreground">
            Cookies &amp; privacy
          </p>
          <p className="mt-1 leading-relaxed">
            We use essential storage so the site works and your preferences are remembered. If you accept analytics, we
            may load privacy-friendly usage measurement (only when configured). See our{" "}
            <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button type="button" variant="secondary" className="sm:min-w-[100px]" onClick={() => save("essential")}>
            Essential only
          </Button>
          <Button type="button" className="sm:min-w-[100px]" onClick={() => save("analytics")}>
            Accept analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
