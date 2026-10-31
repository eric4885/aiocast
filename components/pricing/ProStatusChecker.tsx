"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EarlyBirdBadge } from "@/components/pricing/EarlyBirdBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { pricing } from "@/lib/pricing";

type StatusPayload = {
  ok?: boolean;
  pro?: boolean;
  email?: string;
  plan?: string | null;
  earlyBird?: boolean;
  expiresAt?: string;
  annualEarlyBirdRemaining?: number;
  annualEarlyBirdTotal?: number;
  error?: string;
  code?: string;
};

export function ProStatusChecker() {
  const searchParams = useSearchParams();
  const verifiedFlag = searchParams.get("verified");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/pro/status", { credentials: "include" });
      const payload = (await res.json()) as StatusPayload;
      if (res.status === 401 || payload.code === "PROOF_REQUIRED") {
        setStatus(null);
        return;
      }
      setStatus(payload);
      if (payload.email) setEmail(payload.email);
    } catch {
      setStatus(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus, verifiedFlag]);

  const sendVerifyLink = async () => {
    const trimmed = email.trim();
    if (!trimmed.includes("@")) return;
    setSending(true);
    setSendError(null);
    setSent(false);
    try {
      const res = await fetch("/api/pro/verify-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const payload = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setSendError(payload.error ?? "Could not send email.");
        return;
      }
      setSent(true);
    } catch {
      setSendError("Could not send email. Try again shortly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="mt-8 border-border/70">
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="font-semibold text-foreground">Already subscribed?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We email you a one-click verify link for your checkout address. Opening it unlocks Pro limits in{" "}
            <em>this</em> browser (and lets you see status). Annual Early Bird (+2 months) still applies automatically
            for the first {pricing.pro.annualEarlyBirdSlots} yearly subscribers.
          </p>
        </div>

        {verifiedFlag === "1" && (
          <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
            Email verified for this browser. Pro limits apply when you generate packs with the same address.
          </p>
        )}
        {verifiedFlag === "0" && (
          <p className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            That verify link is invalid or expired. Request a new one below.
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <label htmlFor="pro-status-email" className="text-xs font-medium text-muted-foreground">
              Checkout email
            </label>
            <Input
              id="pro-status-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSent(false);
                setSendError(null);
              }}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <Button
            variant="secondary"
            disabled={sending || !email.trim().includes("@")}
            onClick={() => void sendVerifyLink()}
          >
            {sending ? "Sending…" : "Email verify link"}
          </Button>
        </div>

        {sent && (
          <p className="text-sm text-muted-foreground">
            Check your inbox (and spam). Open the link on this device — then refresh or click Check status.
          </p>
        )}
        {sendError && (
          <p className="text-sm text-rose-300" role="alert">
            {sendError}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" disabled={checking} onClick={() => void loadStatus()}>
            {checking ? "Checking…" : "Check status in this browser"}
          </Button>
        </div>

        {status && status.ok !== false && (
          <div className="space-y-3 rounded-lg border border-border bg-background/40 p-4 text-sm">
            {status.email && (
              <p className="text-xs text-muted-foreground">Verified as {status.email}</p>
            )}
            {status.pro ? (
              <>
                <p className="font-medium text-emerald-200">✓ Pro active ({status.plan})</p>
                {status.earlyBird && <EarlyBirdBadge />}
                {status.expiresAt && (
                  <p className="text-muted-foreground">
                    Access until {new Date(status.expiresAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                No active Pro on this verified email yet. Subscribe below with the same address, then verify again if
                needed.
              </p>
            )}
            {typeof status.annualEarlyBirdRemaining === "number" && (
              <p className="text-xs text-muted-foreground">
                Annual Early Bird slots left: {status.annualEarlyBirdRemaining} /{" "}
                {status.annualEarlyBirdTotal ?? 50}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
