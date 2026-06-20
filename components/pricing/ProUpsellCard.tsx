"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { pricing, proPerks } from "@/lib/pricing";
import { CheckoutButtons } from "@/components/pricing/CheckoutButtons";

type Props = {
  email?: string;
  variant?: "full" | "compact";
};

export function ProUpsellCard({ email = "", variant = "full" }: Props) {
  if (variant === "compact") {
    return (
      <Card className="border-primary/35 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <CardContent className="space-y-3 p-5">
          <p className="text-sm font-semibold text-foreground">
            Hit the free limit? Pro unlocks unlimited packs + FAQ JSON-LD.
          </p>
          <CheckoutButtons defaultEmail={email} compact />
          <p className="text-xs text-muted-foreground">
            First month ${pricing.pro.firstMonthUsd} · Annual ${pricing.pro.annualUsd} (
            <Link href="/pro-toolkit" className="text-primary underline-offset-4 hover:underline">
              details
            </Link>
            )
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/40 bg-secondary/60">
      <CardContent className="space-y-5 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">AioCast Pro</p>
            <p className="mt-1 text-lg font-bold text-foreground">Unlimited SEO packs + FAQ schema export</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Free tier: {pricing.free.ipDailyLimit} generations/day. Pro removes limits and adds JSON-LD for FAQ rich
              results. Use the <strong className="text-foreground">same email</strong> at checkout and when you generate.
            </p>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {proPerks.map((perk) => (
            <li key={perk} className="flex gap-2">
              <span className="text-success">✓</span>
              <span>{perk}</span>
            </li>
          ))}
        </ul>
        <CheckoutButtons defaultEmail={email} />
        <p className="text-xs text-muted-foreground">
          Launch offer: first month ${pricing.pro.firstMonthUsd} on monthly · First {pricing.pro.annualEarlyBirdSlots}{" "}
          annual subscribers get {pricing.pro.annualBonusMonths} bonus months (
          <Link href="/pro-toolkit" className="text-primary hover:underline">
            see pricing
          </Link>
          ).
        </p>
      </CardContent>
    </Card>
  );
}
