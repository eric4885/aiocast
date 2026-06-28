import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckoutButtons } from "@/components/pricing/CheckoutButtons";
import { ProStatusChecker } from "@/components/pricing/ProStatusChecker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { freePerks, pricing, proPerks } from "@/lib/pricing";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing — AioCast Pro",
  description:
    "Free podcast SEO growth pack (3/day). Pro $12/mo or $99/yr — unlimited generations, FAQ JSON-LD, full pack history.",
  alternates: { canonical: `${siteConfig.url}/pro-toolkit` },
  openGraph: {
    title: "AioCast Pro pricing",
    description: "Unlimited podcast-to-SEO packs with FAQ schema export.",
    url: `${siteConfig.url}/pro-toolkit`,
  },
};

export default function ProToolkitPage({
  searchParams,
}: {
  searchParams?: { checkout?: string };
}) {
  const checkout = searchParams?.checkout;

  return (
    <div className="border-b border-border bg-gradient-hero bg-grid-subtle">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Pricing</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Simple plans for podcast SEO</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Start free with {pricing.free.ipDailyLimit} generations per day. Upgrade when you publish weekly and need
          unlimited packs, FAQ JSON-LD, and full history in{" "}
          <Link href="/my-packs" className="text-primary underline-offset-4 hover:underline">
            Find my packs
          </Link>
          .
        </p>

        {checkout === "success" && (
          <p className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Payment received — Pro activates in a minute. Use the <strong>same email</strong> at checkout when you
            generate packs.
          </p>
        )}
        {checkout === "canceled" && (
          <p className="mt-6 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
            Checkout canceled. You can still use the free tier anytime.
          </p>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="border-border/80">
            <CardContent className="space-y-6 p-8">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Free</p>
                <p className="mt-2 text-4xl font-bold">$0</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pricing.free.ipDailyLimit} packs / day per IP · last {pricing.free.packHistoryLimit} saved packs
                </p>
              </div>
              <ul className="space-y-3">
                {freePerks.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/tools/seo-growth-pack">Generate free pack</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/45 bg-secondary/70 shadow-glow">
            <CardContent className="space-y-6 p-8">
              <div>
                <p className="text-sm font-semibold text-accent">Pro</p>
                <Badge className="mt-3 border border-primary/40 bg-primary/15 text-primary hover:bg-primary/15">
                  Launch offer — first month only ${pricing.pro.firstMonthUsd}
                </Badge>
                <div className="mt-4 flex flex-wrap items-baseline gap-2">
                  <span className="text-4xl font-bold">${pricing.pro.monthlyUsd}</span>
                  <span className="text-lg text-muted-foreground">/ month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Standard monthly price after your first month.</p>
                <p className="mt-3 text-sm text-foreground/90">
                  Or <strong className="text-foreground">${pricing.pro.annualUsd}/year</strong> billed annually
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  First {pricing.pro.annualEarlyBirdSlots} annual subscribers automatically get{" "}
                  {pricing.pro.annualBonusMonths} bonus months (14 months total) — applied on our side after payment.
                </p>
              </div>
              <ul className="space-y-3">
                {proPerks.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <CheckoutButtons />
            </CardContent>
          </Card>
        </div>

        <ProStatusChecker />

        <Card className="mt-8 border-border/70">
          <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">How Pro unlocks</p>
            <p>
              We match your subscription to the email you use at Creem checkout. Enter that same email when generating a
              pack (or on the result page backup form) so limits lift automatically.
            </p>
            <p>
              Questions?{" "}
              <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
                Contact us
              </Link>{" "}
              or email {siteConfig.contactEmail}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
