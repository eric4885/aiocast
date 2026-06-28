"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pricing } from "@/lib/pricing";

type Plan = "monthly" | "annual";

type Props = {
  defaultEmail?: string;
  compact?: boolean;
};

export function CheckoutButtons({ defaultEmail = "", compact = false }: Props) {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (plan: Plan) => {
    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          ...(email.trim() ? { email: email.trim() } : {}),
        }),
      });
      const payload = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !payload.url) {
        setError(payload.error ?? "Could not start checkout.");
        return;
      }
      window.location.href = payload.url;
    } catch {
      setError("Could not reach checkout. Try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="space-y-2">
          <label htmlFor="checkout-email" className="text-sm font-medium text-foreground">
            Checkout email (use the same email when generating packs)
          </label>
          <Input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      )}

      <div className={compact ? "flex flex-col gap-2 sm:flex-row" : "grid gap-3 sm:grid-cols-2"}>
        <Button
          size={compact ? "sm" : "lg"}
          className="h-auto w-full flex-col gap-0.5 py-3"
          disabled={loading !== null}
          onClick={() => void startCheckout("monthly")}
        >
          {loading === "monthly" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          <span>Start Pro — ${pricing.pro.monthlyUsd}/mo</span>
          {!compact && (
            <span className="text-xs font-normal opacity-90">
              First month ${pricing.pro.firstMonthUsd}, then ${pricing.pro.monthlyUsd}/mo
            </span>
          )}
        </Button>
        <Button
          size={compact ? "sm" : "lg"}
          variant="secondary"
          className="h-auto w-full flex-col gap-0.5 py-3"
          disabled={loading !== null}
          onClick={() => void startCheckout("annual")}
        >
          {loading === "annual" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          <span>${pricing.pro.annualUsd}/year</span>
          {!compact && <span className="text-xs font-normal opacity-80">Billed annually</span>}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-rose-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
