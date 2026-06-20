"use client";

import { useState } from "react";
import { EarlyBirdBadge } from "@/components/pricing/EarlyBirdBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type StatusPayload = {
  pro?: boolean;
  plan?: string | null;
  earlyBird?: boolean;
  expiresAt?: string;
  annualEarlyBirdRemaining?: number;
  annualEarlyBirdTotal?: number;
};

export function ProStatusChecker() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [checking, setChecking] = useState(false);

  const check = async () => {
    const trimmed = email.trim();
    if (!trimmed.includes("@")) return;
    setChecking(true);
    try {
      const qs = new URLSearchParams({ email: trimmed });
      const res = await fetch(`/api/pro/status?${qs.toString()}`);
      const payload = (await res.json()) as StatusPayload;
      setStatus(payload);
    } catch {
      setStatus({ pro: false });
    } finally {
      setChecking(false);
    }
  };

  return (
    <Card className="mt-8 border-border/70">
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="font-semibold text-foreground">Check Pro status</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the email you used at Creem checkout. Annual Early Bird (+2 months) is applied automatically for the
            first 50 yearly subscribers — no coupon code needed.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <label htmlFor="pro-status-email" className="text-xs font-medium text-muted-foreground">
              Email
            </label>
            <Input
              id="pro-status-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus(null);
              }}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <Button variant="secondary" disabled={checking || !email.trim()} onClick={() => void check()}>
            {checking ? "Checking…" : "Check status"}
          </Button>
        </div>

        {status && (
          <div className="space-y-3 rounded-lg border border-border bg-background/40 p-4 text-sm">
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
              <p className="text-muted-foreground">No active Pro on this email yet.</p>
            )}
            {typeof status.annualEarlyBirdRemaining === "number" && (
              <p className="text-xs text-muted-foreground">
                Annual Early Bird slots left: {status.annualEarlyBirdRemaining} / {status.annualEarlyBirdTotal ?? 50}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
