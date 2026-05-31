import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  className?: string;
};

export function FunnelNextStep({
  eyebrow = "Next step",
  title,
  description,
  href,
  linkLabel,
  className,
}: Props) {
  return (
    <section className={cn("border-b border-border bg-secondary/25 py-14 sm:py-16", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Card className="border-primary/35 bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
              <p className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
            <Link
              href={href}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:brightness-105"
            >
              {linkLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
