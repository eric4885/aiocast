"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim()) return;
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not process your request.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Network error — try again or email us directly.");
    }
  };

  if (status === "done") {
    return (
      <p className="mt-8 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
        You are unsubscribed from non-transactional emails for <strong>{email.trim()}</strong>. It may take a short time
        to propagate. You can resubscribe anytime via the site footer.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-4 rounded-xl border border-border bg-card/40 p-6">
      <label htmlFor="unsubscribe-email" className="text-sm font-semibold">
        Email address
      </label>
      <Input
        id="unsubscribe-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <Button disabled={!email.trim() || status === "loading"} onClick={() => void submit()}>
        {status === "loading" ? "Processing…" : "Unsubscribe"}
      </Button>
      {message && (
        <p className="text-sm text-rose-300" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
