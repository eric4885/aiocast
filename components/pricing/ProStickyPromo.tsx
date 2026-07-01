"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { pricing } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/** Mobile-sticky / desktop-inline Pro CTA — honest pricing, no fake testimonials. */
export function ProStickyPromo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-primary/30 bg-background/95 px-4 py-3 backdrop-blur-md safe-area-pb sm:static sm:rounded-xl sm:border sm:border-primary/25 sm:bg-primary/5 sm:px-5 sm:py-4 sm:backdrop-blur-none",
        className,
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <p className="min-w-0 text-xs leading-snug text-muted-foreground sm:text-sm">
          <span className="font-semibold text-foreground">Pro</span> — unlimited packs ·{" "}
          <span className="whitespace-nowrap">
            first month ${pricing.pro.firstMonthUsd}, then ${pricing.pro.monthlyUsd}/mo
          </span>
        </p>
        <Button size="sm" className="shrink-0 touch-manipulation" asChild>
          <Link href="/pro-toolkit">See pricing</Link>
        </Button>
      </div>
    </div>
  );
}
