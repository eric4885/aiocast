"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SubscribeSource } from "@/lib/subscribe";
import { cn } from "@/lib/utils";

type Props = {
  source: SubscribeSource;
  submitLabel: string;
  layout?: "row" | "stack";
  className?: string;
  /** Extra hint under form (stack layout) */
  finePrint?: string;
  /** Show consent line linking to Privacy (recommended for newsletter capture). Default true. */
  showPrivacyNote?: boolean;
  /** Short placeholder helps narrow footer layouts (e.g. "Email"). */
  emailPlaceholder?: string;
};

export function SubscribeForm({
  source,
  submitLabel,
  layout = "stack",
  className,
  finePrint,
  showPrivacyNote = true,
  emailPlaceholder = "your@email.com",
}: Props) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  function isValidEmail(value: string) {
    const v = value.trim();
    if (v.length < 5 || v.length > 254) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source, website }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        checklistUrl?: string;
        mdUrl?: string;
        emailSent?: boolean;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setMessage(null);
      setEmail("");
      setWebsite("");
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100",
          className,
        )}
      >
        <p className="font-semibold text-emerald-50">
          You&apos;re in — open your checklist now.
        </p>
        <p className="mt-2 text-emerald-100/90">
          We&apos;ve emailed you the links as well (check spam).{" "}
          <Link
            href="/resources/pre-flight-checklist"
            className="font-medium underline underline-offset-4"
          >
            Web checklist
          </Link>
          {" · "}
          <Link
            href="/downloads/pre-flight-checklist.md"
            className="font-medium underline underline-offset-4"
          >
            Markdown download
          </Link>
          .
        </p>
      </div>
    );
  }

  const inner =
    layout === "row" ? (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          aria-label="Email address"
          aria-invalid={status === "error" && Boolean(message)}
          className="min-w-[12rem] sm:min-w-0 sm:flex-1"
        />
        <Button
          type="submit"
          variant="secondary"
          className="shrink-0 sm:w-auto md:w-56"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    ) : (
      <>
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          aria-label="Email address"
          aria-invalid={status === "error" && Boolean(message)}
        />
        <Button type="submit" variant="primary" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </>
    );

  const privacyNote = showPrivacyNote ? (
    <p className="text-xs leading-relaxed text-muted-foreground">
      By submitting your email, you agree we process it to send what you requested and occasional product updates, as
      described in our{" "}
      <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
        Privacy Policy
      </Link>
      . You can unsubscribe from non-transactional emails using the link in any message.
    </p>
  ) : null;

  return (
    <form className={cn(layout === "stack" && "space-y-3", className)} onSubmit={onSubmit} noValidate>
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />
      {inner}
      {privacyNote}
      {finePrint && (
        <p className="text-xs text-muted-foreground">{finePrint}</p>
      )}
      {status === "error" && message && (
        <p className="text-sm text-rose-300" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
